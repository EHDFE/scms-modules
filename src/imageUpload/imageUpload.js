/**
 * <directive>
 * @description 图片上传
 * @date 2018-02-02
 * @athor 程乐
 * @lastBy
 * @html <div image-upload module-type="'noThumb'" api-url="'/goodstaxiAdmin/imagecs/uploadImage'"" image-urls="imageUrls" d-width="30" d-height="30" d-size="30"></div>
 * @html <div image-upload module-type="'noThumb'" clear-data="clearData" api-url="'goodstaxiAdmin/einvoiceapplicationcs/uploadAttachment'" image-urls="imageUrls" file="true" file-type="['pdf','png','xlsx','docx']"></div>
 * @html <div image-upload module-type="'thumb'" api-url="'/goodstaxiAdmin/imagecs/uploadImage1'" d-num="3" d-width="30" d-height="30" d-size="30" image-urls="imageUrls"></div>
 * example
 */

import angular from 'angular';
import imageShow from '../imageShow/imageShow';
import html from './imageUpload.html';

export default (app, elem, attrs, scope) => {
  imageShow(app, elem, attrs, scope);
  app.directive('imageUpload', [
    '$timeout',
    'G',
    function ($timeout, G) {
      return {
        template: html,
        restrict: 'EA',
        replace: true,
        scope: {
          imageUrls: '=',
          fileData: "=", //非必传，返回：[{dataImg: '', imgName: ''}]
          moduleType: '=',
          dWidth: "@",//非必传，限宽
          dHeight: "@",//非必传，限高
          dSize: "@",//非必传，限文件大小,单位M
          apiUrl: '=',
          dNum: "@",//非必传，限上传个数
          clearData: '=',
          // file:'=',
          fileTypes: "=",//必传，
          exampleText:'@',
          defaultImg:'@',
          params:"@",//非必传, 默认为VOUCHER,
          readonly: "@", //非必传：只读，在查看时用到
          userNameText: "@", // 非必传：水印文字
        },
        controller: function ($scope, $element, $attrs, $timeout) {
          if($scope.moduleType === 'noThumb'){
            $scope.imageArray = [];
          }else{
            $scope.imageArray = [{}];
          }

          if($attrs.fileData) {
            $scope.fileData = [];
          }
          if ($attrs.clearData) {
            $scope.clearData = function(type) {
              if($scope.moduleType === 'noThumb'){
                $scope.imageArray = [];
              }else{
                $scope.imageArray = [{}];
              }
              $scope.imageUrls = [];
              if($attrs.fileData) {
                $scope.fileData = [];
              }
            };
          }
          if($attrs.fileTypes){
            $scope.accept = $scope.fileTypes.map(item=>{
              return '.'+item
            }).join();
          }

          $scope.exampleText = $scope.exampleText || '上传图片清晰可见，不可超过3M，支持jpg、jpeg、png';
          $scope.showClick = ()=>{};
          
          // 预览pdf
          $scope.showPdf = ($event,url)=>{
            if($scope.userNameText){
              window.open(`https://www.hellogil.cn:8012/onlinePreview?watermarkTxt=${$scope.userNameText}&url=`+url.replace('http://','https://'));
            }else{
              window.open(`https://www.hellogil.cn:8012/onlinePreview?url=`+url.replace('http://','https://'));
            }
            // if(window.location.href.indexOf('hl.tf56.com')>-1){
            //   window.open('https://hl.tf56.com/web/contractPreview.html?url='+url.replace('http://','https://'));
            // }else{
            //   window.open('https://hltest.ehuodi.com/web/contractPreview.html?url='+url.replace('http://','https://'));
            // }
          }

          $scope.imageUrls = $scope.imageUrls || [];
          $scope.$watch(
            "imageUrls",
            function(newValue, oldValue) {
              if (($scope.imageArray.length === 0 ? true : !$scope.imageArray[0].dataImg) && newValue && newValue.length) {
                if ($scope.moduleType === 'noThumb') {
                  if ($scope.imageUrls && $scope.imageUrls.length > 0) {
                    // $scope.imageArray = arr;
                    if($scope.imageArray.length === 0){
                      newValue.map((item, index) => {
                        $scope.imageArray[index] = {
                          imgName: item.imgName,
                          dataImg: item.dataImg,
                          status: item.status || "success",
                          type: getIsImage(item.dataImg)
                        };
                      });
                    }
                  } else {
                    newValue.map((item, index) => {
                      $scope.imageUrls[index] = {
                        imgName: item.imgName,
                        dataImg: item.dataImg,
                        status: item.status || "success",
                        type: getIsImage(item.dataImg)
                      };
                    });
                    // arr = $scope.imageArray;
                    // $scope.imageUrls = arr;
                  }
                }else{
                  newValue.map((item, index) => {
                    $scope.imageArray[index] = {
                      imgName: item.imgName,
                      dataImg: item.dataImg,
                      status: item.status || "success",
                      type: getIsImage(item.dataImg)
                    };
                  });
                  if (
                    $scope.imageArray.length < $scope.dNum &&
                    !$scope.readonly
                  ) {
                    $scope.imageArray.push({});
                  }
                }
              }
            },
            true
          );

          
          $scope.remove = (item, index) => {
            pushFile(null, "remove", index);
          };

          const setClearInput = target => {
            target.value = "";
          };

          //绑定file change事件
          $element.on("change", "input", event => {
            const file = event.currentTarget;
            if (!file.files || (file.files && !file.files.length)) {
              return;
            }

            let isValidFileType, isValidSize;
            for(var i = 0; i< file.files.length; i++){
              // 判断文件格式是否符合规格
              isValidFileType = validFileType(
                $scope.fileTypes,
                file.files[i]
              );

              // 判断文件大小是否符合规格
              isValidSize = validSize(file.files[i], $scope.dSize);
              if(!isValidFileType || !isValidSize){
                break;
              }
            }
            // 文件不符合规格，跳出
            if (!isValidFileType || !isValidSize) {
              setClearInput(file);
              return;
            }

            operation(file, 0);
          });

          function operation(file,i){
            if(i < file.files.length){
              var isValidFileType = validFileType($scope.fileTypes, file.files[i]);
            }else{
              setClearInput(file);
              return
            }
            
            pushFile({
              type: isValidFileType || "",
              status: "loading",
              loadingTempo: 10,
              imgName: file.files[i].name
            }, 'add', i, function (index, key) {
              getFileData(file.files[index]).then(function (fileData) {
                if (isValidFileType === "IMG" && ($scope.dWidth || $scope.dHeight)) {
                  validImage(fileData.fileData.currentTarget.result, $scope.dWidth, $scope.dHeight).then(function (isValid) {
                    pushFile({
                      imgData: fileData.fileData.currentTarget.result
                    }, 'edit', key);
                    saveImg(fileData.file, key);
                  }, function (errorMsg) {
                    G.alert(errorMsg, { type: "error" });
                    pushFile({
                      status: "",
                      loadingTempo: ""
                    }, 'edit', key);
                  });
                } else {
                  if (isValidFileType === "IMG") {
                    pushFile({
                      imgData: fileData.fileData.currentTarget.result
                    }, 'edit', key);
                  }
                  saveImg(fileData.file, key);
                }
              });
            });
            if(i < file.files.length){
              setTimeout(()=>{
                var index = i+1;
                operation(file, index)
              },0);
            }else{
              setClearInput(file);
              return
            }
          }

          // 获取文件数据
          const getFileData = file => {
            return new Promise(function(resolve, reject) {
              // const data = new FormData();
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = function(fileData) {
                return resolve({fileData, file});
              };
            });
          };

          //获取是否为图片
          const getIsImage = name => {
            const images = "bmp|jpg|jpeg|png|gif|svg|webp|JPG|JPEG|PNG|GIF|SVG";
            const word = 'doc|docx|DOC|DOCX';
            const excel = 'xls|xlsx|XLS|XLSX';
            const pdf = 'pdf|PDF';
            const ppt = 'ppt|pptx|PPT|PPTX';
            const rar = 'rar|zip|RAR|ZIP';
            const patternB = new RegExp(".(" + images + ")$");
            const patternWord = new RegExp(".(" + word + ")$");
            const patternExcel = new RegExp(".(" + excel + ")$");
            const patternPdf = new RegExp(".(" + pdf + ")$");
            const patternPpt = new RegExp(".(" + ppt + ")$");
            const patternRar = new RegExp(".(" + rar + ")$");
            
            if(name.indexOf('?')>-1){
              name = name.split('?')[0];
            }

            if (patternB.test(name)) {
              return "IMG";
            }
            else if(patternWord.test(name)) {
              return "WORD";
            }
            else if(patternExcel.test(name)) {
              return "EXCEL";
            }
            else if(patternPdf.test(name)) {
              return "PDF";
            }
            else if(patternPpt.test(name)) {
              return "PPT";
            }
            else if(patternRar.test(name)) {
              return "RAR";
            }
            else {
              return "FILE";
            }
          };

          //验证图片格式
          const validFileType = (fileTypes, file) => {
            const ft = {
              doc: ['doc', 'DOC'],
              docx: ['docx', 'DOCX'],
              jpg: ['jpg', 'JPG'],
              jpeg: ['jpeg', 'JPEG'],
              png: ['png', 'PNG'],
              gif: ['gif', 'GIF'],
              svg: ['svg', 'SVG'],
              xls: ['xls', 'XLS'],
              xlsx: ['xlsx', 'XLSX'],
              pdf: ['pdf', 'PDF'],
              ppt: ['ppt', 'PPT'],
              pptx: ['pptx', 'PPTX'],
              rar: ['rar', 'RAR'],
              zip: ['zip', 'ZIP'],
            };
            var types = [];
            for(var i = 0; i < fileTypes.length; i++){
              types = types.concat(ft[fileTypes[i]]);
            }
            // const fileTypesString = fileTypes.join("|");
            const fileTypesString = types.join("|");
            const pattern = new RegExp(".(" + fileTypesString + ")$");
            if (!pattern.test(file.name)) {
              G.alert("请上传格式为" + fileTypes.join("、") + "的文件", {
                type: "error"
              });
            } else {
              return getIsImage(file.name);
            }
          };

          //验证文件大小
          const validSize = (file, dSize) => {
            if (dSize && file.size / 1024 >= parseInt(dSize, 10) * 1024) {
              G.alert(`文件必须小于${dSize}M`, {
                type: "error"
              });
              return false;
            }
            return true;
          };

          //验证图片宽度
          const validImage = (baseData, dWidth, dHeight) => {
            return new Promise(function(resolve, reject) {
              const image = new Image();
              dWidth = parseInt(dWidth, 10);
              dHeight = parseInt(dHeight, 10);
              image.src = baseData;
              image.onload = function() {
                let msg = '';
                if(dWidth) {
                  msg += '宽度等于'+dWidth+'px';
                }
                if(dHeight) {
                  if(dWidth) {
                    msg += ', ';
                  }
                  msg += '高度等于'+dHeight+'px';
                }
                if (dWidth && this.width !== dWidth) {
                  return reject(`请上传${msg}的图片`);
                }
                if (dHeight && this.height !== dHeight) {
                  return reject(`请上传图片${msg}的图片`);
                }
                return resolve(true);
              };
            });
          };

          //发送请求，保存文件到服务器
          const saveImg = function(file, index) {
            let data = new FormData();
            data.append("file", file);
            data.append("attachmenType", $scope.params || "VOUCHER");
            const xhr = new XMLHttpRequest();
            xhr.timeout = 300000;
            xhr.onloadstart = function(evt) {
              pushFile({
                loadingTempo: 1
              }, 'edit', index);
            };
            xhr.upload.onprogress = function(evt) {
              if (evt.lengthComputable) {
                pushFile({
                  loadingTempo: (evt.loaded / evt.total) * 100
                }, 'edit', index);
              } else {
                console.log("无法计算进度信息，总大小是未知的", evt);
              }
            };
            xhr.ontimeout = function(event) {
              // 请求超时！
              pushFile({
                status: "",
                imgData: ""
              }, 'edit', index);
              G.alert("上传超时, 请重试", {
                type: "error"
              });
            };
            xhr.open("post", "/ehuodiGateway/huilianApi/uploader/attachment");
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4) {
                if (xhr.status === 200) {
                  const d = JSON.parse(xhr.responseText);
                  if (d && d.data && d.data[0] && d.data[0].attachmenturl) {
                    pushFile({
                      status: "success",
                      dataImg: d.data[0].attachmenturl
                    }, 'edit', index);
                  } else {
                    pushFile({
                      status: "error",
                      imgData: ""
                    }, 'edit', index);
                    G.alert(d.msg || "上传失败", {
                      type: "error"
                    });
                  }
                } else {
                  pushFile({
                    status: "error",
                    imgData: ""
                  }, 'edit', index);
                  G.alert("上传失败", {
                    type: "error"
                  });
                }
              }
            };
            xhr.send(data);
          };


          const pushFile = (options, eventName, eventIndex, callback) => {
            if (eventName === "remove") {
              $scope.imageArray.splice(eventIndex, 1);
              if ($scope.moduleType === 'thumb' && $scope.imageArray.length < $scope.dNum) {
                let isAdd = false;
                $scope.imageArray.map(item => {
                  if (!item.url) {
                    isAdd = true;
                  }
                });
                if (!isAdd) {
                  $scope.imageArray.push({});
                }
              }
            } else {
              if($scope.moduleType === 'noThumb'){
                var imageArray = $scope.imageArray;
                if (eventName === 'add') {
                  imageArray.push({});
                  var index = imageArray.length - 1;
                  Object.assign(imageArray[index], options);
                  $scope.imageArray = imageArray;
                }else if(eventName === 'edit'){
                  // var index = imageArray.length - 1;
                  Object.assign(imageArray[eventIndex], options);
                  $scope.imageArray = imageArray;
                }
              }else{
                var imageArray = $scope.imageArray;
                var index = imageArray.length - 1;
                Object.assign(imageArray[index], options);
                $scope.imageArray = imageArray;
  
                if (imageArray[index].status === "success") {
                  if (imageArray.length < parseInt($scope.dNum, 10)) {
                    imageArray.push({});
                  }
                }
              }
            }

            const fileData = [], imageUrls = [];
            let isLoading = false;
            $scope.imageArray.map(item => {
              if (item.dataImg) {
                fileData.push({
                  dataImg: item.dataImg,
                  imgName: item.imgName
                })
                if($scope.moduleType === 'noThumb'){
                  imageUrls.push({
                    dataImg: item.dataImg,
                    imgName: item.imgName
                  })
                }else{
                  imageUrls.push(item.dataImg)
                }
              }
              if(item.imgName && !item.dataImg) {
                isLoading = true;
              }
            });

            if($attrs.isLoading) {
              $scope.isLoading = isLoading;
            }

            $timeout(function() {
              if ($attrs.fileData) {
                $scope.fileData = fileData;
              }
              $scope.imageUrls = imageUrls;
            }, 0)

            if(eventName === 'add'){
              callback(eventIndex, $scope.imageArray.length-1 > 0 ? $scope.imageArray.length-1 : 0);
            }
            
          };


          // 下载图片
          $scope.download = ($event,dataImg)=>{
              var $ele = $($event.target).parent();
              var canvas = document.createElement("canvas");
              var name = new Date().getTime();
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.src = dataImg;

              canvas.width = img.width;
              canvas.height = img.height;
              canvas.getContext("2d").drawImage(img, 0, 0);
              var url = canvas.toDataURL();
              $ele.attr("href", url).attr("download", name+".png");
          }
          $scope.noThumbDownload = ($event,item) => {
            var name = item.imgName;
            var $ele = $($event.target);
            if(item.type === "IMG"){
              var img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = ()=>{
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext("2d").drawImage(img, 0, 0);
                var url = canvas.toDataURL();
                // $ele.attr("href", url).attr("download", name);
                var a = document.createElement('a');
                var event = new MouseEvent('click');
                a.download = name;
                a.href = url;
                a.dispatchEvent(event);
              }
              img.src = item.dataImg.replace('http://', 'https://');
            }else{
              var url = item.dataImg.replace('http://', 'https://');
              let nameEnd = item.dataImg.split(".");
              nameEnd = nameEnd[nameEnd.length - 1];
              // $ele
              //   .attr("href", url)
              //   .attr("target", "_blank")
              //   .attr("download", name + "." + nameEnd);
              var a = document.createElement('a');
              var event = new MouseEvent('click');
              a.download = name + "." + nameEnd;
              a.target = '_blank';
              a.href = url;
              a.dispatchEvent(event);
            }
          }
          
          $scope.fileFn = ()=>{
            G.alert(`上传数量已满`,{type:'error'});
          }
        }
      }
    }
  ])
};
