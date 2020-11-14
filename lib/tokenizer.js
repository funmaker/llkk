import Tokens from "./tokens.js";

const symbols = "!#$%^&*-=+[]{}\\|;:<>,.?/~`";
const whitespace = /\s/;

export default class Tokenizer {
  data = [];
  tokens = new Tokens();
  
  parseLine(line) {
    line = line.trim();
    if(!line) return;
    
    let inQuote = false;
    let word = "";
  
    while(true) {
      const char = line[0];
      
      const endWord = () => {
        if(word) this.data.push(this.tokens.get(word));
        word = "";
      }
      
      if(whitespace.test(char) || char === undefined) {
        endWord();
      } else if(char === "\"") {
        endWord();
        if(inQuote) this.data.push(Tokens.quoteClose.id);
        else this.data.push(Tokens.quoteOpen.id);
        inQuote = !inQuote;
      } else if(char === "(") {
        endWord();
        this.data.push(Tokens.parenOpen.id);
      } else if(char === ")") {
        endWord();
        this.data.push(Tokens.parenClose.id);
      } else if(symbols.includes(char)) {
        endWord();
        this.data.push(this.tokens.get(char));
      } else {
        word += char;
      }
      
      if(char === undefined) break;
      
      line = line.substr(1);
    }
  
    this.data.push(Tokens.terminal.id);
  }
}
