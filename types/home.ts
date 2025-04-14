// Homeページの型定義
import type { IconName } from '@/utils/icon-utils'
// 機能項目
export interface Feature {
  title: string
  description: string
  icon: IconName
}

// 問題と解決策の項目
export interface ProblemSolution {
  problem: string
  description: string
  solution: string
  solutionDescription: string
}

// 製品概要の項目
export interface ProductFeature {
  title: string
  description: string
  icon: IconName
  learnMoreLink: string
}

// 統計データ
export interface Stat {
  value: string
  label: string
}

// お客様の声
export interface Testimonial {
  name: string
  role: string
  image: string
  quote: string
}

// ヒーローセクションのデータ
export interface HeroData {
  title: string
  subtitle: string
  userCount: number
}
