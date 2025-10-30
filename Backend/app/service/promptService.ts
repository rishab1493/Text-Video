import { tryCatch } from "bullmq"
import { Prompt } from "../../Model/prompt"
import RedisClient from "../../queue/redis"
import ErrorHandler from "../../utils/errorHandler"
import { Redis } from "ioredis"

const redis = RedisClient

export async function promptQueue(prompt: string) {
  try {
    const newJob = await Prompt.create({
      prompt: prompt,
      status: "queued",
      videoURL: null,
    })

    const job = await redis.lpush(
      "video_jobs",
      JSON.stringify({ jobId: newJob._id.toString(), prompt })
    )

    return { newJob, job }
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error
    } else {
      throw new ErrorHandler("Something went wrong", 500)
    }
  }
}

export async function getStatusService(id: String) {
  try {
    const job = await Prompt.findById(id)

    if (!job) {
      throw new ErrorHandler("Job not found", 404)
    }

    return {
      jobId: job._id,
      status: job.status,
      videoUrl: job.videoURL,
      job: job.prompt,
    }
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error
    } else {
      throw new ErrorHandler("Something went wrong", 500)
    }
  }
}

export async function removeRedisQueueService() {
  try {
    await redis.del("video_jobs")

    return {
      msg: "queue deleted",
    }
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error
    } else {
      throw new ErrorHandler("Something went wrong", 500)
    }
  }
}
