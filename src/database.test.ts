import * as database from './database.js';

describe('database', () => {
  describe('database', () => {
    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it('should return an instance of PostgresJsDatabase', () => {
      vi.stubEnv('DATABASE_USERNAME', 'username');
      vi.stubEnv('DATABASE_PASSWORD', 'password');
      vi.stubEnv('DATABASE_HOST', 'localhost');
      vi.stubEnv('DATABASE_PORT', '5432');
      vi.stubEnv('DATABASE_NAME', 'database');

      const db = database.database();
      expect(db).toBeDefined();
    });

    it('should throw when DATABASE_USERNAME is not set', () => {
      vi.stubEnv('DATABASE_USERNAME', '');

      expect(() => database.database()).toThrow(
        'Environment variable DATABASE_USERNAME is required.'
      );
    });

    it('should throw when DATABASE_PASSWORD is not set', () => {
      vi.stubEnv('DATABASE_PASSWORD', '');

      expect(() => database.database()).toThrow(
        'Environment variable DATABASE_PASSWORD is required.'
      );
    });

    it('should throw when DATABASE_HOST is not set', () => {
      vi.stubEnv('DATABASE_HOST', '');

      expect(() => database.database()).toThrow(
        'Environment variable DATABASE_HOST is required.'
      );
    });

    it('should throw when DATABASE_PORT is not set', () => {
      vi.stubEnv('DATABASE_PORT', '');

      expect(() => database.database()).toThrow(
        'Environment variable DATABASE_PORT is required.'
      );
    });

    it('should throw when DATABASE_NAME is not set', () => {
      vi.stubEnv('DATABASE_NAME', '');

      expect(() => database.database()).toThrow(
        'Environment variable DATABASE_NAME is required.'
      );
    });
  });
});
