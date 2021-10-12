import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteBook } from '../../businessLogic/librarys'
import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteBookHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info('Delete book for user',{event})
  const bookId = event.pathParameters.bookId

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  await deleteBook(bookId, jwtToken)
  return {
    statusCode: 204,
    body: ''
  }
})
handler.use(
  cors({
    credentials: true
  })
)
