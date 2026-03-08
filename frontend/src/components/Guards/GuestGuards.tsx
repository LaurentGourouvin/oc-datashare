import { Navigate } from 'react-router-dom';

interface GuestGuardProps {
    children: React.ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
    const isLoggedIn = !!localStorage.getItem('auth_token');

    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}