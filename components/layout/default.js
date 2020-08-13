import Navigation from '../navigation'

function DefaultLayout({ children }) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  )
}

export default DefaultLayout
