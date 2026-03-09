const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface FileMetadata {
    originalName: string;
    size: number;
    expiresAt: string;
    mimeType: string;
    hasPassword: boolean;
}

export interface UploadResult {
    token: string;
    originalName: string;
    size: number;
    expiresAt: string;
}

export interface FileItem {
    token: string;
    originalName: string;
    expiresAt: string;
    isExpired: boolean;
    hasPassword: boolean;
}
export async function getFileMetadata(token: string): Promise<FileMetadata> {
    const res = await fetch(`${API_URL}/files/metadata/${token}`);

    if (res.status === 404) {
        throw new Error('Fichier introuvable.');
    }

    if (res.status === 410) {
        throw new Error('Ce lien a expiré.');
    }

    if (!res.ok) {
        throw new Error('Erreur lors de la récupération du fichier.');
    }

    return res.json();
}

export async function downloadFile(token: string): Promise<void> {
    const res = await fetch(`${API_URL}/files/download/${token}`);

    if (res.status === 410) {
        throw new Error('Ce lien a expiré.');
    }

    if (!res.ok) {
        throw new Error('Erreur lors du téléchargement.');
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    a.click();
    URL.revokeObjectURL(url);
}

export async function uploadFile(
    file: File,
    password?: string,
    expiresAt?: string
): Promise<UploadResult> {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('file', file);
    if (password) formData.append('password', password);
    if (expiresAt) formData.append('expiresAt', expiresAt);

    const res = await fetch(`${API_URL}/files/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    if (res.status === 401) {
        throw new Error('Vous devez être connecté pour envoyer un fichier.');
    }

    if (!res.ok) {
        throw new Error("Erreur lors de l'envoi du fichier.");
    }

    return res.json();
}

export async function getHistory(): Promise<FileItem[]> {
    const token = localStorage.getItem('auth_token');

    const res = await fetch(`${API_URL}/files/history`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
        throw new Error('Vous devez être connecté.');
    }

    if (!res.ok) {
        throw new Error('Erreur lors de la récupération des fichiers.');
    }

    const data = await res.json();
    return data.data;
}

export async function deleteFile(token: string): Promise<void> {
    const authToken = localStorage.getItem('auth_token');

    const res = await fetch(`${API_URL}/files/${token}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
    });

    if (res.status === 401) {
        throw new Error('Vous devez être connecté.');
    }

    if (!res.ok) {
        throw new Error('Erreur lors de la suppression du fichier.');
    }
}