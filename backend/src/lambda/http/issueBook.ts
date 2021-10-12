import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateLibraryRequest } from '../../requests/CreateLibraryRequest'
import { issueBook } from '../../businessLogic/librarys'
import { createLogger } from '../../utils/logger'

const logger = createLogger('issueBookHandler')
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info('issue book for user', event)
  const newBook: CreateLibraryRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const newItem = await issueBook(newBook, jwtToken)
  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newItem
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
