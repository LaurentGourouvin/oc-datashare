import { useState } from 'react';
import Header from '../../components/Header/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './Login.css';
import { login } from '../../services/Auth/auth.service';
import Callout from "../../components/Callout/Callout.tsx";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
        } catch {
            setError('Email ou mot de passe incorrect.');
        }
    };

    return (
        <div className="gradient-bg">
            <Header variant="login" />
                <div className="login__wrapper">
                    <div className="login__card">
                        <h1 className="login__title">Connexion</h1>
                        <form
                            className="login__fields"
                            onSubmit={handleSubmit}
                            aria-label="Formulaire de connexion"
                        >
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="Saisissez votre email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={true}
                                minLength={8}
                            />
                            <Input
                                id="password"
                                label="Mot de passe"
                                type="password"
                                placeholder="Saisissez votre mot de passe..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={true}
                                minLength={8}
                            />

                            {error && <Callout informationType={"error"} message={error} />}

                            <a className="login__link" href="/register">Créer un compte</a>
                            <Button className="login__btn" label="Connexion" type="submit" />
                        </form>
                    </div>
                </div>
        </div>
    );
}