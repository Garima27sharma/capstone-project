export interface LibraryItem {
  userId: string
  bookId: string
  createdAt: string
  name: string
  issueDate: string
  dueDate: string
  bookStatus: boolean
  attachmentUrl?: string
}
