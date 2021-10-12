import { apiEndpoint } from '../config'
import { Library } from '../types/Library';
import Axios from 'axios'
import { CreateLibraryRequest } from '../types/CreateLibraryRequest';
import { UpdateLibraryRequest } from '../types/UpdateLibraryRequest';

export async function getBooks(idToken: string): Promise<Library[]> {
  console.log('Books list')

  const response = await Axios.get(`${apiEndpoint}/librarys`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Books:', response.data)
  return response.data.items
}

export async function issueBook(
  idToken: string,
  newBook: CreateLibraryRequest
): Promise<Library> {
  const response = await Axios.post(`${apiEndpoint}/librarys`,  JSON.stringify(newBook), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchBook(
  idToken: string,
  bookId: string,
  updatedBook: UpdateLibraryRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/librarys/${bookId}`, JSON.stringify(updatedBook), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteBook(
  idToken: string,
  bookId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/librarys/${bookId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}

export async function getUploadUrl(
  idToken: string,
  bookId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/librarys/${bookId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

