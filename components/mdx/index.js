import PercentageRepWork from '@/components/mdx/percentage-rep-work'
import PercentageWeightWork from '@/components/mdx/percentage-weight-work'
import WorkoutBlock from '@/components/workout-block'

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
  PercentageRep: PercentageRepWork,
  PercentageWeight: PercentageWeightWork,
  Strength: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Strength">
      {children}
    </WorkoutBlock>
  )
}

export default mdxComponents
