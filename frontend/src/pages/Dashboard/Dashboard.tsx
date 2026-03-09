import {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import {getDaysLabel} from "../../utils/files.utils.ts";
import {deleteFile, getHistory} from "../../services/Files/files.service.ts";
import IconFile from "../../assets/image_file_icon.svg";
import IconTrash from "../../assets/Trash_2.svg";
import LogoutIcon from "../../assets/Log_out.svg";

type Filter = 'tous' | 'actifs' | 'expire';

interface FileItem {
    token: string;
    originalName: string;
    expiresAt: string;
    isExpired: boolean;
    hasPassword: boolean;
}

export default function Dashboard() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [filter, setFilter] = useState<Filter>('tous');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getHistory()
            .then(setFiles)
            .catch(() => navigate('/login'));
    }, []);

    const handleDelete = async (token: string) => {
        try {
            await deleteFile(token);
            setFiles(files.filter(f => f.token !== token));
        } catch (err: unknown) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        navigate('/login');
    };


    const filteredFiles = files.filter(f => {
        if (filter === 'actifs') return !f.isExpired;
        if (filter === 'expire') return f.isExpired;
        return true;
    });

    return (
        <div className="dashboard">

            {/* SIDEBAR DESKTOP + MOBILE OVERLAY */}
            <aside className={`dashboard__sidebar ${sidebarOpen ? 'dashboard__sidebar--open' : ''}`}>
                <div className="dashboard__sidebar-header">
                    {sidebarOpen && (
                        <button className="dashboard__sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
                    )}
                    <span className="dashboard__logo">DataShare</span>
                </div>
                <nav className="dashboard__nav">
                    <button className="dashboard__nav-item dashboard__nav-item--active">Mes fichiers</button>
                </nav>
                <footer className="dashboard__sidebar-footer">Copyright DataShare® 2025</footer>
            </aside>

            {sidebarOpen && (
                <div className="dashboard__overlay" onClick={() => setSidebarOpen(false)} />
            )}

            {/* MAIN */}
            <div className="dashboard__main">

                {/* HEADER */}
                <header className="dashboard__header">
                    <button className="dashboard__hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
                    <div className="dashboard__header-actions">
                        <button className="dashboard__btn-add" onClick={() => navigate('/upload')}>
                            Ajouter des fichiers
                        </button>
                        <button className="dashboard__btn-logout" onClick={handleLogout}>
                            <img src={LogoutIcon} alt="Log out icon"/>
                            <p>Déconnexion</p>
                        </button>
                    </div>
                </header>

                {/* CONTENT */}
                <div className="dashboard__content">
                    <h1 className="dashboard__title">Mes fichiers</h1>

                    <div className="dashboard__filters">
                        <button
                            className={`dashboard__filter ${filter === 'tous' ? 'dashboard__filter--active' : ''}`}
                            onClick={() => setFilter('tous')}
                        >Tous</button>
                        <button
                            className={`dashboard__filter ${filter === 'actifs' ? 'dashboard__filter--active' : ''}`}
                            onClick={() => setFilter('actifs')}
                        >Actifs</button>
                        <button
                            className={`dashboard__filter ${filter === 'expire' ? 'dashboard__filter--active' : ''}`}
                            onClick={() => setFilter('expire')}
                        >Expiré</button>
                    </div>

                    <ul className="dashboard__list">
                        {filteredFiles.map(file => (
                            <li key={file.token} className={`dashboard__item ${file.isExpired ? 'dashboard__item--expired' : ''}`}>
                                <div className="dashboard__item-left">
                                    <span className="dashboard__item-icon">
                                        <img src={IconFile} alt="icone file"/>
                                    </span>
                                    <div>
                                        <p className="dashboard__item-name">{file.originalName}</p>
                                        <p className={`dashboard__item-status ${file.isExpired ? 'dashboard__item-status--expired' : ''}`}>
                                            {getDaysLabel(file.expiresAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="dashboard__item-right">
                                    {file.hasPassword && <span className="dashboard__item-lock">🔒</span>}

                                    {/* DESKTOP */}
                                    {!file.isExpired && (
                                        <div className="dashboard__item-actions">
                                            <button className="dashboard__btn-delete" onClick={() => handleDelete(file.token)}>
                                                <img src={IconTrash} alt=""/>
                                                <p>Supprimer</p>
                                            </button>
                                            <button className="dashboard__btn-access" onClick={() => navigate(`/download/${file.token}`)}>
                                                Accéder →
                                            </button>
                                        </div>
                                    )}
                                    {file.isExpired && (
                                        <p className="dashboard__item-expired-msg">Ce fichier à expiré, il n'est plus stocké chez nous</p>
                                    )}

                                    {/* MOBILE */}
                                    {!file.isExpired && (
                                        <div className="dashboard__item-menu">
                                            <button className="dashboard__btn-dots" onClick={() => setOpenMenu(openMenu === file.token ? null : file.token)}>
                                                ⋮
                                            </button>
                                            {openMenu === file.token && (
                                                <div className="dashboard__dropdown">
                                                    <button onClick={() => navigate(`/download/${file.token}`)}>Accéder</button>
                                                    <button onClick={() => handleDelete(file.token)}>Supprimer</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}