import puppeteer, { Browser } from 'puppeteer'
import * as cheerio from 'cheerio'
import PQueue from 'p-queue'
import robotsParser from 'robots-parser'
import axios from 'axios'
import axiosRateLimit from 'axios-rate-limit'

export type SocialProfile = {
  platform: string
  urls: string[]
}

export type Metadata = {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  author?: string
  keywords?: string[]
}

export type CrawlResult = {
  url: string
  metadata: Metadata
  emails: string[]
  phoneNumbers: string[]
  socialProfiles: SocialProfile[]
  error?: string
}

export class EnhancedCrawlerService {
  private static browser: Browser | null = null
  private static readonly EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  private static readonly PHONE_REGEX = /(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?/g
  
  private static readonly SOCIAL_PATTERNS = {
    linkedin: [
      /linkedin\.com\/(?:company|in|profile)\/[^\/\s]+/g,
      /linkedin\.com\/pub\/[^\/\s]+/g
    ],
    twitter: [/twitter\.com\/[^\/\s]+/g],
    facebook: [
      /facebook\.com\/[^\/\s]+/g,
      /fb\.com\/[^\/\s]+/g
    ],
    instagram: [/instagram\.com\/[^\/\s]+/g],
    github: [/github\.com\/[^\/\s]+/g],
    youtube: [/youtube\.com\/(?:channel|user)\/[^\/\s]+/g]
  }

  private static readonly http = axiosRateLimit(axios.create(), {
    maxRequests: Number(process.env.NEXT_PUBLIC_MAX_CONCURRENT_REQUESTS) || 2,
    perMilliseconds: Number(process.env.NEXT_PUBLIC_REQUEST_DELAY) || 1000
  })

  private static readonly queue = new PQueue({ concurrency: 2 })

  private static async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
    }
    return this.browser
  }

  private static async extractWithPuppeteer(url: string): Promise<string> {
    const browser = await this.initBrowser()
    const page = await browser.newPage()
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
      const content = await page.content()
      return content
    } finally {
      await page.close()
    }
  }

  private static async checkRobotsTxt(url: string): Promise<boolean> {
    try {
      const parsedUrl = new URL(url)
      const robotsUrl = `${parsedUrl.protocol}//${parsedUrl.host}/robots.txt`
      const response = await this.http.get(robotsUrl)
      const robots = robotsParser(robotsUrl, response.data)
      return robots.isAllowed(url, 'SalesProspectorBot')
    } catch (error) {
      console.warn(`Could not fetch robots.txt: ${error}`)
      return true
    }
  }

  private static extractMetadata($: cheerio.CheerioAPI): Metadata {
    return {
      title: $('title').text().trim(),
      description: $('meta[name="description"]').attr('content') || '',
      ogTitle: $('meta[property="og:title"]').attr('content'),
      ogDescription: $('meta[property="og:description"]').attr('content'),
      ogImage: $('meta[property="og:image"]').attr('content'),
      twitterCard: $('meta[name="twitter:card"]').attr('content'),
      twitterTitle: $('meta[name="twitter:title"]').attr('content'),
      twitterDescription: $('meta[name="twitter:description"]').attr('content'),
      twitterImage: $('meta[name="twitter:image"]').attr('content'),
      author: $('meta[name="author"]').attr('content'),
      keywords: $('meta[name="keywords"]').attr('content')?.split(',').map(k => k.trim())
    }
  }

  private static extractSocialProfiles(text: string): SocialProfile[] {
    const profiles: SocialProfile[] = []

    for (const [platform, patterns] of Object.entries(this.SOCIAL_PATTERNS)) {
      const urls = new Set<string>()
      for (const pattern of patterns) {
        const matches = text.match(pattern) || []
        matches.forEach(match => urls.add(match))
      }
      if (urls.size > 0) {
        profiles.push({
          platform,
          urls: Array.from(urls)
        })
      }
    }

    return profiles
  }

  static async crawlUrl(url: string): Promise<CrawlResult> {
    try {
      const isAllowed = await this.checkRobotsTxt(url)
      if (!isAllowed) {
        throw new Error('URL is not allowed by robots.txt')
      }

      const content = await this.queue.add(() => this.extractWithPuppeteer(url))
      const $ = cheerio.load(content)
      const text = $('body').text()

      const emails = [...new Set(text.match(this.EMAIL_REGEX) || [])]
      const phoneNumbers = [...new Set(text.match(this.PHONE_REGEX) || [])]
        .map(phone => phone.replace(/[-. ]/g, ''))
        .filter(phone => phone.length >= 10)

      return {
        url,
        metadata: this.extractMetadata($),
        emails,
        phoneNumbers,
        socialProfiles: this.extractSocialProfiles(content)
      }
    } catch (error) {
      console.error(`Error crawling ${url}:`, error)
      return {
        url,
        metadata: { title: '', description: '' },
        emails: [],
        phoneNumbers: [],
        socialProfiles: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  static async crawlMultipleUrls(urls: string[]): Promise<CrawlResult[]> {
    const results = await Promise.allSettled(
      urls.map(url => this.crawlUrl(url))
    )

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value
      }
      return {
        url: urls[index],
        metadata: { title: '', description: '' },
        emails: [],
        phoneNumbers: [],
        socialProfiles: [],
        error: 'Failed to crawl URL'
      }
    })
  }
} 