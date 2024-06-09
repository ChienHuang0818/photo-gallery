module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jest-environment-jsdom',
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
	transform: {
	  '^.+\\.(ts|tsx)$': 'ts-jest',
	},
	moduleNameMapper: {
	  '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
	  '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/components/test/__mocks__/fileMock.js',
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
  };
  