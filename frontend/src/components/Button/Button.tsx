import './Button.css';

interface ButtonProps {
    label: string;
    onClick?: () => void;
    type?: 'button' | 'submit';
    disabled?: boolean;
    className?: string;
}

export default function Button({ label, onClick, className = "btn", type = 'button', disabled = false }: ButtonProps) {
    return (
        <button
            className={className}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {label}
        </button>
    );
}