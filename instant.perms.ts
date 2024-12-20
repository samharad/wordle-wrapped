// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
    histories: {
        allow: {
            view: "true",
            create: "true",
            update: "false",
            delete: "false",
        },
        bind: ["isOwner", "auth.id != null && auth.id == data.creatorId"],
    },
} satisfies InstantRules;
export default rules;
