import { z } from "zod";

export function parseRows<T>(
  rows: unknown[],
  schema: z.ZodType<T>,
  description: string,
): T[] {
  return rows.map((row, index) => {
    const result = schema.safeParse(row);

    if (!result.success) {
      throw new Error(
        [
          `Invalid ${description} at Excel row ${index + 2}:`,
          z.prettifyError(result.error),
        ].join("\n"),
      );
    }

    return result.data;
  });
}
