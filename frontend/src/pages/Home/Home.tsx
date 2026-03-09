import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="gradient-bg">
            <Header />
            <div className="home__wrapper">
                <p className="home__text">Tu veux partager un fichier ?</p>
                <button className="home__circle-btn" onClick={() => navigate("/upload")}>
                    ⬆
                </button>
            </div>
            <footer className="home__footer">Copyright DataShare® 2025</footer>
        </div>
    );
}