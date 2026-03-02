import { useState } from 'react';
import Header from '../../components/Header/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        console.log({ email, password });
    };

    return (
        <div className="gradient-bg">
            <Header variant="login" />
            <div className="login__wrapper">
                <div className="login__card">
                    <h1 className="login__title">Connexion</h1>
                    <div className="login__fields">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Saisissez votre email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Mot de passe"
                            type="password"
                            placeholder="Saisissez votre mot de passe..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <a className="login__link" href="/register">Créer un compte</a>
                    <Button label="Connexion" type="submit" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
}