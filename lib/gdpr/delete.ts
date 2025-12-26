import { deleteDoc, getDocs, collection, query, where } from 'firebase/firestore'
import { ref, listAll, deleteObject } from 'firebase/storage'
import { db, storage } from '@/lib/firebase/client'

/**
 * Delete all user data (GDPR compliance)
 */
export async function deleteAllUserData(userId: string): Promise<void> {
  try {
    // Delete all meetings
    const meetingsQuery = query(collection(db, 'meetings'), where('userId', '==', userId))
    const meetingsSnapshot = await getDocs(meetingsQuery)
    
    const meetingDeletePromises = meetingsSnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(meetingDeletePromises)

    // Delete all analysis
    const analysisQuery = query(collection(db, 'analysis'), where('userId', '==', userId))
    const analysisSnapshot = await getDocs(analysisQuery)
    
    const analysisDeletePromises = analysisSnapshot.docs.map(doc => deleteDoc(doc.ref))
    await Promise.all(analysisDeletePromises)

    // Delete all files from storage
    const audioRef = ref(storage, `audio/${userId}`)
    const documentRef = ref(storage, `documents/${userId}`)

    try {
      const audioFiles = await listAll(audioRef)
      const audioDeletePromises = audioFiles.items.map(item => deleteObject(item))
      await Promise.all(audioDeletePromises)
    } catch (error) {
      // Folder might not exist
      console.log('No audio files to delete')
    }

    try {
      const documentFiles = await listAll(documentRef)
      const documentDeletePromises = documentFiles.items.map(item => deleteObject(item))
      await Promise.all(documentDeletePromises)
    } catch (error) {
      // Folder might not exist
      console.log('No document files to delete')
    }

    console.log('All user data deleted successfully')
  } catch (error) {
    console.error('Error deleting user data:', error)
    throw error
  }
}
