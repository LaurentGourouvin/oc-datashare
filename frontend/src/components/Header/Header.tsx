import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
    const isLoggedIn = !!localStorage.getItem('auth_token');

    return (
        <header className="header">
            <span className="header__logo">DataShare</span>
            {isLoggedIn
                ? <Link className="header__btn" to="/dashboard">Mon espace</Link>
                : <Link className="header__btn" to="/login">Se connecter</Link>
            }
        </header>
    );
}