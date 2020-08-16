import WorkoutBlock from '../workout-block'

const mdxComponents = {
  Gymnastics: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Gymnastics">
      {children}
    </WorkoutBlock>
  ),
  Metcon: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Metcon">
      {children}
    </WorkoutBlock>
  ),
  Strength: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Strength">
      {children}
    </WorkoutBlock>
  ),
}

export default mdxComponents
