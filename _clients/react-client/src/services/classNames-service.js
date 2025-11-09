
// Dynamic Tailwind: classNames(condition ? 'some styles ...' : '', stylesInAVariable, 'some fixed styles ...', 'more fixed styles ...')
export default function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }