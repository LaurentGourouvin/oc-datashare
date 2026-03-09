export function formatSize(bytes: number): string {
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
}

export function getDaysUntilExpiry(expiresAt: string): number {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getExpiryCallout(daysLeft: number): { type: 'info' | 'warning' | 'error'; message: string } | null {
    if (daysLeft <= 0) return { type: 'error', message: 'Ce fichier n\'est plus disponible en téléchargement car il a expiré.' };
    if (daysLeft === 1) return { type: 'warning', message: 'Ce fichier expirera demain.' };
    if (daysLeft <= 3) return { type: 'info', message: `Ce fichier expirera dans ${daysLeft} jours.` };
    return null;
}

export function getDaysLabel(expiresAt: string): string {
    const now = Date.now();
    const diff = new Date(expiresAt).getTime() - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Expiré';
    if (days === 1) return 'Expire demain';
    return `Expire dans ${days} jours`;
}