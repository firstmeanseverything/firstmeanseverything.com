import PercentageRepWork from './percentage-rep-work'
import PercentageWeightWork from './percentage-weight-work'
import { useAuthState } from '../../context/auth'
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
  PercentageRepWork,
  PercentageWeightWork,
  Strength: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Strength">
      {children}
    </WorkoutBlock>
  ),
}

export default mdxComponents
