import { getStatus, prompt, removeRedisQueue } from "../app/controller/prompt"
import express from "express"

const router = express.Router()

router.post("/generate-video", prompt)
router.get("/getStatus/:id", getStatus)
router.get("/delete", removeRedisQueue)

export default router
