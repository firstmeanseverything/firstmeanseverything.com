import Navigation from 'components/navigation'

function Layout({ children }) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  )
}

export const getLayout = (page) => <Layout>{page}</Layout>

export default Layout
