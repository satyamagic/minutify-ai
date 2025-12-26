export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>
      
      <div className="max-w-2xl space-y-6">
        {/* User Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <p className="text-white">user@example.com</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Member Since</label>
              <p className="text-white">December 2025</p>
            </div>
          </div>
        </div>

        {/* GDPR Controls */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Data Management</h2>
          <p className="text-gray-400 text-sm mb-4">
            Export or delete your data in compliance with GDPR regulations
          </p>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
              Export All Data
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
              Delete All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
