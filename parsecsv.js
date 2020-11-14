#!/usr/bin/env node
import csv from "csv-parser";

const userid = process.argv[2];

process.stdin
       .pipe(csv({ headers: ["userid", "usertag", "date", "text", "embed", "reactions"] }))
       .on("data", row => {
         if(userid && row.userid !== userid) return;
         
         let text = row.text;
         text = text.replace(/\s+/g, " ");
         
         console.log(text);
       });
