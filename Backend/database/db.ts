import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const mongoURI: string = process.env.DB_URL || ""

export const db = async () => {
  return await mongoose
    .connect(mongoURI)
    .then(() => console.log("Db connected"))
    .catch(() => {
      console.log("Something went wrong")
    })
}
