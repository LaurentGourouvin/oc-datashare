import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Download from "./pages/Download/Download.tsx";
import Home from "./pages/Home/Home.tsx";
import Upload from "./pages/Upload/Upload.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/download/:token" element={<Download />} />
            <Route path="/upload" element={<Upload />} />
        </Routes>
    );
}