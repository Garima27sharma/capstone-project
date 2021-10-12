import * as uuid from 'uuid'
import 'source-map-support/register'
import { LibraryItem } from '../models/LibraryItem'
import { LibraryUpdate } from '../models/LibraryUpdate'
import { LibraryAccess } from '../dataLayer/librarysAccess'
import { createLogger } from '../utils/logger'
import { CreateLibraryRequest } from '../requests/CreateLibraryRequest'
import { UpdateLibraryRequest } from '../requests/UpdateLibraryRequest'
import { parseUserId } from '../auth/utils'

const libraryAccess = new LibraryAccess()
const logger = createLogger('librarys')

export async function updateBook(bookId: string, updateLibraryRequest: UpdateLibraryRequest, jwtToken: string): Promise<LibraryUpdate> {
  const userId = parseUserId(jwtToken)
  logger.info(`modify books information for user`, { userId })
  return await libraryAccess.updateBook(bookId, userId, updateLibraryRequest)
}

export async function getBooks(jwtToken: string): Promise<LibraryItem[]> {
  const userId = parseUserId(jwtToken) 
  logger.info(`get all books for user`, {userId})
  return libraryAccess.getBooks(userId)
}

export async function issueBook(createLibraryRequest: CreateLibraryRequest, jwtToken: string): Promise<LibraryItem> {
  const userId = parseUserId(jwtToken) 
  logger.info(`issue book for user`, { userId })
  const itemId = uuid.v4()

  return await libraryAccess.issueBook({
    bookId: itemId,
    userId: userId,
    name: createLibraryRequest.name,
    issueDate: createLibraryRequest.issueDate,
    dueDate: createLibraryRequest.dueDate,
    createdAt: new Date().toISOString(),
    bookStatus: false
  })
}

export async function deleteBook(bookId: string, jwtToken: string): Promise<void> {
  const userId = parseUserId(jwtToken)
  logger.info(`remove book for user`, { userId })
  return await libraryAccess.deleteBook(bookId, userId)
}

export async function updateUrl(bookId: string, attachmentUrl: string, jwtToken: string): Promise<void> {
  const userId = parseUserId(jwtToken)
  return await libraryAccess.updateUrl(bookId, userId, attachmentUrl)
}
