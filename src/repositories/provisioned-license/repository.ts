import { relations } from 'drizzle-orm';
import {
  pgTable,
  uniqueIndex,
  text,
  bigserial,
  timestamp,
  boolean,
  primaryKey,
  uuid,
  integer
} from 'drizzle-orm/pg-core';
import { table as missionPartners } from '@/repositories/mission-partner/repository';

const TABLE_NAME = 'provisioned_licenses';

export const table = pgTable(
  `${process.env.TABLE_PREFIX || ''}${TABLE_NAME}`,
  {
    // Primary Key
    missionPartnerId: uuid('mission_partner_id').notNull(),
    vendorId: text('vendor_id').notNull(),

    // Metadata
    idx: bigserial('idx', { mode: 'number' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),

    // Data
    vendorName: text('vendor_name'),
    provisioned: integer('provisioned').notNull(),
    autoAssignmentEnabled: boolean('auto_assignment_enabled')
      .default(false)
      .notNull()
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.missionPartnerId, table.vendorId]
    }),
    idxIndex: uniqueIndex(`${TABLE_NAME}_idx_index`).on(table.idx)
  })
);

export const provisionedLicenseRelations = relations(table, ({ one }) => ({
  missionPartner: one(missionPartners, {
    fields: [table.missionPartnerId],
    references: [missionPartners.id]
  })
}));

export type NewProvisionedLicense = typeof table.$inferInsert;
export type ProvisionedLicense = typeof table.$inferSelect;
