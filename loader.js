//文件下载
var fs = require("fs");
var path = require("path");
var request = require("request");
var co = require("co");

//创建文件夹目录
var dirPath = path.join(__dirname, "file");
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
    console.log("文件夹创建成功");
} else {
    console.log("文件夹已存在");
}

function* downFile(url, fileName) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let stream = fs.createWriteStream(path.join(dirPath, fileName));
                request(url).pipe(stream).on("close", function (err) {
                    resolve("下载成功");
                });
            } else {
                if (error) {
                    reject(error);
                } else {
                    reject(new Error("下载失败，返回状态码不是200，状态码：" + response.statusCode));
                }
            }
        });
    });

}

co(function* () {
    //循环多线程下载
    for (let i = 50; i < 80; i++) {
        // let fileName = "out" + intToString(i, 3) + ".ts";
        // let url = "https://xxx.sdhdbd1.com/cb9/sd/gc/g1/DBC3A6CE/SD/" + fileName;
        let fileName = "/media_b500000_" + i + ".ts";
        let url = "http://sjvodcdn.cbg.cn:1935/app_1/_definst_/smil:getnew/sobeyget/vod/2018/04/19/9bdcd66a74954c84a50375c608c0e692/1524106287_7835.smil" + fileName;

        try {
            let m = Math.floor(i / 50).toString();//50个文件一个文件夹
            let cDir = path.join(dirPath, m);
            if (!fs.existsSync(cDir)) {
                fs.mkdirSync(cDir);
                console.log("文件夹[" + cDir + "]创建成功");
            }
            yield downFile(url, path.join(m, fileName));
            console.log("下载成功" + fileName);
        } catch (err) {
            console.log(err);
            break;
        }
    }

});

//整数转字符串，不足的位数用0补齐
function intToString(num, len) {
    let str = num.toString();
    while (str.length < len) {
        str = "0" + str;
    }
    return str;
}