import cx from 'classnames'

function Badge({ label, size = 'regular', theme = 'blue' }) {
  const sizeClass = (size) => {
    switch (size) {
      case 'large':
        return 'px-3 py-0.5 text-sm leading-5'
      case 'regular':
      default:
        return 'px-2.5 py-0.5 text-xs leading-4'
    }
  }
  const themeClass = (theme) => {
    switch (theme) {
      case 'blue':
      default:
        return 'bg-blue-100 text-blue-800'
      case 'green':
        return 'bg-green-100 text-green-800'
      case 'orange':
        return 'bg-orange-100 text-orange-800'
    }
  }

  return (
    <span
      className={cx(
        'inline-flex items-center font-medium rounded-full',
        sizeClass(size),
        themeClass(theme)
      )}
    >
      {label}
    </span>
  )
}

export default Badge
