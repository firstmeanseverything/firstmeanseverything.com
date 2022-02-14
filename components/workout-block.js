import cx from 'classnames'

function WorkoutBlock({ children, title, type }) {
  const styleClass = (type) => {
    switch (type) {
      case 'conditioning':
        return 'bg-screamin'
      case 'gymnastics':
        return 'bg-ecstasy'
      case 'recovery':
        return 'bg-cornflower'
      default:
      case 'strength':
        return 'bg-saffron'
      case 'metcon':
        return 'bg-shark'
    }
  }

  return (
    <li className="col-span-1 flex rounded-md shadow-sm">
      <div
        className={cx(
          'flex w-8 shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white',
          styleClass(type)
        )}
      ></div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white">
        <div className="flex-1 truncate px-4 py-6 text-sm">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="prose prose-sm prose-h4:whitespace-normal prose-p:whitespace-normal prose-li:whitespace-normal sm:prose">
            {children}
          </div>
        </div>
      </div>
    </li>
  )
}

export default WorkoutBlock
