import { success, error } from "../../utils/apiOut"
import {
  getStatusService,
  promptQueue,
  removeRedisQueueService,
} from "../service/promptService"
import { Response, Request } from "express"
import ErrorHandler from "../../utils/errorHandler"

export async function prompt(req: Request, res: Response) {
  try {
    const prompt: string = req.body.prompt || ""
    console.log(prompt)

    if (!prompt) {
      throw new ErrorHandler("Please type something", 500)
    }
    const result = await promptQueue(prompt)
    if (!result) {
      return error(res, "No result", 500)
    }
    return success(res, result, 200)
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error
    } else {
      throw new ErrorHandler("Something went wrong", 500)
    }
  }
}

export async function getStatus(req: Request, res: Response) {
  try {
    const id = req.params.id

    if (!id) {
      throw new ErrorHandler("No id found", 404)
    }
    const result = await getStatusService(id)

    if (!result) {
      return error(res, "No result", 500)
    }
    return success(res, result, 200)
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error
    } else {
      throw new ErrorHandler("Something went wrong", 500)
    }
  }
}

export async function removeRedisQueue(req: Request, res: Response) {
  try {
    const result = await removeRedisQueueService()
    return success(res, result, 200)
  } catch (error) {
    if (error instanceof ErrorHandler) {
      throw error
    } else {
      throw new ErrorHandler("Something went wrong", 500)
    }
  }
}
