// DONE: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'x1d19tj3ol'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // DONE: reate an Auth0 application and copy values from it into this map
  domain: 'dev-wo9gy0se.us.auth0.com',  // Auth0 domain
  clientId: '6mUa2C7NKAAlqo4qwThvA7kSoVjAgU3w',  // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
