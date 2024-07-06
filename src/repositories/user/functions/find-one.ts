import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { database } from '@/database';

const schema = z.object({
  id: z.string().uuid()
});

type Options = z.infer<typeof schema>;

export async function findOne(options: Options) {
  try {
    const parsed = schema.parse(options);

    const db = database();

    return db.query.users.findFirst({
      where: (table, { eq }) => eq(table.id, parsed.id)
    });
  } catch (err) {
    if (err instanceof z.ZodError) throw fromZodError(err);
    throw err;
  }
}
