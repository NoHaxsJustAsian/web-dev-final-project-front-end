import supabase from "../supabaseClient";

const baseUrl = 'http://localhost:5000';

//look into converting this into supabase

// export async function createChatRoom(receiver: string, message: string) {
//     return (await fetch(`${baseUrl}/messages/createChatRoom`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({message: message, receiver: receiver})
//     })).json();
// }
export async function createChatRoom(receiver: string, message: string) {
    return await supabase
        .from('chat_rooms')
        .insert([
            { receiver, message }
        ]);
}

// export async function getUserConversations() {
//     return (await fetch(`${baseUrl}/messages/getUserConversations`, { credentials: 'include' })).json();
// }
export async function getUserConversations() {
    const { data } = await supabase
        .from('chat_rooms')
        .select('*');

    return data; 
}

// export async function sendMessage(chatId: number, message: any) {
//     return (await fetch(`${baseUrl}/messages/sendMessage`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({chatId, message})
//     })).json();
// }
export async function sendMessage(chatId: number, message: string) {
    return await supabase
        .from('messages')
        .insert([
            { chat_id: chatId, message }
        ]);
}