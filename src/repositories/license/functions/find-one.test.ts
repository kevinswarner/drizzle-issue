import { database } from '@/database';
import { table } from '../repository';
import { table as users } from '@/repositories/user/repository';
import { table as vendors } from '@/repositories/vendor/repository';
import { table as missionPartners } from '@/repositories/mission-partner/repository';
import { findOne } from './find-one';

const MOCK_UUID = '00000000-0000-0000-0000-000000000000';
const NOT_FOUND_UUID = '00000000-0000-0000-0000-000000000001';

describe('findOne', () => {
  const db = database();

  beforeAll(async () => {
    await db.insert(table).values({
      id: MOCK_UUID,
      userId: MOCK_UUID,
      vendorId: MOCK_UUID,
      missionPartnerId: MOCK_UUID,
      assignedAt: new Date('2021-01-01'),
      lastUsedAt: new Date('2021-01-02'),
      lastUsedTrainingItemTitle: 'Test'
    });

    await db.insert(users).values({
      id: MOCK_UUID,
      email: 'bart@simpsons.com',
      firstName: 'Bart',
      lastName: 'Simpson'
    });

    await db.insert(vendors).values({
      id: MOCK_UUID,
      name: 'Vendor A'
    });

    await db.insert(missionPartners).values({
      id: MOCK_UUID,
      name: 'Mission Partner A'
    });
  });

  afterAll(async () => {
    await db.delete(table);
    await db.delete(users);
    await db.delete(vendors);
    await db.delete(missionPartners);
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
    expect(record?.userId).toEqual(MOCK_UUID);
    expect(record?.vendorId).toEqual(MOCK_UUID);
    expect(record?.missionPartnerId).toEqual(MOCK_UUID);
    expect(record?.assignedAt).toEqual(new Date('2021-01-01'));
    expect(record?.lastUsedAt).toEqual(new Date('2021-01-02'));
    expect(record?.lastUsedTrainingItemTitle).toEqual('Test');
  });

  it('should include the user relation', async () => {
    const record = await findOne({ id: MOCK_UUID });
    expect(record?.userId).toEqual(MOCK_UUID);
    expect(record?.user?.id).toEqual(MOCK_UUID);
    expect(record?.user?.email).toEqual('bart@simpsons.com');
    expect(record?.user?.firstName).toEqual('Bart');
    expect(record?.user?.lastName).toEqual('Simpson');
  });

  it('should include the vendor relation', async () => {
    const record = await findOne({ id: MOCK_UUID });
    expect(record?.vendorId).toEqual(MOCK_UUID);
    expect(record?.vendor?.id).toEqual(MOCK_UUID);
    expect(record?.vendor?.name).toEqual('Vendor A');
  });

  it('should include the mission partner relation', async () => {
    const record = await findOne({ id: MOCK_UUID });
    expect(record?.missionPartnerId).toEqual(MOCK_UUID);
    expect(record?.missionPartner?.id).toEqual(MOCK_UUID);
    expect(record?.missionPartner?.name).toEqual('Mission Partner A');
  });

  it('should return undefined when not found', async () => {
    const record = await findOne({ id: NOT_FOUND_UUID });
    expect(record).toBeUndefined();
  });
});
