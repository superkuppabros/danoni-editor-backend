import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as corsLib from "cors";

// The Firebase Admin SDK to access Firestore.
admin.initializeApp();

const allowedOrigin = "https://superkuppabros.github.io/";
const cors = corsLib({origin: true});

export const addSaveData =
  functions.region("asia-northeast1").https.onRequest((req, res) => {
    cors(req, res, async () => {
      res.set("Access-Control-Allow-Headers", "*");
      res.set("Access-Control-Allow-Origin", allowedOrigin);
      res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST");
      const data = req.body.data;
      const keyPhrase = req.body.keyPhrase;
      await admin.firestore().collection("savedata")
          .doc(keyPhrase).set({data});
      res.status(200);
      res.end();
    });
  });

export const getSaveData =
  functions.region("asia-northeast1").https.onRequest(async (req, res) => {
    cors(req, res, async () => {
      res.set("Access-Control-Allow-Headers", "*");
      res.set("Access-Control-Allow-Origin", allowedOrigin);
      res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST");
      const keyPhrase = req.query.keyPhrase;
      if (typeof keyPhrase === "string") {
        const snapshot = await admin.firestore().collection("savedata")
            .doc(keyPhrase).get();
        const saveData = snapshot.data();
        res.json(saveData);
      }
      res.end();
    });
  });
