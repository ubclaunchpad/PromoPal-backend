// This will make sure that the actual redis is never loaded and whenever any file tries to import/require redis,
// redis-mock will be returned instead
jest.mock('redis', () => jest.requireActual('redis-mock'));
