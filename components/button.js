import cx from 'classnames'

import { SpinnerSVG } from 'svgs/icons'

function Button({
  children,
  isDisabled = false,
  isLoading = false,
  size = 'regular',
  theme = 'indigo',
  type = 'button',
  ...props
}) {
  const sizeClass = (size) => {
    switch (size) {
      case 'large':
        return 'px-4 py-2 text-base leading-6 rounded-md'
      case 'regular':
      default:
        return 'px-4 py-2 text-sm leading-4 rounded-md'
      case 'small':
        return 'px-3 py-2 text-sm leading-4 rounded-md'
      case 'xlarge':
        return 'px-6 py-3 text-base leading-6 rounded-md'
      case 'xsmall':
        return 'px-2.5 py-1.5 text-xs leading-4 rounded'
    }
  }

  const themeClass = (theme, disabled) => {
    switch (theme) {
      case 'indigo':
      default:
        return cx('text-white bg-indigo-600', {
          'hover:bg-indigo-500 focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700': !disabled
        })
      case 'yellow':
        return cx('text-gray-700 bg-yellow-300', {
          'hover:bg-yellow-200 focus:border-yellow-400 focus:shadow-outline-yellow active:bg-yellow-400': !disabled
        })
    }
  }

  const svgSizeClass = (size) => {
    switch (size) {
      case 'large':
        return 'h-5 w-5'
      case 'regular':
      case 'small':
      default:
        return 'h-4 w-4'
      case 'xlarge':
        return 'h-6 w-6'
      case 'xsmall':
        return 'h-3 w-3'
    }
  }

  const disabled = isDisabled || isLoading

  return (
    <span className="block rounded-md shadow-sm">
      <button
        type={type}
        className={cx(
          'w-full flex items-center justify-center border border-transparent font-medium focus:outline-none transition ease-in-out duration-150',
          sizeClass(size),
          themeClass(theme, disabled),
          {
            'cursor-not-allowed opacity-50': disabled
          }
        )}
        disabled={disabled}
        {...props}
      >
        {isLoading ? (
          <SpinnerSVG className={cx('animate-spin mr-3', svgSizeClass(size))} />
        ) : null}
        {isLoading ? 'Loading' : children}
      </button>
    </span>
  )
}

export default Button
