import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getBooks } from '../../businessLogic/librarys'
import { createLogger } from '../../utils/logger'

const logger = createLogger('getBooksHandler')
export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Get books for user', event)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const items = await getBooks(jwtToken)

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: items
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
