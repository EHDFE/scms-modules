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

          $scope.exampleText = $scope.exampleText || '上传图片清晰可见，不可超过3M，支持jpg、jpeg、png';
          $scope.showClick = ()=>{};
          
          // 预览pdf
          $scope.showPdf = ($event,url)=>{
            if(window.location.href.indexOf('hl.tf56.com')>-1){
              window.open('https://hl.tf56.com/web/contractPreview.html?url='+url.replace('http://','https://'));
            }else{
              window.open('https://hltest.ehuodi.com/web/contractPreview.html?url='+url.replace('http://','https://'));
            }
          }

          $scope.imageUrls = $scope.imageUrls || [];
          $scope.$watch(
            "imageUrls",
            function(newValue, oldValue) {
              if (($scope.imageArray.length === 0 ? true : !$scope.imageArray[0].dataImg) && newValue && newValue.length) {

                if ($scope.moduleType === 'noThumb') {
                  if ($scope.imageUrls && $scope.imageUrls.length > 0) {
                    // $scope.imageArray = arr;
                    newValue.map((item, index) => {
                      $scope.imageArray[index] = {
                        imgName: item.imgName,
                        dataImg: item.dataImg,
                        status: item.status || "success",
                        type: getIsImage(item.dataImg)
                      };
                    });
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

          // $scope.type = 1;
          // $scope.init = ()=>{
          //   $scope.imageArray = [];
          //   $scope.imageUrls = $scope.imageUrls || [];
          //   var arr = $scope.imageUrls.map(item=>{
          //     return item;
          //   });
          //   if ($scope.moduleType === 'noThumb') {
          //     if ($scope.imageUrls && $scope.imageUrls.length > 0) {
          //       $scope.imageArray = arr;
          //     } else {
          //       arr = $scope.imageArray;
          //       $scope.imageUrls = arr;
          //     }
          //   } else if ($scope.imageUrls && $scope.imageUrls.length) {
          //     $scope.imageArray = arr;
          //     if($scope.dNum){
          //       if($scope.imageArray.length < $scope.dNum){
          //         $scope.imageArray.push({
          //           uploadType: {
          //             succeed: false,
          //             error: false,
          //             loading: false,
          //           },
          //         });
          //       }
          //     }else{
          //       $scope.imageArray.push({
          //         uploadType: {
          //           succeed: false,
          //           error: false,
          //           loading: false,
          //         },
          //       });
          //     }
          //   } else {
          //     $scope.imageArray.push({
          //       uploadType: {
          //         succeed: false,
          //         error: false,
          //         loading: false,
          //       },
          //     });
          //     $scope.imageUrls = [];
          //   }
          // }
          // $scope.init();
          
          $scope.remove = (item, index) => {
            pushFile(null, "remove", index);
            // $scope.imageArray.splice(index, 1);
            // $scope.selectImg();
            // if ($scope.moduleType === 'thumb' && $scope.imageArray.length < $scope.dNum) {
            //   let num = 0;
            //   for (let i = 0; i < $scope.imageArray.length; i++) {
            //     if ($scope.imageArray[i].uploadType.succeed || $scope.imageArray[i].uploadType.error || $scope.imageArray[i].uploadType.loading) {
            //       num++;
            //     } else {
            //       break;
            //     }
            //   };
            //   if (num === $scope.dNum - 1) {
            //     $scope.imageArray.push({
            //       uploadType: {
            //         succeed: false,
            //         error: false,
            //         loading: false,
            //       },
            //     });
            //   }
            // }
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
              imgName: file.files[0].name
            },'add');

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
              event.target.value="";
            });
          });

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
            const word = 'doc|docx';
            const excel = 'xls|xlsx';
            const pdf = 'pdf';
            const patternB = new RegExp(".(" + images + ")$");
            const patternWord = new RegExp(".(" + word + ")$");
            const patternExcel = new RegExp(".(" + excel + ")$");
            const patternPdf = new RegExp(".(" + pdf + ")$");
            
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
            else {
              return "FILE";
            }
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

          // const $file = $element.find('input');
          // $element.on('change', 'input', (event) => {
          //   const file = event.currentTarget;
          //   if (!file.files || (file.files && !file.files.length)) {
          //     return;
          //   }
          //   if($scope.file){
          //     var text = $scope.fileType.join('|');
          //     var alertText = $scope.fileType.join('/');
          //   }else{
          //     var text = 'jpg|jpeg|png|bmp';
          //     var alertText = 'JPG/JPEG/PNG/BMP';
          //   }
          //   var pattern = new RegExp('.('+text+')$');
          //   angular.forEach(file.files, (item, index) => {
          //     if (!pattern.test(item.name)) {
          //       G.alert('请上传格式为'+alertText+'格式的文件', { type: 'error' });
          //     } else {
          //       verify(item);
          //     }
          //   });
          //   $(event.currentTarget).val('');
          // });


          //发送请求，保存文件到服务器
          const saveImg = function(file) {
            let data = new FormData();
            data.append("file", file);
            data.append("attachmenType", $scope.params || "VOUCHER");
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
                      dataImg: d.data[0].attachmenturl
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

          // 验证
          // function verify(file) {
          //   const data = new FormData();
          //   const reader = new FileReader();
          //   reader.readAsDataURL(file);
          //   reader.onload = function (theFile) {
          //     if(!$scope.file){
          //       const image = new Image();
          //       image.src = theFile.target.result;
          //       image.onload = function () {
          //         if ($scope.dWidth && this.width !== $scope.dWidth) {
          //           G.alert(`图片宽度不等于${$scope.dWidth}px`, {
          //             type: 'error',
          //           });
          //           return;
          //         }
          //         if ($scope.dHeight && this.height !== $scope.dHeight) {
          //           G.alert(`图片高度不等于${$scope.dHeight}px`, {
          //             type: 'error',
          //           });
          //           return;
          //         }
          //         if ($scope.dSize && file.size / 1024 > parseInt($scope.dSize, 10)) {
          //           G.alert(`图片大于${$scope.dSize}KB`, {
          //             type: 'error',
          //           });
          //           return;
          //         }
          //         if ($scope.moduleType === 'noThumb') {
          //           $scope.imageArray.push({
          //             imgName: file.name,
          //             uploadType: {
          //               succeed: false,
          //               error: false,
          //               loading: true,
          //             },
          //           });
          //           const index = $scope.imageArray.length - 1;
          //           $scope.$apply();
          //           data.append('file', file);
          //           if($scope.params){
          //             for(var key in $scope.params) {
          //               data.append(key, $scope.params[key]);
          //             }
          //           }
          //           uploadImage(data, $scope.imageArray[index]);
          //         } else {
          //           const reader = new FileReader();
          //           reader.onload = function (e) {
          //             // console.log('成功读取文件路径');
          //             const index = $scope.imageArray.length - 1;
          //             if ($scope.moduleType === 'thumb') {
          //               $scope.imageArray[index].dataImg = e.target.result;
          //             }
          //             $scope.$apply();
          //             data.append('file', file);
          //             if($scope.params){
          //               for(var key in $scope.params) {
          //                 data.append(key, $scope.params[key]);
          //               }
          //             }
          //             uploadImage(data, $scope.imageArray[index]);
          //             if ($scope.moduleType === 'thumb' && $scope.imageArray.length < $scope.dNum) {
          //               $scope.imageArray.push({
          //                 uploadType: {
          //                   succeed: false,
          //                   error: false,
          //                   loading: false,
          //                 },
          //               });
          //             }
          //           };
          //           reader.readAsDataURL(file);
          //         }
          //       };
          //     }else{
          //         if ($scope.dSize && file.size / 1024 > parseInt($scope.dSize, 10)) {
          //           G.alert(`文件大于${$scope.dSize}KB`, {
          //             type: 'error',
          //           });
          //           return;
          //         }
          //         $scope.imageArray.push({
          //           imgName: file.name,
          //           uploadType: {
          //             succeed: false,
          //             error: false,
          //             loading: true,
          //           },
          //         });
          //         const index = $scope.imageArray.length - 1;
          //         $scope.$apply();
          //         data.append('file', file);
          //         if($scope.params){
          //           for(var key in $scope.params) {
          //             data.append(key, $scope.params[key]);
          //           }
          //         }
          //         uploadImage(data, $scope.imageArray[index]);
          //     }
          //   };
          // }
          // // 请求
          // function uploadImage(data, item) {
          //   const xhr = new XMLHttpRequest();
          //   xhr.timeout = 30000;
          //   xhr.onloadstart = function (evt) {
          //     // console.log('开始')
          //     if ($scope.moduleType === 'thumb') {
          //       pushFile({
          //         uploadType: {
          //           succeed: false,
          //           error: false,
          //           loading: true,
          //         }
          //       });
          //       // item.uploadType = {
          //       //   succeed: false,
          //       //   error: false,
          //       //   loading: true,
          //       // };
          //     }
          //     pushFile({
          //       loadingTempo: 1
          //     });
          //     // item.loadingTempo = 1;
          //     // $scope.$apply();
          //   };
          //   xhr.upload.onprogress = function (evt) {
          //     if (evt.lengthComputable) {
          //       // item.loadingTempo = (evt.loaded / evt.total) * 100;
          //       // $scope.$apply();
          //       pushFile({
          //         loadingTempo: (evt.loaded / evt.total) * 100
          //       });
          //     } else {
          //       console.log('无法计算进度信息，总大小是未知的', evt);
          //     }
          //   };
          //   xhr.ontimeout = function (event) {
          //     // 请求超时！
          //     // item.uploadType = {
          //     //   succeed: false,
          //     //   error: true,
          //     //   loading: false,
          //     // };
          //     pushFile({
          //       uploadType: {
          //         succeed: false,
          //         error: true,
          //         loading: false,
          //       }
          //     });
          //   };
          //   // xhr.onload = function(evt) {
          //   //     console.log("传输完成.");
          //   // }
          //   // xhr.onerror = function(evt) {
          //   //     console.log("在传输文件时发生了错误.");
          //   // }
            
          //   xhr.open('post', $scope.apiUrl || '/ehuodiGateway/huilianApi/uploader/attachment');
          //   xhr.onreadystatechange = function () {
          //     if (xhr.readyState == 4) {
          //       if (xhr.status === 200) {
          //         // item.uploadType = {
          //         //   succeed: true,
          //         //   error: false,
          //         //   loading: false,
          //         // };
          //         const d = JSON.parse(xhr.responseText);
          //         if (d && d.result === 'success') {
          //           pushFile({
          //             uploadType: {
          //               succeed: true,
          //               error: false,
          //               loading: false,
          //             },
          //             url: d.data[0].attachmenturl
          //           });
          //           // item.data = d.data;
          //           // const imgs = [];
          //           // angular.forEach(d.data, function(item) {
          //           //   imgs.push(item.attachmenturl);
          //           // });
          //           // item.imageUrl = imgs[0];
          //           console.log(7766, item)
          //         }else{
          //           pushFile({
          //             uploadType: {
          //               succeed: true,
          //               error: true,
          //               loading: false,
          //             },
          //           });
          //           // item.uploadType = {
          //           //   succeed: false,
          //           //   error: true,
          //           //   loading: false,
          //           // };
          //           G.alert(d.msg , {
          //             type: 'error',
          //           });
          //         }
          //         $scope.selectImg();
          //         // $scope.$apply();
          //       } else {
          //         pushFile({
          //           uploadType: {
          //             succeed: true,
          //             error: true,
          //             loading: false,
          //           },
          //         });
          //         // item.uploadType = {
          //         //   succeed: false,
          //         //   error: true,
          //         //   loading: false,
          //         // };
          //         // $scope.$apply();
          //       }
          //     }
          //   };
          //   xhr.send(data);
          // }


          const pushFile = (options, eventName, eventIndex) => {
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
                if(eventName === 'add'){
                  imageArray.push({});
                }          
                var index = imageArray.length - 1;
                Object.assign(imageArray[index], options);
                $scope.imageArray = imageArray;
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
            
          };


          // 筛选可用图片
          // $scope.selectImg = function () {
          //   $scope.imageUrls = [];
          //   var arr = G.clone($scope.imageArray);
          //   if (arr.length > 0) {
          //     for (let i = 0; i < arr.length; i++) {
          //       if (arr[i].uploadType.succeed) {
          //         $scope.imageUrls.push(arr[i]);
          //       }
          //     }
          //   }
          // };

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
            if(item.dataImg.indexOf('.png')>-1 || item.dataImg.indexOf('.jpg')>-1 || item.dataImg.indexOf('.jpeg')>-1){
              var canvas = document.createElement("canvas");
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.src = item.dataImg;
              canvas.width = img.width;
              canvas.height = img.height;
              canvas.getContext("2d").drawImage(img, 0, 0);
              var url = canvas.toDataURL();
              $ele.attr("href", url).attr("download", name);
            }else{
              var url = item.dataImg;
              $ele
                .attr("href", url)
                .attr("target", "_blank")
                .attr("download", name + "." + nameEnd);
            }
          }
          // $scope.initType = true;
          // $scope.$watch('imageUrls',function(newValue,oldValue){
          //   if((newValue.length > oldValue.length) && $scope.initType){
          //     $scope.initType = false;
          //     // $scope.init();
          //     $scope.selectImg();
          //   }
          // },true);
          
          // $scope.clearData = function () {
          //   $scope.init();
          // }
          
          // console.log($scope.imageArray)
          $scope.fileFn = ()=>{
            G.alert(`上传数量已满`,{type:'error'});
          }
        }
      }
    }
  ])
};
