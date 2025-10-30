import express from "express"
import { db } from "../database/db"
import dotenv from "dotenv"
import promptRoute from "../routes/promptRoute"
import path = require("path")
import cors from "cors"

dotenv.config()
const app = express()
app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:5173", // or "*" for all
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
)
const rootDir = path.resolve()
app.use(
  "/videos",
  express.static(path.join(rootDir, "../Worker/public/videos"))
)
app.use("/api/v1", promptRoute)

const PORT = process.env.PORT || 5000

function start() {
  db()
  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
  })
}

start()
