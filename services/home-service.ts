import type {
  Feature,
  ProblemSolution,
  ProductFeature,
  Stat,
  Testimonial,
  HeroData,
} from '@/types/home'
import {
  featuresData,
  problemSolutionsData,
  productFeaturesData,
  statsData,
  testimonialsData,
  heroData,
} from '@/data/home-data'

class HomeService {
  private cache: Record<string, any> = {}

  /**
   * 機能データを取得
   */
  async getFeatures(): Promise<Feature[]> {
    if (this.cache.features) {
      return this.cache.features
    }

    const data = featuresData
    this.cache.features = data
    return data
  }

  /**
   * 問題と解決策のデータを取得
   */
  async getProblemSolutions(): Promise<ProblemSolution[]> {
    if (this.cache.problemSolutions) {
      return this.cache.problemSolutions
    }

    const data = problemSolutionsData
    this.cache.problemSolutions = data
    return data
  }

  /**
   * 製品概要データを取得
   */
  async getProductFeatures(): Promise<ProductFeature[]> {
    if (this.cache.productFeatures) {
      return this.cache.productFeatures
    }

    const data = productFeaturesData
    this.cache.productFeatures = data
    return data
  }

  /**
   * 統計データを取得
   */
  async getStats(): Promise<Stat[]> {
    if (this.cache.stats) {
      return this.cache.stats
    }

    const data = statsData
    this.cache.stats = data
    return data
  }

  /**
   * お客様の声データを取得
   */
  async getTestimonials(): Promise<Testimonial[]> {
    if (this.cache.testimonials) {
      return this.cache.testimonials
    }

    const data = testimonialsData
    this.cache.testimonials = data
    return data
  }

  /**
   * ヒーローセクションのデータを取得
   */
  async getHeroData(): Promise<HeroData> {
    if (this.cache.heroData) {
      return this.cache.heroData
    }

    const data = heroData
    this.cache.heroData = data
    return data
  }

  /**
   * キャッシュをクリア
   */
  clearCache() {
    this.cache = {}
  }
}

// シングルトンとしてエクスポート
const homeService = new HomeService()
export default homeService
