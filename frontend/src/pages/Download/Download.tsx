import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Callout from '../../components/Callout/Callout';
import './Download.css';
import DownloadIcon from "../../assets/download_cloud.png";

interface FileMetadata {
    originalName: string;
    size: number;
    expiresAt: string;
}

function formatSize(bytes: number): string {
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
}

function getDaysUntilExpiry(expiresAt: string): number {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function Download() {
    const { token } = useParams<{ token: string }>();
    const [file, setFile] = useState<FileMetadata | null>(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // fetch metadata
    }, [token]);

    const daysLeft = file ? getDaysUntilExpiry(file.expiresAt) : 0;

    const handleDownload = async () => {
        // appel API download
    };

    return (
        <div className="gradient-bg">
            <Header variant="login" />
            <div className="download__wrapper">
                <div className="download__card">
                    <h1 className="download__title">Télécharger un fichier</h1>

                    {file && (
                        <>
                            <div className="download__file">
                                <span className="download__file-icon">🗎</span>
                                <div>
                                    <p className="download__file-name">{file.originalName}</p>
                                    <p className="download__file-size">{formatSize(file.size)}</p>
                                </div>
                            </div>

                            <Callout
                                informationType={daysLeft <= 1 ? 'warning' : 'info'}
                                message={
                                    daysLeft <= 1
                                        ? 'Ce fichier expirera demain.'
                                        : `Ce fichier expirera dans ${daysLeft} jours.`
                                }
                            />

                            <Input
                                id="password"
                                label="Mot de passe"
                                type="password"
                                placeholder="Saisissez le mot de passe..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </>
                    )}

                    {error && <Callout informationType="error" message={error} />}

                    <Button
                        className="download__btn"
                        label="Télécharger"
                        onClick={handleDownload}
                    />
                </div>
            </div>
        </div>
    );
}