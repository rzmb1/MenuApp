import classNames from "../../services/classNames-service"


export default function Button({ onClick, children, className, disabled }) {
    return (
        <button disabled={disabled} className={classNames(className, "bg-blue-500 hover:bg-blue-700 text-white select-none font-bold py-2 px-4 rounded self-center m-2.5 disabled:opacity-50")} onClick={onClick}>
            {children}
        </button>
    );
}