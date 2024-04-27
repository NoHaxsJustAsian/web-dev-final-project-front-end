import supabase from "../supabaseClient";
import { Product } from "./types";

//look into converting this into supabase

const baseUrl = 'http://localhost:5000';

// export async function getAll(query: any) {
//     if (query !== "" && query !== undefined) {
//         return (await fetch(`${baseUrl}/products?search=${query}`, { credentials: 'include' })).json();
//     }
// }
export async function getAll(query: string) {
    if (query !== "" && query !== undefined) {
        return await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${query}%`);
    }
}

// export async function getSpecific(id: number) {
//     return (await fetch(`${baseUrl}/products/specific/${id}`, { credentials: 'include' })).json();
// }
export async function getSpecific(id: number) {
    return await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
}

// export async function createProduct(product: Product): Promise<Product> {
//     return (await fetch(`${baseUrl}/products/create`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(product)
//     })).json();
// }
export async function createProduct(product: Product): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        .insert([product])
        .single();  

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error("No data was returned from the insert operation.");
    }

    return data; 
}

// export async function editProduct(id: number, product: Product) {
//     return (await fetch(`${baseUrl}/products/edit/${id}`, {
//         method: 'PATCH',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(product)
//     })).json();
// }
export async function editProduct(id: number, product: Product) {
    return await supabase
        .from('products')
        .update(product)
        .eq('id', id);
}

// export async function activateSell(id: number) {
//     return (await fetch(`/products/enable/${id}`)).json()
// }
export async function activateSell(id: number) {
    return await supabase
        .from('products')
        .update({ status: 'active' })
        .eq('id', id);
}

// export async function archiveSell(id: number) {
//     return (await fetch(`/products/archive/${id}`)).json()
// }
export async function archiveSell(id: number) {
    return await supabase
        .from('products')
        .update({ status: 'archived' })
        .eq('id', id);
}

// export async function wishProduct(id: number) {
//     return (await fetch(`${baseUrl}/products/wish/${id}`, { credentials: 'include' })).json();
// }
export async function wishProduct(id: number) {
    const { data: { user }  } = await supabase.auth.getUser();
    if (user!==null){
    return await supabase
        .from('wishlist')
        .insert([{ user_id: user.id, product_id: id }]);}
}
