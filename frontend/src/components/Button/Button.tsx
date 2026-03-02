import './Button.css';

interface ButtonProps {
    label: string;
    onClick?: () => void;
    type?: 'button' | 'submit';
    disabled?: boolean;
}

export default function Button({ label, onClick, type = 'button', disabled = false }: ButtonProps) {
    return (
        <button
            className="btn"
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {label}
        </button>
    );
}