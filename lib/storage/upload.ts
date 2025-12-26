import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/lib/firebase/client'

export interface UploadProgress {
  progress: number
  status: 'uploading' | 'completed' | 'error'
  downloadURL?: string
  error?: string
}

export async function uploadFile(
  file: File | Blob,
  userId: string,
  fileType: 'audio' | 'document',
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Generate unique filename
      const timestamp = Date.now()
      const fileName = file instanceof File ? file.name : `recording-${timestamp}.webm`
      const path = `${fileType}s/${userId}/${timestamp}-${fileName}`

      const storageRef = ref(storage, path)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          onProgress?.({
            progress,
            status: 'uploading',
          })
        },
        error => {
          console.error('Upload error:', error)
          onProgress?.({
            progress: 0,
            status: 'error',
            error: error.message,
          })
          reject(error)
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            onProgress?.({
              progress: 100,
              status: 'completed',
              downloadURL,
            })
            resolve(downloadURL)
          } catch (error) {
            reject(error)
          }
        }
      )
    } catch (error) {
      reject(error)
    }
  })
}

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, fileUrl)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export function isValidAudioFile(filename: string): boolean {
  const validExtensions = ['mp3', 'wav', 'm4a', 'webm', 'ogg']
  return validExtensions.includes(getFileExtension(filename))
}

export function isValidDocumentFile(filename: string): boolean {
  const validExtensions = ['pdf', 'docx']
  return validExtensions.includes(getFileExtension(filename))
}
