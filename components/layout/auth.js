function AuthLayout({ children }) {
  const getRandomImage = () => {
    const images = Array.from(
      Array(3),
      (_, index) => `/images/bg_${index + 1}.jpg`
    )

    return images[Math.floor(Math.random() * images.length)]
  }

  return (
    <React.Fragment>
      <main className="flex min-h-screen relative">
        <div className="md:w-3/5 relative w-full z-10">
          <div className="flex items-center justify-center min-h-screen mx-auto md:w-3/5 px-6 md:px-0 py-12">
            <div className="flex-auto">
              <div className="flex-grow">{children}</div>
            </div>
          </div>
          <svg
            className="hidden md:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon points="50,0 100,0 50,100 0,100"></polygon>
          </svg>
        </div>
        <div className="absolute hidden inset-y-0 md:block right-0 w-2/5">
          <div className="overflow-hidden relative w-full h-full">
            <img
              className="h-full object-cover w-full"
              src={getRandomImage()}
            />
          </div>
        </div>
      </main>
    </React.Fragment>
  )
}

export default AuthLayout
