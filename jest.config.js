module.exports = {
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  transform: {
    '^.+\\.tsx?$': 'esbuild-jest',
  },
};
