/**
 * <directive>
 * @description 图片上传
 * @date 2018-02-02
 * @athor 田艳容
 * @lastBy
 * @html <div image-upload module-type="'noThumb'" api-url="'/goodstaxiAdmin/imagecs/uploadImage'"" image-urls="imageUrls" d-width="30" d-height="30" d-size="30"></div>
 * @html <div image-upload module-type="'noThumb'" clear-data="clearData" api-url="'goodstaxiAdmin/einvoiceapplicationcs/uploadAttachment'" image-urls="imageUrls" file="true" file-type="['pdf','png','xlsx','docx']"></div>
 * @html <div image-upload module-type="'thumb'" api-url="'/goodstaxiAdmin/imagecs/uploadImage1'" d-num="3" d-width="30" d-height="30" d-size="30" image-urls="imageUrls"></div>
 * example
 */

import angular from "angular";
import imageShow from "../imageShow/imageShow";
import html from "./ngFileUpload.html";
import css from "./ngFileUpload.less";

export default (app, elem, attrs, scope) => {
  imageShow(app, elem, attrs, scope);
  app.directive("ngFileUpload", [
    "$timeout",
    "G",
    function($timeout, G) {
      return {
        template: html,
        restrict: "EA",
        replace: true,
        scope: {
          imageUrls: "=",//必传,父级传过来的文件url、或组件中上传的文件的url:['http://****.png', ...]
          fileData: "=", //非必传，返回：[{url: '', name: ''}]
          dWidth: "@",//非必传，限宽
          dHeight: "@",//非必传，限高
          dSize: "@",//非必传，限文件大小,单位M
          dNum: "@",//非必传，限上传个数
          clearData: "=", //可选，清空上传操作的数据
          fileTypes: "=",//必传，
          readonly: "@", //非必传：只读，在查看时用到
          attachmenType: "@"//非必传, 默认为VOUCHER
        },
        controller: function($scope, $element, $attrs, $timeout) {
          //image数组,包含字段：
          //type: 类型 IMG
          //status: 初始时为空，loading | success
          //imgData: base64 data
          //url: 服务器上传成功后返回的url
          //loadingTempo: 上传进度
          //name: 文件原始名称
          $scope.imageArray = [{}];
          if($attrs.fileData) {
            $scope.fileData = [];
          }

          if ($attrs.clearData) {
            $scope.clearData = function() {
              $scope.imageArray = [{}];
              $scope.imageUrls = [];
              if($attrs.fileData) {
                $scope.fileData = [];
              }
            };
          }

          //
          $scope.imageUrls = $scope.imageUrls || [];
          $scope.$watch(
            "imageUrls",
            function(newValue, oldValue) {
              if (!$scope.imageArray[0].url && newValue && newValue.length) {
                newValue.map((item, index) => {
                  $scope.imageArray[index] = {
                    url: item,
                    status: "success",
                    type: getIsImage(item)
                  };
                });
                if (
                  $scope.imageArray.length < $scope.dNum &&
                  !$scope.readonly
                ) {
                  $scope.imageArray.push({});
                }
              }
            },
            true
          );

          //
          $scope.showClick = () => {};

          //发送请求，保存文件到服务器
          const saveImg = function(file) {
            let data = new FormData();
            data.append("file", file);
            data.append("attachmenType", $scope.attachmenType || "VOUCHER");
            const xhr = new XMLHttpRequest();
            xhr.timeout = 30000;
            xhr.onloadstart = function(evt) {
              pushFile({
                loadingTempo: 1
              });
            };
            xhr.upload.onprogress = function(evt) {
              if (evt.lengthComputable) {
                pushFile({
                  loadingTempo: (evt.loaded / evt.total) * 100
                });
              } else {
                console.log("无法计算进度信息，总大小是未知的", evt);
              }
            };
            xhr.ontimeout = function(event) {
              // 请求超时！
              pushFile({
                status: "",
                imgData: ""
              });
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
                      url: d.data[0].attachmenturl
                    });
                  } else {
                    pushFile({
                      status: "",
                      imgData: ""
                    });
                    G.alert(d.msg || "上传失败", {
                      type: "error"
                    });
                  }
                } else {
                  pushFile({
                    status: "",
                    imgData: ""
                  });
                  G.alert("上传失败", {
                    type: "error"
                  });
                }
              }
            };
            xhr.send(data);
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

          // 获取文件数据
          const getFileData = file => {
            return new Promise(function(resolve, reject) {
              const data = new FormData();
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = function(fileData) {
                return resolve(fileData);
              };
            });
          };

          //获取是否为图片
          const getIsImage = name => {
            const images = "bmp|jpg|jpeg|png|gif|svg|webp";
            const patternB = new RegExp(".(" + images + ")$");
            if (patternB.test(name)) {
              return "IMG";
            }
            return "file";
          };

          //验证图片格式
          const validFileType = (fileTypes, file) => {
            const fileTypesString = fileTypes.join("|");
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

          const pushFile = (options, eventName, eventIndex) => {
            if (eventName === "remove") {
              
              $scope.imageArray.splice(eventIndex, 1);
              let isAdd = false;
              $scope.imageArray.map(item => {
                if (!item.url) {
                  isAdd = true;
                }
              });
              if (!isAdd) {
                $scope.imageArray.push({});
              }
            } else {
              const imageArray = $scope.imageArray;
              const index = imageArray.length - 1;
              Object.assign(imageArray[index], options);
              $scope.imageArray = imageArray;

              if (imageArray[index].status === "success") {
                if (imageArray.length < parseInt($scope.dNum, 10)) {
                  imageArray.push({});
                }
              }
              $scope.$apply();
            }

            const fileData = [], imageUrls = [];
            $scope.imageArray.map(item => {
              if (item.url) {
                fileData.push({
                  url: item.url,
                  name: item.name
                })
                imageUrls.push(item.url)
              }
            });
            $timeout(function() {
              if ($attrs.fileData) {
                $scope.fileData = fileData;
              }
              $scope.imageUrls = imageUrls;
            }, 0)
            
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

            const isValidFileType = validFileType(
              $scope.fileTypes,
              file.files[0]
            );

            if (!isValidFileType) {
              setClearInput(file);
              return;
            }
            const isValidSize = validSize(file.files[0], $scope.dSize);
            if (!isValidSize) {
              setClearInput(file);
              return;
            }
            pushFile({
              type: isValidFileType || "",
              status: "loading",
              loadingTempo: 10,
              name: file.files[0].name
            });

            getFileData(file.files[0]).then(fileData => {
              if (
                isValidFileType === "IMG" &&
                ($scope.dWidth || $scope.dHeight)
              ) {
                validImage(
                  fileData.currentTarget.result,
                  $scope.dWidth,
                  $scope.dHeight
                ).then(
                  isValid => {
                    pushFile({
                      imgData: fileData.currentTarget.result
                    });
                    saveImg(file.files[0]);
                  },
                  errorMsg => {
                    G.alert(errorMsg, { type: "error" });
                    pushFile({
                      status: "",
                      loadingTempo: ""
                    });
                  }
                );
              } else {
                if (isValidFileType === "IMG") {
                  pushFile({
                    imgData: fileData.currentTarget.result
                  });
                }
                saveImg(file.files[0]);
              }
            });
          });

          //删除事件
          $scope.remove = (item, index) => {
            pushFile(null, "remove", index);
          };

          // 下载图片
          $scope.download = ($event, item) => {
            var name = new Date().getTime();
            var $ele = $($event.currentTarget);
            if (item.type === "IMG" && item.imgData) {
              var canvas = document.createElement("canvas");
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.src = item.imgData || item.url;
              canvas.width = img.width;
              canvas.height = img.height;
              canvas.getContext("2d").drawImage(img, 0, 0);
              var url = canvas.toDataURL();
              $ele.attr("href", url).attr("download", name + ".png");
            } else if (item.url) {
              var url = item.url;
              let nameEnd = item.url.split(".");
              nameEnd = nameEnd[nameEnd.length - 1];
              $ele
                .attr("href", url)
                .attr("target", "_blank")
                .attr("download", name + "." + nameEnd);
            }
          };
        }
      };
    }
  ]);
};
