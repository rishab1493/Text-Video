const VideoPlayer = ({ url }: any) => (
  <div className="flex flex-col items-center">
    <video
      controls
      className="w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-700"
    >
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <p className="text-gray-400 text-sm mt-2">
      🎉 Video ready! Click play to preview your generated clip.
    </p>
  </div>
)

export default VideoPlayer
