import * as index from './index';

describe('index', () => {
  it('should export the public functions', () => {
    expect(index.findOne).toBeDefined();
  });
});
