// Base types for the application

export type SourceType = 'audio' | 'pdf' | 'docx' | 'gdoc'

export interface ContentSegment {
  index: number
  minute: number | null // For audio transcripts
  title: string | null // For documents
  content: string
}

export interface UnifiedContent {
  sourceType: SourceType
  segments: ContentSegment[]
}

export interface User {
  uid: string
  email: string
  createdAt: Date
}

export interface Meeting {
  id: string
  userId: string
  title: string
  sourceType: SourceType
  fileName?: string
  fileUrl?: string
  rawContent: UnifiedContent
  createdAt: Date
  updatedAt: Date
  analyzed: boolean
}

export interface AIAnalysis {
  id: string
  meetingId: string
  summary: string
  topics: Topic[]
  actionItems: ActionItem[]
  createdAt: Date
}

export interface Topic {
  title: string
  startIndex: number
  endIndex: number
  explanation: string
}

export interface ActionItem {
  description: string
  context: string
  segmentIndex: number
  priority?: 'low' | 'medium' | 'high'
}
