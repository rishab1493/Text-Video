import { Queue } from "bullmq"

import dotenv from "dotenv"
dotenv.config()

class QueueClient {
  public static instance: Queue

  static getInstance() {
    if (!this.instance) {
      this.instance = new Queue("video-generation", {
        connection: { url: process.env.REDIS_URL },
      })
    }
    return this.instance
  }
}

export default QueueClient.getInstance()
