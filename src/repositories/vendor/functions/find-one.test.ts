import { database } from '@/database';
import { table } from '../repository';
import { findOne } from './find-one';

const MOCK_UUID = '00000000-0000-0000-0000-000000000000';
const NOT_FOUND_UUID = '00000000-0000-0000-0000-000000000001';

describe('findOne', () => {
  const db = database();

  beforeAll(async () => {
    await db.insert(table).values({ id: MOCK_UUID, name: 'foobar' });
  });

  afterAll(async () => {
    await db.delete(table);
  });

  it('should throw if options is not provided', async () => {
    // @ts-expect-error: Testing invalid input
    await expect(findOne()).rejects.toThrow('Validation error: Required');
  });

  it('should throw if id not provided', async () => {
    // @ts-expect-error: Testing invalid input
    await expect(findOne({})).rejects.toThrow(
      'Validation error: Required at "id"'
    );
  });

  it('should return the matching record', async () => {
    const record = await findOne({ id: MOCK_UUID });
    expect(record?.id).toEqual(MOCK_UUID);
    expect(record?.name).toEqual('foobar');
  });

  it('should return undefined when not found', async () => {
    const record = await findOne({ id: NOT_FOUND_UUID });
    expect(record).toBeUndefined();
  });
});
