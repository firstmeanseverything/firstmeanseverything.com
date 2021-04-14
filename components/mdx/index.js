import PercentageRepWork from '@/components/mdx/percentage-rep-work'
import PercentageWeightWork from '@/components/mdx/percentage-weight-work'
import WorkoutBlock from '@/components/workout-block'

const mdxComponents = {
  Conditioning: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Conditioning" type="conditioning">
      {children}
    </WorkoutBlock>
  ),
  Gymnastics: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Gymnastics" type="gymnastics">
      {children}
    </WorkoutBlock>
  ),
  Metcon: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Metcon" type="metcon">
      {children}
    </WorkoutBlock>
  ),
  PercentageRep: PercentageRepWork,
  PercentageWeight: PercentageWeightWork,
  Strength: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Strength" type="strength">
      {children}
    </WorkoutBlock>
  )
}

export default mdxComponents
