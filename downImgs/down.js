"use strict";
const fs = require("fs");
const path = require("path");
const request = require("request");

const IMAGE_URL = "https://onimg.leshu.com/wxgame/zhaocha/images/";

console.log(__dirname);
let imgData = fs.readFileSync('./config.json');
let imgJson = JSON.parse(imgData);

// console.log(imgJson.length);
let allImgUrls = [];
for (const key in imgJson) {
    const element = imgJson[key];
    allImgUrls = allImgUrls.concat(element["images"]);
    allImgUrls = allImgUrls.concat(element["images2"]);
}

// console.log(allImgUrls);

var dirPath = path.join(__dirname, "allImgs");
if (fs.existsSync(dirPath)) {
    //同步删除目录
    fs.rmdirSync(dirPath, { recursive: true });
}

fs.mkdirSync(dirPath, { recursive: true });

const loopDownload = async () => {
    for (let i = 0; i < allImgUrls.length; i++) {
        let item = allImgUrls.shift();
        let res = await downImg(item);
        console.log(res);
    }
}

loopDownload();

// allImgUrls.forEach(async element => {
//     let res = await downImg(element);
//     console.log(res);
// });




function downImg(fileName) {
    return new Promise((resolve, reject) => {
        let url = `${IMAGE_URL}${fileName}`;
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let allName = path.join(__dirname, "/allImgs/", fileName);
                // console.log(allName);
                let stream = fs.createWriteStream(allName);
                request(url).pipe(stream).on("close", function (err) {
                    resolve("文件[" + fileName + "]下载完毕");
                    // console.log("文件[" + fileName + "]下载完毕");
                });
            }
            else {
                // console.log("文件请求失败:   " + url);
                if (error) {
                    reject("文件请求失败:   " + url);
                } else {
                    reject(new Error("下载失败，返回状态码不是200，状态码：" + response.statusCode));
                }
            }
        });

    });

}
let retryInfo = { };
async function reLoad(url) {
    let tryTimes = retryInfo[url] || 0;
    if (tryTimes >= 3) {
        return;
    }
    retryInfo["url"] = tryTimes++;

    let res = await downImg(url);
    console.log("重新加载====>"+res);
}