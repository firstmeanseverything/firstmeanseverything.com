function PercentageWeightWork({ movement, note, percent, scheme }) {
  const userWeight = user?.[movement]
    ? `${Number(user[movement]) * Number(percent / 100)}kg`
    : `${Number(percent)}%`

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
}

export default PercentageWeightWork
