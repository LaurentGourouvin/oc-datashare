import './Header.css';

interface HeaderProps {
    variant?: 'login' | 'dashboard';
}

export default function Header({ variant = 'login' }: HeaderProps) {
    return (
        <header className="header">
            <span className="header__logo">DataShare</span>
            {variant === 'login' ? (
                <button className="header__btn">Se connecter</button>
            ) : (
                <div className="header__actions">
                    <button className="header__btn">Ajouter des fichiers</button>
                    <button className="header__btn header__btn--outline">Déconnexion</button>
                </div>
            )}
        </header>
    );
}