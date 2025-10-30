import axios from "axios"
import { useState } from "react"

const API_BASE_URL = import.meta.env.VITE_BASE_URL

export const generateVideo = async (prompt: String) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, {
      prompt: prompt,
    })

    const id = response.data.data.newJob._id

    return { jobId: id, status: "queued" }
  } catch (error: any) {
    if (error.response) {
      console.error("Server Error:", error.response.status)
      console.error("Error Data:", error.response.data)
      throw new Error(error.response.data.message || "Video generation failed")
    } else if (error.request) {
      console.error("Network Error:", error.request)
      throw new Error("No response from server. Check your connection.")
    } else {
      console.error("Error:", error.message)
      throw new Error("Failed to make request")
    }
  }
}

export const getStatus = async (jobId: String) => {
  try {
    const getStatus = await axios.get(
      `http://localhost:5000/api/v1/getStatus/${jobId}`
    )
    console.log(getStatus.data.data)

    return getStatus.data.data
  } catch (error) {
    console.error("Error fetching video status:", error)
    throw new Error("Failed to get video status.")
  }
}
