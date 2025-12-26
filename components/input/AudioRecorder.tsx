'use client'

import { useState, useRef } from 'react'
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid'

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        onRecordingComplete(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please grant permission and try again.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Record Audio</h3>

      <div className="flex flex-col items-center justify-center py-8">
        {isRecording ? (
          <>
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-red-600 rounded-full p-6">
                <MicrophoneIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <p className="text-2xl font-mono text-white mb-6">{formatTime(recordingTime)}</p>
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-white transition-colors"
            >
              <StopIcon className="h-5 w-5" />
              Stop Recording
            </button>
          </>
        ) : (
          <>
            <div className="bg-gray-800 rounded-full p-6 mb-4">
              <MicrophoneIcon className="h-12 w-12 text-gray-400" />
            </div>
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-colors"
            >
              Start Recording
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Click to start recording your meeting or conversation
            </p>
          </>
        )}
      </div>
    </div>
  )
}
