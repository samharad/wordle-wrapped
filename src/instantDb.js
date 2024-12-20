import { id, init } from '@instantdb/react';

const APP_ID = "ac79f1c0-73c4-452f-b008-fbf13cc9b02a";

export const db = init({ appId: APP_ID });

export function addHist(hist) {
  // TODO sam: use shorted ID...
  const histId = id();
  db.transact(db.tx.histories[histId].update({ hist }))
    .then(res => console.log(histId, res));
}

