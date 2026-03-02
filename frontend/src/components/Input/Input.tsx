import './Input.css';

interface InputProps {
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ label, type = 'text', placeholder, value, onChange }: InputProps) {
    return (
        <div className="input-group">
            <label className="input-group__label">{label}</label>
            <input
                className="input-group__field"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}