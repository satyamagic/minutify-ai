export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Minutify</h1>
          <p className="text-gray-400">Meeting & Document Analysis Platform</p>
        </div>
        {children}
      </div>
    </div>
  )
}
