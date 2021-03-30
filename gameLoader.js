//文件下载
var fs = require("fs");
var path = require("path");
var request = require("request");

//删除原先目录
var dirPath = path.join(__dirname, "gameApp");
if (fs.existsSync(dirPath)) {
    // fs.rmdir(dirPath, () => {
    //     console.log("文件夹删除成功");
    // });
    //同步删除目录
    fs.rmdirSync(dirPath, { recursive: true });
}


function downLoadFile(url) {
    if (url.indexOf(";") > -1) {
        console.log(url);
        return;
    }
    let tempIndex = url.indexOf("?");
    if (tempIndex > -1) {
        let resUrl = url.slice(0, tempIndex);
        writeFile(resUrl);
        // console.log(resUrl);
        return;
    }
    writeFile(url);
}

function writeFile(url) {
    let fileData = url.split("/");
    let fileName = fileData[fileData.length - 1];
    let dirName = "gameApp/" + fileData.slice(3, fileData.length - 1).join("/");
    let tempDirPath = path.join(__dirname, dirName);
    createDir(tempDirPath);
    if (fileName && fileName.indexOf('.') > -1) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let allName = path.join(tempDirPath, fileName);
                // console.log(allName);
                let stream = fs.createWriteStream(allName);
                request(url).pipe(stream).on("close", function (err) {
                    // console.log("文件[" + fileName + "]下载完毕");
                });
            }
            else {
                console.log("文件请求失败:   " + url);
            }
        });

    }
}

function createDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        // console.log("文件夹创建成功");
    } else {
        // console.log("文件夹已存在");
    }
}

exports.downLoadFile = downLoadFile;