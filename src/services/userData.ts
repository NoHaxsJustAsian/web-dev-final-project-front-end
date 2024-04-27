import supabase from "../supabaseClient";
import { User } from "./types";

const baseUrl = 'http://localhost:5000';

// export async function getUserActiveSells(id:number) {
//     return (await fetch(`${baseUrl}/products/sells/active/${id}`, {credentials: 'include'})).json();
// }
export async function getUserActiveSells(id: number) {
    return await supabase
        .from('products')
        .select('*')
        .eq('user_id', id)
        .eq('status', 'active');
}

// export async function getUserArchivedSells() {
//     return (await fetch(`${baseUrl}/products/sells/archived`, {credentials: 'include'})).json();
// }
export async function getUserArchivedSells() {
    const { data: { user }  } = await supabase.auth.getUser();
    if (user!==null){
    return await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'archived');}
}

// export async function getUserWishlist() {
//     return (await fetch(`${baseUrl}/products/wishlist/getWishlist`, {credentials: 'include'})).json();
// }
export async function getUserWishlist() {
    const { data: { user }  } = await supabase.auth.getUser();
    if (user!==null){
    return await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id);}
}

// export async function editUserProfile(id:number, data: User) {
//     return (await fetch(`/user/edit-profile/${id}`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(data)
//     })).json();
// }
export async function editUserProfile(id: number, data: User) {
    return await supabase
        .from('users')
        .update(data)
        .match({ id: id });
}

// export async function getUserById(id:number) {
//     return await (await fetch(baseUrl + `/user/getUserById/${id}`, {credentials: 'include'})).json()
// }
export async function getUserById(id: number) {
    return await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
}
