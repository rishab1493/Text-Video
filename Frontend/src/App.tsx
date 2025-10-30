import { useState } from "react"
import VideoForm from "./Components/videoForm"
import ProgressBar from "./Components/progressBar"

import VideoPlayer from "./Components/videoPlayer"

function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
          🎬 Text-to-Video Generator
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Enter your idea and watch it turn into a short video ✨
        </p>
      </div>

      <div className="w-full max-w-lg bg-gray-800/60 p-6 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-700">
        <VideoForm onVideoReady={setVideoUrl} onProgress={setProgress} />
        {progress > 0 && progress < 100 && <ProgressBar progress={progress} />}
      </div>

      {videoUrl && (
        <div className="mt-10 animate-fadeIn">
          <VideoPlayer url={videoUrl} />
        </div>
      )}
    </div>
  )
}

export default App
