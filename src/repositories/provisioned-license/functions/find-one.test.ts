import { database } from '@/database';
import { table } from '../repository';
import { findOne } from './find-one';

const MOCK_UUID = '00000000-0000-0000-0000-000000000000';
const NOT_FOUND_UUID = '00000000-0000-0000-0000-000000000001';

describe('findOne', () => {
  const db = database();

  beforeAll(async () => {
    await db.insert(table).values({
      missionPartnerId: MOCK_UUID,
      provisioned: 100,
      vendorId: 'udemy',
      createdAt: new Date('2024-06-21T18:13:54.377Z')
    });
  });

  afterAll(async () => {
    await db.delete(table);
  });

  it('should throw if options is not provided', async () => {
    // @ts-expect-error: Testing invalid input
    await expect(findOne()).rejects.toThrow('Validation error: Required');
  });

  it('should throw if missionPartnerId & vendorId not provided', async () => {
    // @ts-expect-error: Testing invalid input
    await expect(findOne({})).rejects.toThrow(
      'Validation error: Required at "missionPartnerId"; Required at "vendorId"'
    );
  });

  it('should return the matching record', async () => {
    const record = await findOne({
      missionPartnerId: MOCK_UUID,
      vendorId: 'udemy'
    });
    if (!record) throw new Error('Record not found.');

    expect(record.missionPartnerId).toEqual(MOCK_UUID);
    expect(record.provisioned).toEqual(100);
    expect(record.vendorId).toEqual('udemy');
  });

  it('should return undefined when not found', async () => {
    const record = await findOne({
      missionPartnerId: NOT_FOUND_UUID,
      vendorId: 'udemy'
    });
    expect(record).toBeUndefined();
  });
});
