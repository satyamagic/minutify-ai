import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import type { AIAnalysis } from '@/lib/types'

export async function createAnalysis(
  meetingId: string,
  userId: string,
  data: Omit<AIAnalysis, 'id' | 'createdAt'>
): Promise<string> {
  try {
    const analysisData = {
      meetingId,
      userId,
      summary: data.summary,
      topics: data.topics,
      actionItems: data.actionItems,
      createdAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, 'analysis'), analysisData)
    return docRef.id
  } catch (error) {
    console.error('Error creating analysis:', error)
    throw error
  }
}

export async function getAnalysisByMeetingId(
  meetingId: string
): Promise<AIAnalysis | null> {
  try {
    const q = query(collection(db, 'analysis'), where('meetingId', '==', meetingId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    } as AIAnalysis
  } catch (error) {
    console.error('Error getting analysis:', error)
    throw error
  }
}

export async function deleteAnalysis(analysisId: string): Promise<void> {
  try {
    const docRef = doc(db, 'analysis', analysisId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting analysis:', error)
    throw error
  }
}
