import { MENU_COLORS } from "../../data/clientConfiguration";
import classNames from "../../services/classNames-service";


export default function MenuToggle({ name, onChange, isChecked, size }) {

    const clickable = onChange !== null;

    const menuColor = MENU_COLORS[`Menü ${name}`];
    const hoverMenuColor = clickable ? MENU_COLORS[`Hover Menü ${name}`] : menuColor; // Hover only, if onChange is available

    return (
        <button
        onClick={(event) => {
            event.preventDefault();
            if(clickable) {
                onChange(name, !isChecked);
            }
        }}
        className={classNames(
            isChecked ? `${menuColor}` : 'bg-slate-400',
            clickable ? isChecked ? `hover:${hoverMenuColor}` : 'hover:bg-slate-400' : '',
            clickable ? 'cursor-pointer' : 'cursor-default',
            `select-none shadow-lg ${size?"w-"+size+" h-"+size:"w-12 h-12"} rounded-full mr-1.5 text-base font-medium text-gray-50`)}>
            {name}
        </button>
    );
}