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
    <li className="col-span-1 flex shadow-sm rounded-md">
      <div
        className={cx(
          'shrink-0 flex items-center justify-center w-8 text-white text-sm font-medium rounded-l-md',
          styleClass(type)
        )}
      ></div>
      <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
        <div className="flex-1 px-4 py-6 text-sm truncate">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="prose prose-sm sm:prose">{children}</div>
        </div>
      </div>
    </li>
  )
}

export default WorkoutBlock
