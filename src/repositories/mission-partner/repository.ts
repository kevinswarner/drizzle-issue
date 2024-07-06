import { relations } from 'drizzle-orm';
import {
  pgTable,
  uniqueIndex,
  index,
  text,
  bigserial,
  timestamp,
  boolean,
  uuid,
  jsonb,
  pgEnum
} from 'drizzle-orm/pg-core';
import { table as provisionedLicenses } from '../provisioned-license/repository';

const TABLE_NAME = 'mission_partners';

export const missionPartnerSectionTypeEnum = pgEnum(
  'mission_partner_section_type',
  ['FIELD_COMMAND', 'DELTA', 'UNIT_OR_SQUADRON', 'OTHER']
);

export const table = pgTable(
  `${process.env.TABLE_PREFIX || ''}${TABLE_NAME}`,
  {
    // Primary Key
    id: uuid('id').primaryKey().defaultRandom(),

    // Metadata
    idx: bigserial('idx', { mode: 'number' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),

    // Data
    name: text('name').notNull(),
    description: text('description'),
    slug: text('slug'),
    affiliateId: text('affiliate_id'),
    sectionType: missionPartnerSectionTypeEnum('section_type'),
    logoUrl: text('logo_url'),
    accessCode: text('access_code'),
    customTrainingEnabled: boolean('custom_training_enabled').default(false),
    enabledReports: jsonb('enabled_reports')
      .notNull()
      .$type<
        {
          id: string;
          name: string;
          description: string;
        }[]
      >()
      .default([])
  },
  (table) => ({
    idxIndex: uniqueIndex(`${TABLE_NAME}_idx_index`).on(table.idx),
    nameIndex: index(`${TABLE_NAME}_name_index`).on(table.name),
    slugIndex: index(`${TABLE_NAME}_slug_index`).on(table.slug)
  })
);

export const missionPartnerRelations = relations(table, ({ many }) => ({
  provisionedLicenses: many(provisionedLicenses)
}));

export type NewMissionPartner = typeof table.$inferInsert;
export type MissionPartner = typeof table.$inferSelect;

export const OPENSEARCH_INDEX_NAME = 'mission-partners';
