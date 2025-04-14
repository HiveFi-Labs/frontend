import HeroSection from '@/components/home/hero-section'
import FeatureGrid from '@/components/home/feature-grid'
import WaitlistSection from '@/components/waitlist/waitlist-section'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-[120px] animate-pulse-slow" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 rounded-full bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 mb-4">
              <span className="text-sm font-medium text-zinc-300">
                Powerful Features
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">
              Simple, Smart, and Seamless Trade Automation
            </h2>
            <p className="text-zinc-300 text-lg">
              HiveFi drastically reduces automation costs and revolutionizes
              monetization, empowering you to focus on a what matters most:
              strategic ideation.
            </p>
          </div>
          <FeatureGrid />
        </div>
      </section>

      {/* Problems & Solutions */}
      {/* <section id="problems" className="py-20 relative">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] rounded-full bg-purple-900/20 blur-[150px] animate-pulse-slow"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 rounded-full bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 mb-4">
              <span className="text-sm font-medium text-zinc-300">Problems & Solutions</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">Solving DeFi's Biggest Challenges</h2>
            <p className="text-zinc-300 text-lg">
              HiveFi addresses key challenges in the current DeFi landscape with innovative solutions.
            </p>
          </div>
          <ProblemSolution />
        </div>
      </section> */}

      {/* Product Overview */}
      {/* <section id="product" className="py-20 relative">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-[120px] animate-pulse-slow"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 rounded-full bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 mb-4">
              <span className="text-sm font-medium text-zinc-300">Our Product</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text">Complete Trading Ecosystem</h2>
            <p className="text-zinc-300 text-lg">
              A comprehensive platform for creating, validating, and executing algorithmic trading strategies.
            </p>
          </div>
          <ProductOverview />
        </div>
      </section> */}

      {/* Waitlist Section */}
      <WaitlistSection />
    </>
  )
}
