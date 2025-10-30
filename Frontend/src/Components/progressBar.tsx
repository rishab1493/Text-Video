const ProgressBar = ({ progress }: any) => (
  <div className="w-full mt-6 bg-gray-700/80 rounded-full h-3 overflow-hidden shadow-inner">
    <div
      className="h-3 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
)

export default ProgressBar
