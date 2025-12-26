export default function MeetingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">My Meetings</h1>
      
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
        <p className="text-gray-400 text-lg">No meetings yet</p>
        <p className="text-gray-500 text-sm mt-2">
          Start by creating your first analysis
        </p>
        <a
          href="/dashboard/new"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          New Analysis
        </a>
      </div>
    </div>
  )
}
