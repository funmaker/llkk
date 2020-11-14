#!/usr/bin/env node
import readline from "readline";
import Tokenizer from "./lib/tokenizer.js";
import Chain from "./lib/chain.js";
import Model from "./lib/model.js";

async function parseLines(tokenizer) {
  return await new Promise((res, rej) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    })
  
    rl.on('line', line => tokenizer.parseLine(line));
    
    rl.on("close", () => res(tokenizer.data));
    rl.on("SIGINT", () => rej(new Error("Interrupted")));
  });
}

const tokenizer = new Tokenizer();
const data = await parseLines(tokenizer);
const tokens = tokenizer.tokens;
const chain = Chain.generate(data);
const model = new Model(tokens, chain);

console.log(JSON.stringify(model.serialize()));

