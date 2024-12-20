// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
    histories: {
        allow: {
            view: "true",
            create: "isOwner",
            update: "isOwner",
            delete: "isOwner",
        },
        bind: ["isOwner", "auth.id != null && auth.id == data.creatorId"],
    },
} satisfies InstantRules;
export default rules;
