import cx from 'classnames'

import SpinnerSVG from '../svgs/icons/spinner.svg'

function Button({
  children,
  isDisabled = false,
  isLoading = false,
  size = 'regular',
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

  return (
    <span className="block rounded-md shadow-sm">
      <button
        type={type}
        className={cx(
          'w-full flex items-center justify-center border border-transparent font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150',
          sizeClass(size),
          {
            'cursor-not-allowed opacity-50': isDisabled || isLoading,
            'hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700': !(
              isDisabled || isLoading
            ),
          }
        )}
        disabled={isDisabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <SpinnerSVG className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
        ) : null}
        {isLoading ? 'Loading' : children}
      </button>
    </span>
  )
}

export default Button
