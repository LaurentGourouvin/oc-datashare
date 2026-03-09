import { useState } from 'react';
import Header from '../../components/Header/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Callout from '../../components/Callout/Callout';
import './Register.css';
import { register } from "../../services/Auth/auth.service";
import {useNavigate} from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        try {
            await register(email, password);
            navigate('/dashboard');
        } catch {
            setError('Erreur lors de la création du compte.');
        }
    };

    return (
        <div className="gradient-bg">
            <Header />
            <div className="register__wrapper">
                <div className="register__card">
                    <h1 className="register__title">Créer un compte</h1>
                    <form
                        className="register__fields"
                        onSubmit={handleSubmit}
                        aria-label="Formulaire de création de compte"
                    >
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="Saisissez votre email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            id="password"
                            label="Mot de passe"
                            type="password"
                            placeholder="Saisissez votre mot de passe..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                        <Input
                            id="confirmPassword"
                            label="Verification du mot de passe"
                            type="password"
                            placeholder="Saisissez le à nouveau..."
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                        />

                        {error && <Callout informationType="error" message={error} />}

                        <a className="register__link" href="/login">J'ai déjà un compte</a>
                        <Button label="Créer mon compte" type="submit" />
                    </form>
                </div>
            </div>
        </div>
    );
}