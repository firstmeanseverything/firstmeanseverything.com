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
  PercentageWeightWork: ({ movement, note, percent, scheme }) => {
    const { user } = useAuthState()

    const userWeight = user?.[movement]
      ? `${user[movement] * Number(percent / 100)}kg`
      : `${percent}%`

    const parseMovement = (movement) => {
      switch (true) {
        case movement.includes('back_squat'):
          return 'Back squat'
        case movement.includes('deadlift'):
          return 'Deadlift'
        case movement.includes('front_squat'):
          return 'Front squat'
        case movement.includes('power_clean'):
          return 'Power clean'
        case movement.includes('squat_clean'):
          return 'Squat clean'
      }
    }

    return (
      <div>
        <h4>{`${scheme} ${parseMovement(movement)} @ ${userWeight}`}</h4>
        {note && <span className="text-sm">{note}</span>}
      </div>
    )
  },
  Strength: ({ children, ...props }) => (
    <WorkoutBlock {...props} title="Strength">
      {children}
    </WorkoutBlock>
  ),
}

export default mdxComponents
