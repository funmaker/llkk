#!/usr/bin/env node
import * as fs from "fs";
import Model from "./lib/model.js";
import Generator from "./lib/generator.js";

const [,, modelPath] = process.argv;

if(!modelPath) {
  console.log("Usage:")
  console.log(`\tnode generateText.js path/to/model.json`);
  process.exit(-1);
}

console.log("Loading model...");

const modelFile = fs.readFileSync(modelPath, "utf-8");

const model = Model.deserialize(JSON.parse(modelFile));
const generator = new Generator(model);

console.log("Model loaded. Press any key to generate a sentence.");

const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', data => {
    const byteArray = [...data]
    if (byteArray.length > 0 && byteArray[0] === 3) {
      console.log('^C')
      process.exit(1)
    }
    process.stdin.setRawMode(false)
    resolve()
  }))
}

while(true) {
  await keypress();
  
  const sentence = generator.sentence();
  console.log(sentence);
}
