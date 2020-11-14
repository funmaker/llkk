import Tokens from "./tokens.js";

const DEPTH = 4;

class Node {
  children = new Map();
  tokens = new Map();
  
  static deserialize(node) {
    const ret = new Node();
    ret.children = node.children.reduce((acc, [key, val]) => acc.set(key, Node.deserialize(val)), new Map());
    ret.tokens = node.tokens.reduce((acc, [key, val]) => acc.set(key, val), new Map());
    return ret;
  }
  
  serialize() {
    return {
      children: [...this.children.entries()].map(([token, node]) => [token, node.serialize()]),
      tokens: [...this.tokens.entries()],
    };
  }
  
  getChild(token) {
    if(this.children.has(token)) return this.children.get(token);
    
    const child = new Node();
    this.children.set(token, child);
    
    return child;
  }
  
  addToken(token) {
    this.tokens.set(token, (this.tokens.get(token) || 0) + 1);
  }
}

export default class Chain {
  root = new Node();
  
  static generate(data) {
    let chain = new Chain();
    let prevs = [Tokens.terminal];
    
    for(const token of data) {
      let node = chain.root;
      
      for(const prevToken of prevs) {
        node = node.getChild(prevToken);
        node.addToken(token);
      }
      
      prevs.unshift(token);
      prevs = prevs.slice(0, DEPTH);
    }
    
    return chain;
  }
  
  static deserialize(root) {
    const chain = new Chain();
    chain.root = Node.deserialize(root);
    return chain;
  }
  
  serialize() {
    return this.root.serialize();
  }
}
