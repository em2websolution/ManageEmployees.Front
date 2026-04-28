const authConfig = {
  loginEndpoint: '/Login/SignIn',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

export default authConfig
