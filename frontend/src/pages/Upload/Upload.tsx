import { useState, useRef } from 'react';
import Header from '../../components/Header/Header';
import './Upload.css';
import { uploadFile, type UploadResult } from '../../services/Files/files.service';
import IconFile from "../../assets/image_file_icon.svg";
import UploadIcon from "../../assets/Upload_cloud.svg"

type UploadState = 'default' | 'selected' | 'error' | 'success';
export default function Upload() {
    const [state, setState] = useState<UploadState>('default');
    const [file, setFile] = useState<File | null>( null);
    const [password, setPassword] = useState('');
    const [expiration, setExpiration] = useState('1');
    const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const MAX_SIZE = 1024 * 1024 * 1024;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        if (selected.size > MAX_SIZE) {
            setFile(selected);
            setErrorMessage('La taille des fichiers est limitée à 1 Go.');
            setState('error');
            return;
        }
        setFile(selected);
        setErrorMessage('');
        setState('selected');
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + parseInt(expiration));

            const res = await uploadFile(file, password || undefined, expiresAt.toISOString());
            setUploadResult(res);
            setState('success');
        } catch (err: unknown) {
            if (err instanceof Error) setErrorMessage(err.message);
            setState('error');
        }
    };

    const handleCopyLink = () => {
        if (!uploadResult) return;
        const link = `${window.location.origin}/download/${uploadResult.token}`;
        navigator.clipboard.writeText(link);
    };

    return (
        <div className="gradient-bg">
            <Header />
            <div className="upload__wrapper">
                {state === 'default' && (
                    <div className="upload__card">
                        <h1 className="upload__title">Ajouter un fichier</h1>
                        <button
                            className="upload__submit-btn"
                            onClick={() => inputRef.current?.click()}
                        >
                            Choisir un fichier
                        </button>
                    </div>
                )}
                {(state === 'selected' || state === 'error') && (
                    <div className="upload__card">
                        <h1 className="upload__title">Ajouter un fichier</h1>
                        <div className="upload__file">
                            <span className="upload__file-icon">
                                <img src={IconFile} alt="Icon file"/>
                            </span>
                            <div className="upload__file-info">
                                <p className="upload__file-name">{file?.name}</p>
                                <p className={`upload__file-size${state === 'error' ? ' upload__file-size--error' : ''}`}>
                                    {file ? (file.size / (1024 * 1024)).toFixed(1) + ' Mo' : ''}
                                </p>
                                {state === 'error' && <p className="upload__error">{errorMessage}</p>}
                            </div>
                            <button className="upload__change-btn" onClick={() => inputRef.current?.click()}>Changer</button>
                        </div>
                        <label className="upload__label">Mot de passe</label>
                        <input className="upload__input" type="password" placeholder="Optionnel" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <label className="upload__label">Expiration</label>
                        <select className="upload__select" value={expiration} onChange={(e) => setExpiration(e.target.value)}>
                            <option value="1">Une journée</option>
                            <option value="3">3 jours</option>
                            <option value="7">Une semaine</option>
                        </select>
                        <button className="upload__submit-btn" onClick={handleUpload} disabled={state === 'error'}>
                            <img src={UploadIcon} alt="Upload icon"/>
                           <p>Téléverser</p>
                        </button>
                    </div>
                )}
                {state === 'success' && uploadResult && (
                    <div className="upload__card">
                        <h1 className="upload__title">Ajouter un fichier</h1>
                        <div className="upload__file">
                            <span className="upload__file-icon">🗎</span>
                            <div>
                                <p className="upload__file-name">{uploadResult.originalName}</p>
                                <p className="upload__file-size">{file ? (file.size / (1024 * 1024)).toFixed(1) + ' Mo' : ''}</p>
                            </div>
                        </div>
                        <p className="upload__success-text">Félicitations, ton fichier sera conservé chez nous pendant une semaine !</p>
                        <a className="upload__link" href={`/download/${uploadResult.token}`} target="_blank" rel="noreferrer">
                            {`${window.location.origin}/download/${uploadResult.token}`}
                        </a>
                        <button className="upload__copy-btn" onClick={handleCopyLink}>📋 Copier le lien</button>
                    </div>
                )}
            </div>
            <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} />
            <footer className="upload__footer">Copyright DataShare® 2025</footer>
        </div>
    );
}