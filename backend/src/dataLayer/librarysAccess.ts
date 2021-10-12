import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { LibraryItem } from '../models/LibraryItem'
import { LibraryUpdate } from '../models/LibraryUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('todosAccess')
const storage = process.env.ATTACHMENTS_S3_BUCKET
const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export class LibraryAccess {

  constructor(
    private readonly docClient: DocumentClient = newCreateDynamoDBClient(),
    private readonly booksTable = process.env.BOOKS_TABLE,
    private readonly createdIdIndex = process.env.CREATED_AT_INDEX
  ) { }

  async getBooks(userId: string): Promise<LibraryItem[]> {
    console.log('Getting all books')

    const con = await this.docClient.query({
      TableName: this.booksTable,
      IndexName: this.createdIdIndex, 
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
      ScanIndexForward: false 
    }).promise()

    const items = con.Items
    return items as LibraryItem[]
  }

  async issueBook(libraryItem: LibraryItem): Promise<LibraryItem> {
    logger.info(`item put into table ${this.booksTable}`)

    await this.docClient.put({
      TableName: this.booksTable,
      Item: libraryItem
    }).promise()

    return libraryItem
  }

  async updateBook(bookId: string, userId: string, libraryUpdate: LibraryUpdate): Promise<LibraryUpdate> {
    logger.info(`item update by ${bookId}`)
    await this.docClient.update({
      TableName: this.booksTable,
      Key: {
        bookId,
        userId
      },
      UpdateExpression: 'set #name = :name, bookStatus = :bookStatus, issueDate = :issueDate, dueDate = :dueDate',
      ExpressionAttributeValues: {
        ':name': libraryUpdate.name,
        ':bookStatus': libraryUpdate.bookStatus,
        ':issueDate': libraryUpdate.issueDate,
        ':dueDate': libraryUpdate.dueDate
      },
      ExpressionAttributeNames: { '#name': 'name' },
      ReturnValues: 'UPDATED_NEW',
    }).promise()

    return libraryUpdate
  }

  async deleteBook(bookId: string, userId: string): Promise<void> {
    logger.info(`items removed by ${bookId}`)
    const con = await this.docClient.get({
      TableName: this.booksTable,
      Key: {
        bookId,
        userId
      }
    }).promise()
    
    if (con) {
      if (con.Item.attachmentUrl) {
        const imUrl = con.Item.attachmentUrl
        console.log( imUrl)
        const imKey = imUrl.substring(imUrl.lastIndexOf('/') + 1)
        console.log('remove image from bucket: ', imKey)

        removeBucketImage(storage, imKey)
      }
    }

    await this.docClient.delete({
      TableName: this.booksTable,
      Key: {
        bookId,
        userId
      }
    }).promise()
  }

  async updateUrl(bookId: string, userId: string, attachmentUrl: string): Promise<void> {
    logger.info(`URL change by ${bookId}`)

    const con = await this.docClient.get({
      TableName: this.booksTable,
      Key: {
        bookId,
        userId
      }
    }).promise()

    if (con) {
      if (con.Item.attachmentUrl) {
        
        const imUrl = con.Item.attachmentUrl
        console.log(imUrl)
        const imKey = imUrl.substring(imUrl.lastIndexOf('/') + 1)
        console.log('remove image from bucket: ', imKey)        
        removeBucketImage(storage, imKey)
      }
    }

    await this.docClient.update({
      TableName: this.booksTable,
      Key: {
        bookId,
        userId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      ReturnValues: 'UPDATED_NEW'
    }).promise()
  }
}

function removeBucketImage(bucket: string, key: string) {
  s3.deleteObject({ Store: bucket, Key: key }, function (e,info) {
    if (e) console.log(e, e.stack) 
    else console.log(info)
  })
}

function newCreateDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Create local DB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:3000'
    })
  }
  return new AWS.DynamoDB.DocumentClient()
}


