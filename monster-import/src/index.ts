#!/usr/bin/env node

import * as admin from "firebase-admin";
import * as csv from "csvtojson";
import * as fs from "fs-extra";
import { Command } from "commander";

const program = new Command();
program
  .version("0.0.1")
  .option("-s, --src <path>", "Source file path")
  .option("-c, --collection <path>", "Collection path in database")
  .option("-i, --id [id]", "Field to use for document ID")
  .parse(process.argv);
const args = program.opts();

var serviceAccount = require("../credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrate() {
  try {
    const colPath = args.collection;
    const file = args.src;

    if (!colPath || !file) return Promise.reject("Missing required parameters");

    const colRef = db.collection(colPath);

    let data;
    if (file.includes(".json")) {
      data = await fs.readJSON(file);
    }

    let count = 0;
    for (const item of data) {
      if (count == 0) {
        var batch = db.batch();
      }

      const id = args.id ? item[args.id].toString() : colRef.doc().id;
      const docRef = colRef.doc(id);

      batch.set(docRef, item);
      count++;

      if (count > 10) {
        await batch.commit();
        count = 0;
      }
    }

    await batch.commit();

    console.log("Firestore updated");
  } catch (error) {
    console.log("Error:", error);
  }
}

migrate();
