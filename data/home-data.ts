import type { Feature, ProblemSolution, ProductFeature, Stat, Testimonial, HeroData } from "@/types/home"

// 機能データ
export const featuresData: Feature[] = [
  {
    title: "Effortless Automation",
    description: "Automate your trading strategies seamlessly using AI, simplifying complex processes.",
    icon: "Code2",
  },
  {
    title: "Intelligent Analysis",
    description: "Automatically analyze your trades statistically, providing clear insights to optimize strategy performance.",
    icon: "BarChart3",
  },
  {
    title: "24/7 Hands-Free Operation",
    description: "Keep your automated strategies running continuously without manual oversight.",
    icon: "MessageSquare",
  },
  {
    title: "Monetize via DeFi",
    description: "Instantly convert your successful strategies into profitable DeFi products, boosting your returns.",
    icon: "Shield",
  },
]

// 問題と解決策のデータ
export const problemSolutionsData: ProblemSolution[] = [
  {
    problem: "Commoditized Strategy Saturation",
    description:
      "Current DeFi market is saturated with commoditized strategies competing solely on TVL with little differentiation.",
    solution: "Algorithmic Directional Trading Platform",
    solutionDescription:
      "Permissionless, verifiable algorithmic long/short strategy platform with on-chain verification for transparency and trust.",
  },
  {
    problem: "Lack of Directional Trading",
    description:
      "Limited options for directional trading operations like long or short positions based on price predictions.",
    solution: "Predictable Performance",
    solutionDescription:
      "Algorithmic trading providing predictable PnL results and transparent execution, allowing investors to understand strategy characteristics.",
  },
  {
    problem: "Lack of Predictability",
    description: "Traditional copy trading requires extreme trust as trader actions cannot be predicted.",
    solution: "Risk-Managed Investment",
    solutionDescription:
      "Directional but risk-limited investment options with clear risk parameters to prevent excessive risk-taking.",
  },
  {
    problem: "High Risk in Directional Trading",
    description:
      "Directional trading strategies can lead to significant losses if market predictions are wrong, especially in volatile crypto markets.",
    solution: "Customizable Portfolios",
    solutionDescription:
      "Customizable portfolio allocations based on individual risk preferences, allowing investors to distribute funds across multiple strategies.",
  },
  {
    problem: "No Incentive to Share Strategies",
    description:
      "Current environment lacks incentives to publish good trading strategies, as doing so dilutes value and reduces developer revenue opportunities.",
    solution: "Capital Efficiency Maximization",
    solutionDescription:
      "Environment for diverse traders to utilize external capital for perpetual trading, allowing traders with good strategies to expand beyond self-capital constraints.",
  },
]

// 製品概要データ
export const productFeaturesData: ProductFeature[] = [
  {
    title: "Strategy Builder",
    description: "No-code visual interface for building trading algorithms",
    icon: "Code2",
    learnMoreLink: "/strategy-builder",
  },
  {
    title: "Backtest Engine",
    description: "Test strategies against historical market data",
    icon: "BarChart3",
    learnMoreLink: "/backtest",
  },
  {
    title: "AI Chat Interface",
    description: "Intelligent assistant for strategy creation and optimization",
    icon: "MessageSquare",
    learnMoreLink: "/ai-chat",
  },
  {
    title: "Vault Management",
    description: "Create and manage strategy vaults",
    icon: "Shield",
    learnMoreLink: "/vaults",
  },
  {
    title: "Risk Management",
    description: "Comprehensive risk parameters and controls",
    icon: "LineChart",
    learnMoreLink: "/risk",
  },
  {
    title: "Strategy Portfolio",
    description: "Build diversified portfolios of trading strategies",
    icon: "Layers",
    learnMoreLink: "/portfolio",
  },
]

// 統計データ
export const statsData: Stat[] = [
  { value: "$42M+", label: "Total Value Locked" },
  { value: "2,500+", label: "Active Traders" },
  { value: "350+", label: "Verified Strategies" },
  { value: "28%", label: "Avg. Annual Return" },
]

// お客様の声データ
export const testimonialsData: Testimonial[] = [
  {
    name: "Alex Thompson",
    role: "Professional Trader",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "HiveFi has completely transformed my trading workflow. The AI chat interface makes it easy to implement complex ideas without writing a single line of code.",
  },
  {
    name: "Sarah Chen",
    role: "Hedge Fund Manager",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "The backtesting capabilities are unmatched. I can validate strategies across multiple market conditions and optimize parameters with just a few clicks.",
  },
  {
    name: "Michael Rodriguez",
    role: "DeFi Investor",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "As an investor, I love being able to diversify across multiple verified strategies. The risk management tools give me confidence that my capital is being deployed responsibly.",
  },
]

// ヒーローセクションのデータ
export const heroData: HeroData = {
  title: "The AI Trading Automator",
  subtitle:
    "Automate, analyze, operate, and deploy your trades as DeFi.",
  userCount: 2500,
}
