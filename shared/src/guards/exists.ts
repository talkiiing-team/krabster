export const exists = <T>(nullable: T | null | undefined): nullable is T =>
  nullable !== null && nullable !== undefined
