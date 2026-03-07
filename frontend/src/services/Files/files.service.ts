const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export interface FileMetadata {
    originalName: string;
    size: number;
    expiresAt: string;
    mimeType: string;
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