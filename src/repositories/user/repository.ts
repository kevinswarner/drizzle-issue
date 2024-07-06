import { sql } from 'drizzle-orm';
import {
  pgTable,
  pgEnum,
  uniqueIndex,
  bigserial,
  timestamp,
  text,
  integer,
  boolean,
  uuid,
  jsonb
} from 'drizzle-orm/pg-core';

const TABLE_NAME = 'users';

export const userTrainingGroupEnum = pgEnum('user_training_group', [
  'Advana',
  'Army Pilot',
  'CDAO',
  'DEIA',
  'SLD45',
  'Space Force ROTC'
]);

export const userTestRecordEnum = pgEnum('user_test_record', [
  'TEST-RECORD-RANDOM',
  'TEST-RECORD-USER'
]);

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
    email: text('email').notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    phoneNumber: text('phone_number'),
    photoUrl: text('photo_url'),
    bio: text('bio'),
    linkedInUrl: text('linkedin_url'),
    dodId: text('dod_id'),
    userType: text('user_type'),
    branch: text('branch'),
    grade: text('grade'),
    occupationalCode: text('occupational_code'),
    totalTimeTrained: integer('total_time_trained').default(0),
    currentCareer: text('current_career'),
    trainingGroup: userTrainingGroupEnum('training_group'),
    keycloakUserCreatedAt: timestamp('keycloak_user_created_at'),
    onboardingCompletedAt: timestamp('onboarding_completed_at'),
    licenseOnboardingCompletedAt: timestamp('license_onboarding_completed_at'),
    profileUpdatedAt: timestamp('profile_updated_at'),
    trainingPlanCheckCompletedAt: timestamp('training_plan_check_completed_at'),
    lastLoginAt: timestamp('last_login_at'),
    showThirdPartySiteWarning: boolean('show_third_party_site_warning').default(
      true
    ),
    testRecord: userTestRecordEnum('test_record'),
    canAccessFullDu: boolean('can_access_full_du'),
    groups: text('groups')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    skills: text('skills')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    showMarkCompleteModalFor: jsonb('show_mark_complete_modal_for')
      .notNull()
      .default({})
      .$type<{
        trainingPlanId?: string;
        courseId?: string;
      }>(),
    metadata: jsonb('metadata')
      .notNull()
      .default({})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .$type<Record<string, any>>()
  },
  (table) => ({
    idxIndex: uniqueIndex(`${TABLE_NAME}_idx_index`).on(table.idx)
  })
);

export type NewUser = typeof table.$inferInsert;
export type User = typeof table.$inferSelect;
