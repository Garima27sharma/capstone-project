import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { UpdateLibraryRequest } from '../../requests/UpdateLibraryRequest'
import { updateBook } from '../../businessLogic/librarys'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateBookHandler')
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info('Update book for user', event)
  const bookId = event.pathParameters.bookId
  console.log(bookId)
  const updatedBook: UpdateLibraryRequest = JSON.parse(event.body)
  console.log(updatedBook)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  await updateBook(bookId, updatedBook, jwtToken)
  return {
    statusCode: 200,
    body: ''
  }
})

handler.use(
  cors({
    credentials: true
  })
)
