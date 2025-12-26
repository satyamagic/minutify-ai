export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-4">Minutify</h1>
        <p className="text-xl text-gray-400 mb-8">
          Modern meeting and document analysis platform
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            Register
          </a>
        </div>
      </main>
    </div>
  )
}
