declare module 'robots-parser' {
  function robotsParser(url: string, contents: string): {
    isAllowed: (url: string, userAgent?: string) => boolean
  }
  export = robotsParser
}

declare module 'axios-rate-limit' {
  import { AxiosInstance } from 'axios'
  function axiosRateLimit(
    axios: AxiosInstance,
    options: { maxRequests: number; perMilliseconds: number }
  ): AxiosInstance
  export = axiosRateLimit
} 