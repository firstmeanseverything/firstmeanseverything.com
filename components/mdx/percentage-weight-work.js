import { useAuthState } from '../../context/auth'

function PercentageWeightWork({ movement, note, percent, scheme }) {
  const { user } = useAuthState()

  if (!(movement || percent || scheme)) return null

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
    <React.Fragment>
      <h4>{`${scheme} ${parseMovement(movement)} @ ${Number(percent)}%`}</h4>
      {note && <span className="text-sm">{note}</span>}
    </React.Fragment>
  )
}

export default PercentageWeightWork
