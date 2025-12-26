import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { Meeting, UnifiedContent } from '@/lib/types'

export async function createMeeting(
  userId: string,
  data: {
    title: string
    sourceType: Meeting['sourceType']
    fileName?: string
    fileUrl?: string
    rawContent: UnifiedContent
  }
): Promise<string> {
  try {
    const meetingData = {
      userId,
      title: data.title,
      sourceType: data.sourceType,
      fileName: data.fileName || null,
      fileUrl: data.fileUrl || null,
      rawContent: data.rawContent,
      analyzed: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, 'meetings'), meetingData)
    return docRef.id
  } catch (error) {
    console.error('Error creating meeting:', error)
    throw error
  }
}

export async function getMeeting(meetingId: string): Promise<Meeting | null> {
  try {
    const docRef = doc(db, 'meetings', meetingId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
        updatedAt: docSnap.data().updatedAt.toDate(),
      } as Meeting
    }

    return null
  } catch (error) {
    console.error('Error getting meeting:', error)
    throw error
  }
}

export async function getUserMeetings(userId: string): Promise<Meeting[]> {
  try {
    const q = query(
      collection(db, 'meetings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    const meetings: Meeting[] = []

    querySnapshot.forEach(doc => {
      meetings.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Meeting)
    })

    return meetings
  } catch (error) {
    console.error('Error getting user meetings:', error)
    throw error
  }
}

export async function updateMeeting(
  meetingId: string,
  data: Partial<Meeting>
): Promise<void> {
  try {
    const docRef = doc(db, 'meetings', meetingId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating meeting:', error)
    throw error
  }
}

export async function deleteMeeting(meetingId: string): Promise<void> {
  try {
    const docRef = doc(db, 'meetings', meetingId)
    await deleteDoc(docRef)
    
    // Also delete associated analysis
    const analysisQuery = query(
      collection(db, 'analysis'),
      where('meetingId', '==', meetingId)
    )
    const analysisSnapshot = await getDocs(analysisQuery)
    
    const deletePromises = analysisSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    )
    
    await Promise.all(deletePromises)
  } catch (error) {
    console.error('Error deleting meeting:', error)
    throw error
  }
}
