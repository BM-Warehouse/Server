module.exports = {
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@exceptions/(.*)$': '<rootDir>/src/exceptions/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@responses/(.*)$': '<rootDir>/src/responses/$1',
  },
  // You can add other Jest configuration options here as needed
};
