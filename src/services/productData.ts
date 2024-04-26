import { Product } from "./types";

//look into converting this into supabase

const baseUrl = 'http://localhost:5000';

export async function getAll(page: number, category: string, query: any) {
    if (query !== "" && query !== undefined) {
        return (await fetch(`${baseUrl}/products?page=${page}&search=${query}`, { credentials: 'include' })).json();
    } else if (category && category !== 'all') {
        return (await fetch(`${baseUrl}/products/${category}?page=${page}`, { credentials: 'include' })).json();
    } else {
        return (await fetch(`${baseUrl}/products?page=${page}`, { credentials: 'include' })).json();
    }
}

export async function getSpecific(id: number) {
    return (await fetch(`${baseUrl}/products/specific/${id}`, { credentials: 'include' })).json();
}


export async function createProduct(product: Product): Promise<Product> {
    return (await fetch(`${baseUrl}/products/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(product)
    })).json();
}

export async function editProduct(id: number, product: Product) {
    return (await fetch(`${baseUrl}/products/edit/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(product)
    })).json();
}


export async function activateSell(id: number) {
    return (await fetch(`/products/enable/${id}`)).json()
}

export async function archiveSell(id: number) {
    return (await fetch(`/products/archive/${id}`)).json()
}

export async function wishProduct(id: number) {
    return (await fetch(`${baseUrl}/products/wish/${id}`, { credentials: 'include' })).json();
}





