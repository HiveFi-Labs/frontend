import type React from "react"
import {
  BarChart3,
  Code2,
  MessageSquare,
  Shield,
  Rocket,
  LineChart,
  Layers,
  Zap,
  TrendingUp,
  Lightbulb,
} from "lucide-react"

export type IconName =
  | "Code2"
  | "BarChart3"
  | "MessageSquare"
  | "Shield"
  | "Rocket"
  | "LineChart"
  | "Layers"
  | "Zap"
  | "TrendingUp"
  | "Lightbulb"

interface IconProps {
  name: IconName
  className?: string
}

/**
 * アイコン名に基づいてアイコンコンポーネントを返す
 */
export const Icon: React.FC<IconProps> = ({ name, className = "w-6 h-6 text-white" }) => {
  switch (name) {
    case "Code2":
      return <Code2 className={className} />
    case "BarChart3":
      return <BarChart3 className={className} />
    case "MessageSquare":
      return <MessageSquare className={className} />
    case "Shield":
      return <Shield className={className} />
    case "Rocket":
      return <Rocket className={className} />
    case "LineChart":
      return <LineChart className={className} />
    case "Layers":
      return <Layers className={className} />
    case "Zap":
      return <Zap className={className} />
    case "TrendingUp":
      return <TrendingUp className={className} />
    case "Lightbulb":
      return <Lightbulb className={className} />
    default:
      return <Code2 className={className} />
  }
}
