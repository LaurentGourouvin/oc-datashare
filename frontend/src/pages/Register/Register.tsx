import { useState } from 'react';
import Header from '../../components/Header/Header';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './Register.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = () => {
        console.log({ email, password, confirmPassword });
    };

    return (
        <div className="gradient-bg">
            <Header variant="login" />
            <div className="register__wrapper">
                <div className="register__card">
                    <h1 className="register__title">Créer un compte</h1>
                    <div className="register__fields">
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
                        <Input
                            label="Verification du mot de passe"
                            type="password"
                            placeholder="Saisissez le à nouveau..."
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <a className="register__link" href="/login">J'ai déjà un compte</a>
                    <Button label="Créer mon compte" type="submit" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
}