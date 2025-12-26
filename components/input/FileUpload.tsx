'use client'

import { useState, useRef } from 'react'
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline'

interface FileUploadProps {
  acceptedTypes: string
  maxSize: number // in MB
  fileType: 'audio' | 'pdf' | 'docx'
  onFileSelect: (file: File) => void
}

export default function FileUpload({
  acceptedTypes,
  maxSize,
  fileType,
  onFileSelect,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const getFileTypeLabel = () => {
    switch (fileType) {
      case 'audio':
        return 'Audio File'
      case 'pdf':
        return 'PDF Document'
      case 'docx':
        return 'Word Document'
      default:
        return 'File'
    }
  }

  const validateFile = (file: File): boolean => {
    setError('')

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`)
      return false
    }

    // Check file type
    const acceptedTypesArray = acceptedTypes.split(',').map(t => t.trim())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!acceptedTypesArray.includes(fileExtension)) {
      setError(`Please upload a valid ${getFileTypeLabel()}`)
      return false
    }

    return true
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Upload {getFileTypeLabel()}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            dragActive
              ? 'border-blue-500 bg-blue-900/20'
              : 'border-gray-700 hover:border-gray-600'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={acceptedTypes}
          onChange={handleChange}
        />

        <CloudArrowUpIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        
        <p className="text-white font-medium mb-2">
          Drop your {getFileTypeLabel().toLowerCase()} here or click to browse
        </p>
        <p className="text-sm text-gray-500">
          Accepted formats: {acceptedTypes} (max {maxSize}MB)
        </p>
      </div>
    </div>
  )
}
