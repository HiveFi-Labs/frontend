/**
 * API クライアント
 *
 * すべてのデータ取得リクエストを処理する中央集権的なクライアント
 * 実際のアプリケーションでは、このクラスが実際のAPIエンドポイントにリクエストを送信します
 */
class ApiClient {
  private baseUrl = "/api"
  private cache: Record<string, { data: any; timestamp: number }> = {}
  private cacheTTL: number = 5 * 60 * 1000 // 5分のキャッシュ有効期限

  /**
   * GETリクエストを送信
   *
   * @param endpoint エンドポイントパス
   * @param useCache キャッシュを使用するかどうか
   * @returns レスポンスデータ
   */
  async get<T>(endpoint: string, useCache = true): Promise<T> {
    const cacheKey = endpoint

    // キャッシュチェック
    if (useCache && this.cache[cacheKey]) {
      const cachedData = this.cache[cacheKey]
      const now = Date.now()

      // キャッシュが有効期限内かチェック
      if (now - cachedData.timestamp < this.cacheTTL) {
        return cachedData.data as T
      }
    }

    try {
      // 実際のアプリケーションではここでfetchを使用
      // const response = await fetch(`${this.baseUrl}${endpoint}`);
      // if (!response.ok) throw new Error(`API error: ${response.status}`);
      // const data = await response.json();

      // モックデータを使用（実際のアプリケーションでは削除）
      const data = await this.getMockData<T>(endpoint)

      // キャッシュに保存
      if (useCache) {
        this.cache[cacheKey] = {
          data,
          timestamp: Date.now(),
        }
      }

      return data
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error)
      throw error
    }
  }

  /**
   * POSTリクエストを送信
   *
   * @param endpoint エンドポイントパス
   * @param data 送信データ
   * @returns レスポンスデータ
   */
  async post<T, D>(endpoint: string, data: D): Promise<T> {
    try {
      // 実際のアプリケーションではここでfetchを使用
      // const response = await fetch(`${this.baseUrl}${endpoint}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });
      // if (!response.ok) throw new Error(`API error: ${response.status}`);
      // return await response.json();

      // モックレスポンス（実際のアプリケーションでは削除）
      console.log(`POST request to ${endpoint} with data:`, data)
      return { success: true } as unknown as T
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error)
      throw error
    }
  }

  /**
   * キャッシュをクリア
   *
   * @param endpoint 特定のエンドポイントのキャッシュをクリアする場合は指定
   */
  clearCache(endpoint?: string): void {
    if (endpoint) {
      delete this.cache[endpoint]
    } else {
      this.cache = {}
    }
  }

  /**
   * モックデータを取得（実際のアプリケーションでは削除）
   *
   * @param endpoint エンドポイントパス
   * @returns モックデータ
   */
  private async getMockData<T>(endpoint: string): Promise<T> {
    // 実際のアプリケーションではこのメソッドは不要
    // ここでは簡易的にインポートしたモックデータを返す
    const mockDataMap = await import("@/data/mock-data-map").then((module) => module.default)
    const data = mockDataMap[endpoint]

    if (!data) {
      throw new Error(`No mock data found for endpoint: ${endpoint}`)
    }

    return data as T
  }
}

// シングルトンとしてエクスポート
const apiClient = new ApiClient()
export default apiClient
