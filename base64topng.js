'use strict'

const fs = require("fs");
const path = require("path");
const picTypes = ['.png', '.jpeg', '.jpg'];//过滤需要下载的类型



(function start() {
  //创建文件夹
  createDir();
  //读配置
  let imgData = fs.readFileSync('base64source.json');
  let imgJson = JSON.parse(imgData);
  // console.log(imgJson);
  for (const key in imgJson) {
    if (Object.hasOwnProperty.call(imgJson, key)) {
      const element = imgJson[key];
      // console.log(key);
      let tempArr = key.split("/");
      let fileName = tempArr[tempArr.length - 1];

      if (isImg(fileName)) {
        console.log(fileName);
        saveImg(element, fileName);
      }
    }
  }
})();


function isImg(fileName) {
  for (let i = 0; i < picTypes.length; i++) {
    if (fileName.indexOf(picTypes[i]) != -1) {
      return true;
    }
  }
  return false;
}


function saveImg(imgData, fname) {
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  // var dataBuffer = new Buffer(base64Data, 'base64'); // 解码图片
  var dataBuffer = Buffer.from(base64Data, 'base64'); // 这是另一种写法
  let fileName = `imgAsset/${fname}`;
  fs.writeFile(fileName, dataBuffer, function (err) {
    if (err) {
      console.log("保存失败");
    } else {
      // console.log("保存成功！");
    }
  });

}

function createDir() {
  //删除原先目录
  var dirPath = path.join(__dirname, "imgAsset");
  if (fs.existsSync(dirPath)) {
    // fs.rmdir(dirPath, () => {
    //     console.log("文件夹删除成功");
    // });
    //同步删除目录
    fs.rmdirSync(dirPath, { recursive: true });
  }
  fs.mkdirSync(dirPath, { recursive: true });
}