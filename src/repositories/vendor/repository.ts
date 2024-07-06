import {
  pgTable,
  uniqueIndex,
  bigserial,
  timestamp,
  text,
  boolean
} from 'drizzle-orm/pg-core';
import { v4 as uuid } from 'uuid';

const TABLE_NAME = 'vendors';

export const table = pgTable(
  `${process.env.TABLE_PREFIX || ''}${TABLE_NAME}`,
  {
    // Primary Key
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => uuid()),

    // Metadata
    idx: bigserial('idx', { mode: 'number' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),

    // Data
    name: text('name').notNull(),
    isLicensed: boolean('is_licensed').notNull().default(false)
  },
  (table) => ({
    idxIndex: uniqueIndex(`${TABLE_NAME}_idx_index`).on(table.idx)
  })
);

export type NewVendor = typeof table.$inferInsert;
export type Vendor = typeof table.$inferSelect;
