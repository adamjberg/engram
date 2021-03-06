import express from "express";
import { ObjectId } from "../Database.js";
import { UnauthorizedError } from "../middleware/AuthMiddleware.js";
import { AuthAPIKeyMiddleware } from "../middleware/AuthAPIKeyMiddleware.js";
import { AuthRequiredMiddleware } from "../middleware/AuthRequiredMiddleware.js";

export function initializeZapierRouter() {
  const router = express.Router();
  router.use(AuthAPIKeyMiddleware);
  router.use(AuthRequiredMiddleware);

  router.get("/notes", async function (req, res) {
    const { user, db } = req;
    const notes = await db
      .collection("notes")
      .find({
        user: ObjectId(user),
      })
      .sort({ _id: -1 })
      .limit(5)
      .toArray();
    return res.json(notes);
  });

  router.post("/notes", async function (req, res) {
    const { user, db } = req;

    const insertOpResult = await db
      .collection("notes")
      .insertOne({ user: ObjectId(user), body: req.body.body });

    const newNote = await db.collection("notes").findOne({
      _id: insertOpResult.insertedId,
    });

    res.json(newNote);
  });

  router.post("/hooks/subscribe", async function (req, res) {
    const { user, db, body } = req;
    const { hookUrl, type } = body;

    await db.collection("zapier-hooks").insertOne({
      user: ObjectId(user),
      hookUrl,
      type,
    });

    res.json({});
  });

  router.post("/hooks/unsubscribe", async function (req, res) {
    const { user, db, body } = req;
    const { hookUrl } = body;

    const ZapierHooks = db.collection("zapier-hooks");

    const hook = await ZapierHooks.findOne({
      hookUrl,
    });

    if (!hook || String(hook.user) !== String(user)) {
      throw new UnauthorizedError();
    }

    await ZapierHooks.deleteOne({
      _id: hook._id,
    });

    res.json({});
  });

  return router;
}
