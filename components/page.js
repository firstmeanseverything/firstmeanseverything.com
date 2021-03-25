import * as React from 'react'

function Page({ children, controls, meta, title }) {
  return (
    <React.Fragment>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
                {title}
              </h1>
              {meta && (
                <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-3">
                  {meta}
                </div>
              )}
            </div>
            {controls && (
              <div className="mt-5 flex lg:mt-0 lg:ml-4">{controls}</div>
            )}
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </React.Fragment>
  )
}

export default Page
