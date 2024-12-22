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
          shortId: i.string().unique().indexed(),
          creatorId: i.string(),
          creatorEmail: i.string()
      }),
    }
    // links: {
    //     historyCreator: {
    //         forward: { on: "histories", has: "one", label: "creatorId" },
    //         reverse: { on: "$users", has: "many", label: "createdHistories" }
    //     }
    // }
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
