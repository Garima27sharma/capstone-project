import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { updateUrl } from '../../businessLogic/librarys'
import { createLogger } from '../../utils/logger'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const toStore = process.env.ATTACHMENTS_S3_BUCKET
const expire = process.env.SIGNED_URL_EXPIRATION
const logger = createLogger('generateUploadUrlHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Generate upload url', event)
  const bookId = event.pathParameters.bookId
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const imId = uuid.v4()
  const imUrl = `https://${toStore}.s3.amazonaws.com/${imId}`
  updateUrl(
    bookId,
    imUrl,
    jwtToken
  )
  const uploadUrl = getUploadUrl(imId)
  return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: toStore,
    Key: imageId,
    Expires: parseInt(expire) 
  })
}
