export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
      
      <div className="max-w-2xl space-y-6">
        {/* Preferences */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-white font-medium">Dark Mode</label>
                <p className="text-sm text-gray-400">Always enabled for optimal viewing</p>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Privacy & Security</h2>
          <p className="text-gray-400 text-sm">
            Your data is encrypted and stored securely. All AI processing happens server-side
            to protect your privacy. We never share your data with third parties.
          </p>
        </div>
      </div>
    </div>
  )
}
