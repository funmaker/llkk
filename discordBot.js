#!/usr/bin/env node
import * as fs from "fs";
import { Webhook } from "discord-webhook-node";
import Model from "./lib/model.js";
import Generator from "./lib/generator.js";

const [,, modelPath, webhookUrl] = process.argv;

if(!modelPath || !webhookUrl) {
  console.log("Usage:")
  console.log(`\tnode generateText.js path/to/model.json webhookUrl`);
  process.exit(-1);
}

console.log("Loading model...");

const modelFile = fs.readFileSync(modelPath, "utf-8");

const model = Model.deserialize(JSON.parse(modelFile));
const generator = new Generator(model);

console.log("Model loaded.");

const hook = new Webhook(webhookUrl);

while(true) {
  const target = Math.floor(Math.random() * 50 + 20);
  
  console.log(`Generating ${target} messages...`);
  for(let i = 0; i < target; i++) {
    const sentence = generator.sentence();
    await hook.send(sentence);
    
    await new Promise(res => setTimeout(res, sentence.length * (Math.random() * 100 + 100)))
  }
  
  const sleep = Math.floor(Math.random() * 240 + 180);
  console.log(`Done. Sleeping for ${sleep} minutes.`);

  await new Promise(res => setTimeout(res, sleep * 60 * 1000));
}
