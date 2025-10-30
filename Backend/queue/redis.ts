import { Redis } from "ioredis"

class RedisClient {
  private static instance: Redis

  static getInstance(): Redis {
    if (!this.instance) {
      this.instance = new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => Math.min(times * 50, 2000),
        enableOfflineQueue: false,
      })

      this.instance.on("error", (err) => {
        console.error("Redis connection error:", err)
      })
    }
    return this.instance
  }
}

export default RedisClient.getInstance()
