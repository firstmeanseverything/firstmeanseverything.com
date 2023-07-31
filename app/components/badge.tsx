import cx from 'classnames'

type BadgeSize = 'large' | 'regular' | 'small'
type BadgeTheme = 'blue' | 'green' | 'orange'

interface BadgeProps {
  label: string
  size?: BadgeSize
  theme?: BadgeTheme
}

export default function Badge({
  label,
  size = 'regular',
  theme = 'blue'
}: BadgeProps): JSX.Element {
  const sizeClass = (size?: BadgeSize): string => {
    switch (size) {
      case 'large':
        return 'px-3 py-0.5 text-sm leading-5'
      case 'regular':
      default:
        return 'px-2.5 py-0.5 text-xs leading-4'
    }
  }
  const themeClass = (theme?: BadgeTheme): string => {
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
        'inline-flex items-center rounded-full font-medium',
        sizeClass(size),
        themeClass(theme)
      )}
    >
      {label}
    </span>
  )
}
