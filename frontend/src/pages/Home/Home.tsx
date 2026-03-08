import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './Home.css';

export default function Home() {
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        navigate('/upload', { state: { file } });
    };

    return (
        <div className="gradient-bg">
            <Header variant="login" />
            <div className="home__wrapper">
                <p className="home__text">Tu veux partager un fichier ?</p>
                <button className="home__circle-btn" onClick={() => inputRef.current?.click()}>
                    ⬆
                </button>
            </div>
            <input
                ref={inputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <footer className="home__footer">Copyright DataShare® 2025</footer>
        </div>
    );
}