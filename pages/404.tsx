import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-indigo-600 text-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold mb-4 animate-pulse">404</h1>
        <div className="mb-8 w-64 h-64 mx-auto animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            <path d="M14.05 2a9 9 0 0 1 8 7.94"></path>
            <path d="M14.05 6A5 5 0 0 1 18 10"></path>
          </svg>
        </div>
        <h2 className="text-4xl font-bold mb-4">Oops! Flight Not Found</h2>
        <p className="text-xl mb-8">We couldn't locate the page you're looking for. It seems to have flown off course!</p>
        <Link href="/" className="inline-block px-6 py-3 text-lg font-semibold bg-white text-indigo-600 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50">
          Return to Home Terminal
        </Link>
      </div>
      <div className="mt-12 animate-float">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-48 h-48">
          <path d="M22 2L2 22"></path>
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
          <line x1="12" y1="12" x2="12" y2="12"></line>
          <path d="M12 12l-2-2"></path>
          <path d="M12 12l2-2"></path>
        </svg>
      </div>
    </div>
  )
}