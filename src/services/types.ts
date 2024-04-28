export interface Product {
    _id: number;
    name: string;
    price: number;
    category: string;
    addedAt: any;
}

export interface User {
    _id: number;
    username: string;
    password?: string;
    name?: string;
    avatar?: string; // URL
}

export interface Conversation {
    chats: {
        _id: number;
        seller: User;
        buyer: User;
        conversation: Message[];
    };
    isBuyer?: boolean;
    myId: number;
}

export interface Message {
    _id: number;
    message: string;
    senderId: number;
}