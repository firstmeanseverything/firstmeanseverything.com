import cx from 'classnames'

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/react/solid'

type AlertType = 'error' | 'info' | 'success' | 'warn'

interface AlertProps {
  className?: string
  message: string
  title: string
  type?: AlertType
}

export default function Alert({
  className,
  message,
  title,
  type = 'error'
}: AlertProps): JSX.Element {
  const themeClass = (type?: AlertType): string => {
    switch (type) {
      case 'error':
      default:
        return 'bg-red-50 text-red-700'
      case 'info':
        return 'bg-blue-50 text-blue-700'
      case 'success':
        return 'bg-green-50 text-green-700'
      case 'warn':
        return 'bg-yellow-50 text-yellow-700'
    }
  }

  const titleThemeClass = (type?: AlertType): string => {
    switch (type) {
      case 'error':
      default:
        return 'text-red-800'
      case 'info':
        return 'text-blue-800'
      case 'success':
        return 'text-green-800'
      case 'warn':
        return 'text-yellow-800'
    }
  }

  const svgThemeClass = (type?: AlertType): string => {
    switch (type) {
      case 'error':
      default:
        return 'text-red-400'
      case 'info':
        return 'text-blue-400'
      case 'success':
        return 'text-green-400'
      case 'warn':
        return 'text-yellow-400'
    }
  }

  const svgComponent = (type?: AlertType): JSX.Element => {
    const baseClass: string = cx('h-5 w-5', svgThemeClass(type))

    switch (type) {
      case 'error':
      default:
        return <XCircleIcon className={baseClass} />
      case 'info':
        return <InformationCircleIcon className={baseClass} />
      case 'success':
        return <CheckCircleIcon className={baseClass} />
      case 'warn':
        return <ExclamationCircleIcon className={baseClass} />
    }
  }

  return (
    <div className={cx('rounded-md p-4', className, themeClass(type))}>
      <div className="flex">
        <div className="shrink-0">{svgComponent(type)}</div>
        <div className="ml-3">
          <h3
            className={cx(
              'text-sm font-medium leading-5',
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
