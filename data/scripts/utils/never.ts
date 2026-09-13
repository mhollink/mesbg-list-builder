/**
 * Keeps switches exhaustive when their source fields are Zod enums / unions.
 *
 * If your current workbook schema still types these fields as plain strings,
 * change them to Zod enums so TypeScript can verify the switches exhaustively.
 */
export function assertNever(value: never, message: string): never {
  throw new Error(`${message}: ${String(value)}`);
}
