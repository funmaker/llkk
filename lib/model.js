import Tokens from "./tokens.js";
import Chain from "./chain.js";

export default class Model {
  constructor(tokens, chain) {
    this.tokens = tokens;
    this.chain = chain;
  }
  
  static deserialize(model) {
    return new Model(Tokens.deserialize(model.tokens), Chain.deserialize(model.chain));
  }
  
  serialize() {
    return {
      tokens: this.tokens.serialize(),
      chain: this.chain.serialize(),
    };
  }
}
