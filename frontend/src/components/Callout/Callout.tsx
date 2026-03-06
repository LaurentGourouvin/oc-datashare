import ErrorIcon from "../../assets/alert_octagon.png";
import WarningIcon from "../../assets/alert_triangle.png";
import InfoIcon from "../../assets/alert_info.png";

type CalloutType = "error" | "warning" | "info";

interface CalloutProps {
    informationType: CalloutType;
    message: string
}

const ICONS: Record<CalloutType, string> = {
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon,
};

export default function Callout({ message, informationType }: CalloutProps) {
    return (
        <p className={"callout_component callout_component--" + informationType} role="alert">
            <img src={ICONS[informationType]} alt="" aria-hidden="true" />
            {message}
        </p>
    );
}