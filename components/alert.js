import cx from 'classnames'

import ExclamationCircleSVG from '../svgs/icons/exclamation-circle.svg'
import XCircleSVG from '../svgs/icons/x-circle.svg'

function Alert({ message, title, type = 'error' }) {
  const themeClass = (type) => {
    switch (type) {
      case 'error':
      default:
        return 'bg-red-50 text-red-700'
      case 'warn':
        return 'bg-yellow-50 text-yellow-700'
    }
  }

  const titleThemeClass = (type) => {
    switch (type) {
      case 'error':
      default:
        return 'text-red-800'
      case 'warn':
        return 'text-yellow-800'
    }
  }

  const svgThemeClass = (type) => {
    switch (type) {
      case 'error':
      default:
        return 'text-red-400'
      case 'warn':
        return 'text-yellow-400'
    }
  }

  const svgComponent = (type) => {
    const baseClass = cx('h-5 w-5', svgThemeClass(type))

    switch (type) {
      case 'error':
      default:
        return <XCircleSVG className={baseClass} />
      case 'warn':
        return <ExclamationCircleSVG className={baseClass} />
    }
  }

  return (
    <div className={cx('rounded-md p-4', themeClass(type))}>
      <div className="flex">
        <div className="flex-shrink-0">{svgComponent(type)}</div>
        <div className="ml-3">
          <h3
            className={cx(
              'text-sm leading-5 font-medium',
              titleThemeClass(type)
            )}
          >
            {title}
          </h3>
          <div className="mt-2 text-sm leading-5">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alert
