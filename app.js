"use strict";
const fs = require("fs");
const loader=require("./gameLoader");
const fileContents = fs.readFileSync("test.har");
const jsonContents = JSON.parse(fileContents);
console.log(`Entries: ${jsonContents.log.entries.length}`);
const urls = jsonContents.log.entries.map(entry => entry.request.url);
console.log(`URLs: ${urls.length}`);
// const urlLines = urls.join("\n");
// fs.writeFileSync("file.txt", urlLines);

urls.forEach(urlStr => {
    loader.downLoadFile(urlStr);
});



