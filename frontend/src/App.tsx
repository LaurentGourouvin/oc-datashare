import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Download from "./pages/Download/Download.tsx";
import Home from "./pages/Home/Home.tsx";
import Upload from "./pages/Upload/Upload.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import GuestGuard from "./components/Guards/GuestGuards.tsx";
import AuthGuard from "./components/Guards/AuthGuards.tsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
            <Route path="/register" element={<GuestGuard><Register /></GuestGuard>} />
            <Route path="/download/:token" element={<AuthGuard><Download /></AuthGuard>} />
            <Route path="/download" element={<AuthGuard><Download /></AuthGuard>} />
            <Route path="/upload" element={<AuthGuard><Upload /></AuthGuard>} />
        </Routes>
    );
}