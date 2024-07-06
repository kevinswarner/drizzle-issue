import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { database } from '@/database';

const schema = z.object({
  missionPartnerId: z.string().uuid(),
  vendorId: z.string()
});

type Options = z.infer<typeof schema>;

export async function findOne(options: Options) {
  try {
    const parsed = schema.parse(options);

    const db = database();

    return db.query.provisionedLicenses.findFirst({
      where: (table, { eq, and }) =>
        and(
          eq(table.missionPartnerId, parsed.missionPartnerId),
          eq(table.vendorId, parsed.vendorId)
        )
    });
  } catch (err) {
    if (err instanceof z.ZodError) throw fromZodError(err);
    throw err;
  }
}
