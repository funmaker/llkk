import Tokens from "./tokens.js";

export default class Generator {
  constructor(model) {
    this.chain = model.chain;
    this.tokens = model.tokens;
  }
  
  sentence() {
    const result = [Tokens.terminal.id];
    
    while(true) {
      let node = this.chain.root;
      let pool = [{ id: Tokens.terminal.id, weight: 0 }];
      let lookup = result.slice();
      let depth = 0;
      
      while(lookup.length > 0) {
        const next = lookup.pop();
        if(node.children.has(next)) {
          node = node.children.get(next);
          depth++;
          
          for(const [id, count] of node.tokens.entries()) {
            pool.push({
              id,
              weight: count * Math.pow(10, depth),
            })
          }
        } else break;
      }
      
      pool = pool.sort((a, b) => b.weight - a.weight);
      const weightSum = pool.reduce((acc, val) => acc + val.weight, 0);
      
      let token = pool[0];
      let random = Math.random() * weightSum;
      
      for(let element of pool) {
        if(element.weight > random) {
          token = element;
          break;
        } else {
          random -= element.weight
        }
      }
  
      // console.log(pool.slice(0, 10).map(tk => ({text: this.tokens.dictionary[tk.id].text, ...tk})));
      // console.log(this.tokens.dictionary[token.id].text, weightSum);
      
      result.push(token.id);
      
      if(token.id === Tokens.terminal.id || result.length > 300) break;
    }
    
    result.shift();
    
    let ret = "";
    let nospace = true;
    let link = false;
    let linkSeq = [..."://"].map(c => this.tokens.map.get(c));
    let lastLong = false;
    
    for(const pos in result) {
      if(!result.hasOwnProperty(pos)) continue;
      
      const tokenId = result[pos];
      if(tokenId === Tokens.terminal.id) continue;
      const token = this.tokens.dictionary[tokenId];
  
      if(token.text.length > 1 && lastLong) link = false;
      lastLong = token.text.length > 1;
      
      if(!nospace && !link && (!token.spaces || token.spaces[0])) ret += " ";
      ret += token.text;
      nospace = token.spaces && !token.spaces[1];
      
      if(linkSeq.every((lst, i) => result[+pos + i + 1] === (lst && lst.id))) {
        link = true;
      }
    }
    
    return ret;
  }
}
