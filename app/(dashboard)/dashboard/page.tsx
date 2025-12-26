export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Welcome to Minutify</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Meetings</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Hours Analyzed</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Action Items</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/new"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg p-6 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              New Analysis
            </h3>
            <p className="text-sm text-blue-100">
              Upload audio, documents, or record a new meeting
            </p>
          </a>

          <a
            href="/dashboard/meetings"
            className="bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-lg p-6 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              View Meetings
            </h3>
            <p className="text-sm text-gray-400">
              Browse your past meetings and analyses
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}
