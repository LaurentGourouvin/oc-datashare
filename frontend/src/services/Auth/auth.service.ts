const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface AuthResponse {
    access_token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error('Email ou mot de passe incorrect.');
    }

    const data: AuthResponse = await res.json();
    saveToken(data.access_token)

    return data;
}

export async function register(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error('Erreur lors de la création du compte.');
    }


    const data: AuthResponse = await res.json();
    saveToken(data.access_token)

    return data;
}

function saveToken(token: string) : void {
    localStorage.setItem("auth_token", token);
}