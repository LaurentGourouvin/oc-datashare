import './Input.css';

interface InputProps {
    id?: string;
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean,
    minLength?: number
}

export default function Input({ id, label, type = 'text', placeholder, value, onChange, required, minLength }: InputProps) {
    return (
        <div className="input-group">
            <label className="input-group__label">{label}</label>
            <input
                id={id}
                className="input-group__field"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                minLength={minLength}
            />
        </div>
    );
}