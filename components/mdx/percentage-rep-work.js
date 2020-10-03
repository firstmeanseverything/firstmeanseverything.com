function PercentageRepWork({ movement, note, percent, scheme }) {
  if (!(movement || percent || scheme)) return null

  const parseMovement = (movement) => {
    switch (true) {
      case movement.includes('toes_to_bar'):
        return 'Toes to bar'
    }
  }

  return (
    <React.Fragment>
      <h4>{`${scheme} ${Number(percent)} ${parseMovement(movement)}`}</h4>
      {note && <span className="text-sm">{note}</span>}
    </React.Fragment>
  )
}

export default PercentageRepWork
