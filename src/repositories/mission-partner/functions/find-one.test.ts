import { database } from '@/database';
import { table } from '../repository';
import { table as provisionedLicenses } from '@/repositories/provisioned-license/repository';
import { findOne } from './find-one';

const MOCK_UUID = '00000000-0000-0000-0000-000000000000';
const NOT_FOUND_UUID = '00000000-0000-0000-0000-000000000001';

describe('findOne', () => {
  const db = database();

  beforeAll(async () => {
    await db.insert(table).values({
      id: MOCK_UUID,
      name: 'Mission Partner A',
      description: 'Mission Partner A description',
      logoUrl: 'https://example.com/logo.png',
      accessCode: '1234',
      affiliateId: '5678',
      sectionType: 'FIELD_COMMAND',
      slug: 'mission-partner-a',
      customTrainingEnabled: false,
      enabledReports: []
    });

    await db.insert(provisionedLicenses).values({
      missionPartnerId: MOCK_UUID,
      vendorId: 'vendor-id',
      vendorName: 'Vendor Name',
      provisioned: 10,
      autoAssignmentEnabled: true
    });
  });

  afterAll(async () => {
    await db.delete(table);
    await db.delete(provisionedLicenses);
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
    expect(record?.name).toEqual('Mission Partner A');
    expect(record?.description).toEqual('Mission Partner A description');
    expect(record?.logoUrl).toEqual('https://example.com/logo.png');
    expect(record?.accessCode).toEqual('1234');
    expect(record?.affiliateId).toEqual('5678');
    expect(record?.sectionType).toEqual('FIELD_COMMAND');
    expect(record?.slug).toEqual('mission-partner-a');
    expect(record?.customTrainingEnabled).toEqual(false);
    expect(record?.enabledReports).toEqual([]);
  });

  it('should include the provisioned licenses relation', async () => {
    const record = await findOne({ id: MOCK_UUID });
    expect(record?.provisionedLicenses.length).toEqual(1);
    expect(record?.provisionedLicenses[0].missionPartnerId).toEqual(MOCK_UUID);
    expect(record?.provisionedLicenses[0].vendorId).toEqual('vendor-id');
    expect(record?.provisionedLicenses[0].vendorName).toEqual('Vendor Name');
    expect(record?.provisionedLicenses[0].provisioned).toEqual(10);
    expect(record?.provisionedLicenses[0].autoAssignmentEnabled).toEqual(true);
  });

  it('should return undefined when not found', async () => {
    const record = await findOne({
      id: NOT_FOUND_UUID
    });
    expect(record).toBeUndefined();
  });
});
