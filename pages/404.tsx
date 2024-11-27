import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1e1b4b] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-8 left-8">
        <div className="w-16 h-16 rounded-full bg-[#8b9dff] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#ff7171] flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#1e1b4b]"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-16 right-16">
        <div className="w-16 h-16 bg-[#7ee7e7] rounded-full blur-lg opacity-60"></div>
      </div>
      
      <div className="absolute bottom-16 left-16">
        <div className="w-32 h-8 bg-[#4b7bff] rounded-full blur-lg transform -rotate-45"></div>
      </div>
      
      {/* Starburst */}
      <div className="absolute top-1/4 left-1/4">
        <div className="w-12 h-12 bg-[#ff7171] rounded-xl transform rotate-45 animate-pulse"></div>
      </div>

      {/* Main content */}
      <div className="text-center z-10 max-w-2xl">
        <h1 className="text-[#8b9dff] text-3xl mb-4 font-medium tracking-wide">ERROR</h1>
        <div className="text-white text-[180px] font-bold leading-none tracking-tighter mb-8">404</div>
        <h2 className="text-[#8b9dff] text-3xl md:text-4xl mb-4 font-medium">
          This page is outside of the universe
        </h2>
        <p className="text-[#8b9dff]/80 text-lg mb-8">
          The page you are trying to access doesn't exist or has been moved.
          <br />
          Try going back to our homepage.
        </p>
        <Link 
          href="/"
          className="inline-block bg-[#4b7bff] text-white px-8 py-3 rounded-lg font-medium transition-transform hover:scale-105 hover:bg-[#4b7bff]/90 focus:outline-none focus:ring-2 focus:ring-[#4b7bff]/50 focus:ring-offset-2 focus:ring-offset-[#1e1b4b]"
        >
          Go to homepage
        </Link>
      </div>

      {/* Platform decorations */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between p-8">
        <div className="w-32 h-16 bg-white/10 transform skew-y-12"></div>
        <div className="w-32 h-24 bg-white/10 transform -skew-y-12"></div>
      </div>

      {/* Noise overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}
      ></div>
    </div>
  )
}

