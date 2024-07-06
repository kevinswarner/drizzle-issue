import { relations } from 'drizzle-orm';
import {
  pgTable,
  uniqueIndex,
  text,
  bigserial,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core';
import { table as users } from '../user/repository';
import { table as vendors } from '../vendor/repository';
import { table as missionPartners } from '../mission-partner/repository';

const TABLE_NAME = 'licenses';

export const table = pgTable(
  `${process.env.TABLE_PREFIX || ''}${TABLE_NAME}`,
  {
    // Primary Key
    id: uuid('id').primaryKey().defaultRandom(),

    // Metadata
    idx: bigserial('idx', { mode: 'number' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),

    // Relations
    userId: uuid('user_id').notNull(),
    vendorId: text('vendor_id').notNull(),
    missionPartnerId: uuid('mission_partner_id').notNull(),

    // Data
    assignedAt: timestamp('assigned_at').notNull().defaultNow(),
    lastUsedAt: timestamp('last_used_at'),
    lastUsedTrainingItemTitle: text('last_used_training_item_title')
  },
  (table) => ({
    idxIndex: uniqueIndex(`${TABLE_NAME}_idx_index`).on(table.idx)
  })
);

export const licenseRelations = relations(table, ({ one }) => ({
  user: one(users, {
    fields: [table.userId],
    references: [users.id]
  }),
  vendor: one(vendors, {
    fields: [table.vendorId],
    references: [vendors.id]
  }),
  missionPartner: one(missionPartners, {
    fields: [table.missionPartnerId],
    references: [missionPartners.id]
  })
}));

export type NewLicense = typeof table.$inferInsert;
export type License = typeof table.$inferSelect;
