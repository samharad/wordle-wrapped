import { id, init } from '@instantdb/react';

const APP_ID = "ac79f1c0-73c4-452f-b008-fbf13cc9b02a";

export const db = init({ appId: APP_ID });

export function addHist(hist, userId) {
  const histId = id();
  const shortId = histId.substring(0, 8);
  return db.transact(db.tx.histories[histId].update({
    hist,
    shortId,
    creatorId: userId
  }))
    .then(res => {
      console.log([shortId, res]);
      return [shortId, res];
    });
}

