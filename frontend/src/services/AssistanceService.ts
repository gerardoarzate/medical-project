import { io, Socket } from "socket.io-client";

interface Message {
    sentBySelf: boolean,
    content: string
}

interface ReceiveMessageEventBody {
    message: string
}

interface ReceivePatientDataEventBody {
    fullName: string,
    height: number,
    weight: number,
    age: number,
    sex: string,
    telephone: string,
    notes: string,
    requestTimestamp: number,
    emergencyTypeId: number
}

interface RequestBody {
    emergencyTypeId: number,
    notes: string,
    initialLatitude: number,
    initialLongitude: number
}

interface ReceiveClinicianDataEventBody {
    fullName: string,
    licence: string,
    speciality: string,
    telephone: string
}

type MessageHistory = Message[];

type Listener<Data> = (data: Data) => any;
type SocketListener = Listener<any>;
type MessageListener = Listener<MessageHistory>;
type PatientDataListener = Listener<ReceivePatientDataEventBody>;
type ClinicianDataListener = Listener<ReceiveClinicianDataEventBody>;
type RequestCreatedListener = Listener<undefined>;

class ListenerList<Data> {
    private readonly listeners: Listener<Data>[] = [];

    add(listener: Listener<Data>) {
        this.listeners.push(listener);
    }

    remove(listener: Listener<Data>) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    emit(data: Data) {
        for (const listener of this.listeners) {
            try {
                listener(data);
            } catch (error) {
                console.error('Listener threw an error:', error);
            }
        }
    }
}

/**
 * Class that manages a Socket.io connection with the server, as well
 * as data and events for the medical assistance feature of the app.
 */
export abstract class AssistanceService {
    protected readonly socket: Socket;
    private messages: MessageHistory = [];
    private readonly messageListeners = new ListenerList<MessageHistory>();

    constructor(apiUrl: string, token: string, currentLatitude: number, currentLongitude: number) {
        const socket = io(apiUrl, {
            auth: {
                token,
                currentLatitude,
                currentLongitude
            }
        });
        this.socket = socket;
        
        this.loadStoredMessageHistory();

        this.on('receiveMessage', (data: ReceiveMessageEventBody) =>
            this.handleReceiveMessage(data)
        );
    }

    end() {
        this.disconnect();
        localStorage.removeItem('chat');
        for (const key in this) {
            delete this[key];
        }
    }

    sendMessage(message: string) {
        this.socket.emit('sendMessage', {
            message: message
        });
        
        const msgObj: Message = {
            content: message,
            sentBySelf: true
        }
        this.addMessages(msgObj);
    }

    addMessageListener(listener: MessageListener) {
        this.messageListeners.add(listener);
    }

    removeMessageListener(listener: MessageListener) {
        this.messageListeners.remove(listener);
    }

    protected on(event: string, listener: SocketListener) {
        this.socket.on(event, listener);
    }

    protected off(event: string, listener: SocketListener) {
        this.socket.off(event, listener);
    }

    private disconnect() {
        this.socket.disconnect();
    }

    private storeMessageHistory() {
        const historyStr = JSON.stringify(this.messages);
        localStorage.setItem('chat', historyStr);
    }

    private loadStoredMessageHistory() {
        const storedMessagesStr = localStorage.getItem('chat');
        const storedMessages: MessageHistory | null = storedMessagesStr && JSON.parse(storedMessagesStr);
        
        if (storedMessages) {
            this.messages = [];
            this.addMessages(...storedMessages);
        }
    }

    private addMessages(...messages: Message[]) {
        this.messages.push(...messages);
        this.storeMessageHistory();
        this.messageListeners.emit([...this.messages]);
    }

    private handleReceiveMessage(data: ReceiveMessageEventBody) {
        const { message } = data;
        const msgObj: Message = {
            content: message,
            sentBySelf: false
        };
        this.addMessages(msgObj);
    }
}

/**
 * Class that manages a Socket.io connection with the server, as well
 * as data and events for the medical assistance features of clinicians
 * in the app.
 */
export class ClinicianAssistanceService extends AssistanceService {
    private readonly patientDataListeners = new ListenerList<ReceivePatientDataEventBody>();

    constructor(apiUrl: string, token: string, currentLatitude: number, currentLongitude: number) {
        super(apiUrl, token, currentLatitude, currentLongitude);

        this.on('receiveCounterpartData', (data: ReceivePatientDataEventBody) =>
            this.patientDataListeners.emit(data)
        );
    }

    endRequest() {
        this.socket.emit('endRequest');
    }

    addPatientDataListener(listener: PatientDataListener) {
        this.patientDataListeners.add(listener);
    }

    removePatientDataListener(listener: PatientDataListener) {
        this.patientDataListeners.remove(listener);
    }
}

/**
 * Class that manages a Socket.io connection with the server, as well
 * as data and events for the medical assistance features of patients
 * in the app.
 */
export class PatientAssistanceService extends AssistanceService {
    private readonly clinicianDataListeners = new ListenerList<ReceiveClinicianDataEventBody>();
    private readonly requestCreatedListeners = new ListenerList<undefined>();

    constructor(apiUrl: string, token: string, currentLatitude: number, currentLongitude: number) {
        super(apiUrl, token, currentLatitude, currentLongitude);

        this.on('receiveCounterpartData', (data: ReceiveClinicianDataEventBody) =>
            this.clinicianDataListeners.emit(data)
        );

        this.on('isRequestCreated', () =>
            this.requestCreatedListeners.emit(undefined)
        );
    }

    createRequest(data: RequestBody) {
        this.socket.emit('createRequest', data);
    }

    addClinicianDataListener(listener: ClinicianDataListener) {
        this.clinicianDataListeners.add(listener);
    }

    removeClinicianDataListener(listener: ClinicianDataListener) {
        this.clinicianDataListeners.remove(listener);
    }

    addRequestCreatedListener(listener: RequestCreatedListener) {
        this.requestCreatedListeners.add(listener);
    }

    removeRequestCreatedListener(listener: RequestCreatedListener) {
        this.requestCreatedListeners.remove(listener);
    }
}