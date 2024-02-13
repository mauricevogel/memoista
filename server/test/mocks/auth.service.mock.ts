export const AuthServiceMock = {
  refreshAccessTokens: jest.fn(),
  registerUserWithCredentials: jest.fn(),
  signInWithCredentials: jest.fn(),
  signinWithGoogle: jest.fn(),
  verifyUser: jest.fn()
}
