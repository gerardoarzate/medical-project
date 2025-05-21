import { io, Socket } from "socket.io-client";

interface IMessage {
    sentBySelf: boolean,
    content: string
}

interface IReceiveMessageEventBody {
    message: string
}

interface IReceivePatientDataEventBody {
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

type Listener = (payload: any) => void;
type MessageListener = (messageHistory: IMessage[]) => any;
type PatientDataListener = (patientData: IReceivePatientDataEventBody) => any;

/**
 * Class that manages a Socket.io connection with the server, as well
 * as data and events for the medical assistance feature of the app.
 */
export abstract class AssistanceService {
    protected readonly socket: Socket;
    private messages: IMessage[] = [];
    private readonly messageListeners: MessageListener[] = [];

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

        this.on('receiveMessage', ({ message }: IReceiveMessageEventBody) =>
            this.handleReceiveMessage(message)
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
        
        const msgObj: IMessage = {
            content: message,
            sentBySelf: true
        }
        this.addMessages(msgObj);
    }

    addMessageListener(listener: MessageListener) {
        this.messageListeners.push(listener);
    }

    removeMessageListener(listener: MessageListener) {
        const index = this.messageListeners.indexOf(listener);
        if (index !== -1) {
            this.messageListeners.splice(index, 1);
        }
    }

    protected on(event: string, listener: Listener) {
        this.socket.on(event, listener);
    }

    protected off(event: string, listener: Listener) {
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
        const storedMessages: IMessage[] | null = storedMessagesStr && JSON.parse(storedMessagesStr);
        
        if (storedMessages) {
            this.messages = [];
            this.addMessages(...storedMessages);
        }
    }

    private addMessages(...messages: IMessage[]) {
        this.messages.push(...messages);
        this.storeMessageHistory();
        for (const listener of this.messageListeners) {
            listener([...this.messages]);
        }
    }

    private handleReceiveMessage(message: string) {
        const msgObj: IMessage = {
            content: message,
            sentBySelf: false
        };
        this.addMessages(msgObj);
    }
}

export class ClinicianAssistanceService extends AssistanceService {
    private readonly patientDataListeners: PatientDataListener[] = [];


    constructor(apiUrl: string, token: string, currentLatitude: number, currentLongitude: number) {
        super(apiUrl, token, currentLatitude, currentLongitude);

        this.on('receiveCounterpartData', (data: IReceivePatientDataEventBody) =>
            this.handleReceivePatientData(data)
        );
    }

    endRequest(message: string) {
        this.socket.emit('endRequest', {
            message: message
        });
    }

    addPatientDataListener(listener: PatientDataListener) {
        this.patientDataListeners.push(listener);
    }

    removePatientDataListener(listener: PatientDataListener) {
        const index = this.patientDataListeners.indexOf(listener);
        if (index !== -1) {
            this.patientDataListeners.splice(index, 1);
        }
    }
    
    private handleReceivePatientData(data: IReceivePatientDataEventBody) {
        for (const listener of this.patientDataListeners) {
            listener(data);
        }
    }
}