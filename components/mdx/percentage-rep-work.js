function PercentageRepWork({ movement, note, percent, scheme }) {
  const parseRepCount =
    Number(percent) >= 100
      ? Number(percent / 100) * Number(user?.[movement])
      : (Number(user?.[movement]) * percent) / 100

  const userReps = user?.[movement] ? parseRepCount : `${Number(percent)}%`

  const parseMovement = (movement) => {
    switch (true) {
      case movement.includes('toes_to_bar'):
        return 'Toes to bar'
    }
  }

  return (
    <div>
      <h4>{`${scheme} ${userReps} ${parseMovement(movement)}`}</h4>
      {note && <span className="text-sm">{note}</span>}
    </div>
  )
}

export default PercentageRepWork
