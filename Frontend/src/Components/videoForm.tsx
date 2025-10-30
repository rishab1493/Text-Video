import React, { useState } from "react"
import { generateVideo, getStatus } from "../Helper/api"

const VideoForm = ({ onVideoReady, onProgress }: any) => {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    onProgress(10)

    try {
      const { jobId } = await generateVideo(prompt)
      onProgress(40)

      const interval = setInterval(async () => {
        try {
          const statusData = await getStatus(jobId)

          if (statusData.status === "completed") {
            clearInterval(interval)
            onProgress(100)
            onVideoReady(statusData.videoUrl)
            setLoading(false)
          } else if (statusData.status === "failed") {
            clearInterval(interval)
            setLoading(false)
            alert("Video generation failed.")
          }
        } catch (error) {
          console.error("Polling error:", error)
          clearInterval(interval)
          setLoading(false)
        }
      }, 2000)
    } catch (error) {
      console.error("Error generating video:", error)
      alert("Failed to generate video")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="w-full p-4 rounded-xl bg-gray-700/70 border border-gray-600 focus:border-blue-500 text-white placeholder-gray-400 focus:outline-none resize-none transition-all"
        rows={3}
        placeholder="Describe the video you want to generate..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>

      <button
        type="submit"
        disabled={loading}
        className={`mt-4 w-full py-3 rounded-xl text-lg font-semibold transition-all ${
          loading
            ? "bg-blue-800 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
            Generating...
          </span>
        ) : (
          "Generate Video"
        )}
      </button>
    </form>
  )
}

export default VideoForm
