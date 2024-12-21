import { i } from "@instantdb/react";

const _schema = i.schema({
  // We inferred 1 attribute!
  // Take a look at this schema, and if everything looks good,
  // run `push schema` again to enforce the types.
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    histories: i.entity({
      hist: i.json(),
      shortId: i.string().unique().indexed()
    }),
  }
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
