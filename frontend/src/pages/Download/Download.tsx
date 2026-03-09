import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Input from '../../components/Input/Input';
import Callout from '../../components/Callout/Callout';
import './Download.css';
import {downloadFile, getFileMetadata, type FileMetadata} from "../../services/Files/files.service.ts";
import { formatSize, getDaysUntilExpiry, getExpiryCallout } from '../../utils/files.utils';
import IconFile from "../../assets/image_file_icon.svg";
import DownloadIcon from "../../assets/Upload_cloud.svg";

export default function Download() {
    const { token } = useParams<{ token: string }>();
    const [file, setFile] = useState<FileMetadata | null>(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) return;

        getFileMetadata(token)
            .then(setFile)
            .catch((err: Error) => setError(err.message));

    }, [token]);

    const daysLeft = file ? getDaysUntilExpiry(file.expiresAt) : 0;

    const handleDownload = async () => {
        if (!token) return;
        try {
            await downloadFile(token);
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
        }
    };

    return (
        <div className="gradient-bg">
            <Header />
            <div className="download__wrapper">
                <div className="download__card">
                    <h1 className="download__title">Télécharger un fichier</h1>
                    {file && (
                        <>
                            <div className="download__file">
                                <span className="download__file-icon">
                                    <img src={IconFile} alt="Icon file"/>
                                </span>
                                <div>
                                    <p className="download__file-name">{file.originalName}</p>
                                    <p className="download__file-size">{formatSize(file.size)}</p>
                                </div>
                            </div>

                            {file.hasPassword && (
                                <Input
                                    id="password"
                                    label="Mot de passe"
                                    type="password"
                                    placeholder="Saisissez le mot de passe..."
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            )}
                        </>
                    )}

                    {file && (() => {
                        const callout = getExpiryCallout(daysLeft);
                        return callout ? <Callout informationType={callout.type} message={callout.message} /> : null;
                    })()}

                    {error && <Callout informationType="error" message={error} />}

                    {daysLeft > 0 && <button onClick={handleDownload} className="download__btn">
                        <img src={DownloadIcon} alt="Download icon"/>
                        <p>Télécharger</p>
                    </button>}
                </div>
            </div>
        </div>
    );
}