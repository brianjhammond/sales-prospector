import { NextApiRequest, NextApiResponse } from 'next'
import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 60, // Per minute
})

export async function rateLimiterMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<any>
) {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    await rateLimiter.consume(String(clientIp))
    return await next()
  } catch (error) {
    res.status(429).json({
      results: [],
      message: 'Too many requests, please try again later.'
    })
  }
} 