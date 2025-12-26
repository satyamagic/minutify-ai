'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import AudioRecorder from '@/components/input/AudioRecorder'
import FileUpload from '@/components/input/FileUpload'
import { uploadFile, UploadProgress } from '@/lib/storage/upload'

type InputMode =
  | 'select'
  | 'record-audio'
  | 'upload-audio'
  | 'upload-pdf'
  | 'upload-docx'
  | 'google-docs'

export default function NewAnalysisPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [mode, setMode] = useState<InputMode>('select')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [googleDocsUrl, setGoogleDocsUrl] = useState('')

  const handleRecordingComplete = async (audioBlob: Blob) => {
    if (!user) return

    setUploading(true)
    try {
      const downloadURL = await uploadFile(audioBlob, user.uid, 'audio', progress => {
        setUploadProgress(progress)
      })

      // TODO: Send to Python service for transcription
      console.log('Audio uploaded:', downloadURL)
      alert('Recording uploaded successfully! Processing will be implemented in Step 6.')
      setMode('select')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload recording')
    } finally {
      setUploading(false)
      setUploadProgress(null)
    }
  }

  const handleFileSelect = async (file: File) => {
    if (!user) return

    setUploading(true)
    try {
      const fileType = file.name.endsWith('.pdf') || file.name.endsWith('.docx') ? 'document' : 'audio'
      
      const downloadURL = await uploadFile(file, user.uid, fileType, progress => {
        setUploadProgress(progress)
      })

      // TODO: Send to Python service for processing
      console.log('File uploaded:', downloadURL)
      alert('File uploaded successfully! Processing will be implemented in Step 6.')
      setMode('select')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload file')
    } finally {
      setUploading(false)
      setUploadProgress(null)
    }
  }

  const handleGoogleDocsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement Google Docs fetching in Step 6
    alert('Google Docs integration will be implemented in Step 6.')
  }

  if (mode === 'select') {
    return (
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">New Analysis</h1>

        <div className="max-w-4xl">
          <p className="text-gray-400 mb-8">
            Choose how you want to input your content for analysis
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audio Recording */}
            <button
              onClick={() => setMode('record-audio')}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-600 transition-colors text-left"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Record Audio</h3>
              <p className="text-sm text-gray-400">
                Record a meeting or conversation directly from your browser
              </p>
            </button>

            {/* Audio Upload */}
            <button
              onClick={() => setMode('upload-audio')}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-600 transition-colors text-left"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Upload Audio</h3>
              <p className="text-sm text-gray-400">Upload an audio file (MP3, WAV, M4A)</p>
            </button>

            {/* PDF Upload */}
            <button
              onClick={() => setMode('upload-pdf')}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-600 transition-colors text-left"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Upload PDF</h3>
              <p className="text-sm text-gray-400">Upload a PDF document for analysis</p>
            </button>

            {/* DOCX Upload */}
            <button
              onClick={() => setMode('upload-docx')}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-600 transition-colors text-left"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Upload DOCX</h3>
              <p className="text-sm text-gray-400">Upload a Word document for analysis</p>
            </button>

            {/* Google Docs */}
            <button
              onClick={() => setMode('google-docs')}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-600 transition-colors text-left md:col-span-2"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Import from Google Docs
              </h3>
              <p className="text-sm text-gray-400">
                Enter a Google Docs URL for read-only access
              </p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => setMode('select')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-white">
          {mode === 'record-audio' && 'Record Audio'}
          {mode === 'upload-audio' && 'Upload Audio'}
          {mode === 'upload-pdf' && 'Upload PDF'}
          {mode === 'upload-docx' && 'Upload DOCX'}
          {mode === 'google-docs' && 'Import Google Docs'}
        </h1>
      </div>

      <div className="max-w-2xl">
        {uploading && uploadProgress && (
          <div className="mb-6 bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress.progress)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {mode === 'record-audio' && (
          <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        )}

        {mode === 'upload-audio' && (
          <FileUpload
            acceptedTypes=".mp3,.wav,.m4a,.webm,.ogg"
            maxSize={100}
            fileType="audio"
            onFileSelect={handleFileSelect}
          />
        )}

        {mode === 'upload-pdf' && (
          <FileUpload
            acceptedTypes=".pdf"
            maxSize={50}
            fileType="pdf"
            onFileSelect={handleFileSelect}
          />
        )}

        {mode === 'upload-docx' && (
          <FileUpload
            acceptedTypes=".docx"
            maxSize={50}
            fileType="docx"
            onFileSelect={handleFileSelect}
          />
        )}

        {mode === 'google-docs' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Google Docs URL</h3>
            <form onSubmit={handleGoogleDocsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Document URL
                </label>
                <input
                  type="url"
                  value={googleDocsUrl}
                  onChange={e => setGoogleDocsUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://docs.google.com/document/d/..."
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  The document must be publicly accessible or shared with view permissions
                </p>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors"
              >
                Import Document
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
