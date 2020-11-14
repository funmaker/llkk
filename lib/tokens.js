
const termToken = {
  text: "\n",
  special: "terminal",
  spaces: [false, false],
};

const quoteOpen = {
  text: "\"",
  special: "quoteOpen",
  spaces: [true, false],
};

const quoteClose = {
  text: "\"",
  special: "quoteClose",
  spaces: [false, true],
};

const parenOpen = {
  text: "(",
  special: "parenOpen",
  spaces: [true, false],
};

const parenClose = {
  text: ")",
  special: "parenClose",
  spaces: [false, true],
};

const spacesRules = [
  [".,?!]}$%", [false, true]],
  ["-_+=/\\", [false, false]],
]

export default class Tokens {
  dictionary = [];
  map = new Map();
  
  constructor() {
    this.addSpecialToken(termToken);
    this.addSpecialToken(quoteOpen);
    this.addSpecialToken(quoteClose);
    this.addSpecialToken(parenOpen);
    this.addSpecialToken(parenClose);
  }
  
  static deserialize(tokens) {
    const ret = new Tokens();
    ret.dictionary.push(...tokens.dictionary.slice(ret.dictionary.length));
    ret.map = tokens.map.reduce((acc, [key, val]) => acc.set(key, ret.dictionary[val.id]), new Map());
    return ret;
  }
  
  serialize() {
    return {
      dictionary: this.dictionary,
      map: [...this.map.entries()],
    };
  }
  
  addSpecialToken(token) {
    token.id = this.dictionary.length;
    token.count = 0;
    this.dictionary.push(token);
  }
  
  get(text) {
    let token = this.map.get(text);
    
    if(!token) {
      let spacesRule = spacesRules.find(([chars]) => chars.includes(text))
      
      token = {
        text,
        id: this.dictionary.length,
        count: 0,
        spaces: spacesRule && spacesRule[1],
      }
      
      this.dictionary.push(token);
      this.map.set(text, token);
    }
    
    token.count++;
    
    return token.id;
  }
  
  *[Symbol.iterator]() {
    yield* this.tokens;
  }
}

Tokens.terminal = termToken;
Tokens.quoteOpen = quoteOpen;
Tokens.quoteClose = quoteClose;
Tokens.parenOpen = parenOpen;
Tokens.parenClose = parenClose;
