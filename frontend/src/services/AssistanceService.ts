import { io, Socket } from "socket.io-client";

interface IMessage {
    sentBySelf: boolean,
    content: string
}

interface IReceiveMessageEventBody {
    message: string
}

type Listener = (payload: any) => void;
type MessageListener = (messageHistory: IMessage[]) => any;

/**
 * Class that manages a Socket.io connection with the server, as well
 * as data and events for the medical assistance feature of the app.
 */
abstract class AssistanceService {
    private readonly socket: Socket;
    private messages: IMessage[] = [];
    private readonly messageListeners: Listener[] = [];

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
