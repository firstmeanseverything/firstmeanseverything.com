import cx from 'classnames'

function WorkoutBlock({ children, title }) {
  const styleClass = (title) => {
    switch (title) {
      case 'Active Recovery':
        return 'bg-yellow-50 border-yellow-200 text-yellow-500'
      case 'Gymnastics':
        return 'bg-indigo-50 border-indigo-200 text-indigo-500'
      case 'Strength':
        return 'bg-green-50 border-green-200 text-green-500'
      case 'Metcon':
        return 'bg-orange-50 border-orange-200 text-orange-500'
    }
  }

  return (
    <div className={cx('border p-3 rounded', styleClass(title))}>
      <h2 className="font-bold mb-4 text-lg tracking-tight uppercase">
        {title}
      </h2>
      <div className="prose">{children}</div>
    </div>
  )
}

export default WorkoutBlock
