import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as corsLib from "cors";
import * as zlib from "zlib"

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
      const reqData = req.body.data;
      const keyPhrase = req.body.keyPhrase;
      const data = compress(reqData)
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
        // TODO: 型変換を正しくやる
        const saveData = snapshot.data() as unknown as SaveData;
        const data = saveData.data
        const scoreData = /^[A-Za-z0-9+/=]*$/.test(data) ? decompress(data) : data
        res.json({data: scoreData});
      }
      res.end();
    });
  });


  export const compress = (str: string) => {
    const value = zlib.gzipSync(encodeURIComponent(str)).toString("base64")
    return value
  }
  
  export const decompress = (value: string) => {
    const buffer = Buffer.from(value, "base64")
    return decodeURIComponent(zlib.unzipSync(buffer).toString("utf-8"))
  }

  type SaveData = {data: string}
