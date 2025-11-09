
export default function NavigationCategory({ name, children }) {

    // FIXME: Currently disabled (too few entries, never displayed)

    // The effective number of children
    const numberOfChildren = 1;//children.reduce((accumulator, currentValue) => accumulator + (currentValue ? 1 : 0), 0);

    return (
        numberOfChildren !== 0 &&
            <>
                {/*<span className="px-3 mt-4 text-xs font-bold uppercase text-gray-500">{name}</span>*/}
                {children}
            </>
    );
}