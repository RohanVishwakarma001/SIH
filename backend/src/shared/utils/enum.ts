/** Converts a Prisma enum value (e.g. "READY_FOR_REVIEW") to the frontend's kebab-case convention ("ready-for-review"). */
export function enumToKebab(value: string): string {
  return value.toLowerCase().replace(/_/g, '-');
}
