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
          moduleType: '=',
          dWidth: '=',
          dHeight: '=',
          dSize: '=',
          apiUrl: '=',
          dNum: '=',
          clearData: '=',
          file:'=',
          fileType:'=',
          exampleText:'@',
          defaultImg:'@'
        },
        controller: function ($scope, $element, $attrs, $timeout) {
          $scope.exampleText = $scope.exampleText || '上传图片清晰可见，不可超过3M，支持jpg、jpeg、png';
          $scope.showClick = ()=>{};
          $scope.type = 1;
          $scope.init = ()=>{
            $scope.imageArray = [];
            $scope.imageUrls = $scope.imageUrls || [];
            var arr = $scope.imageUrls.map(item=>{
              return item;
            });
            if ($scope.moduleType === 'noThumb') {
              if ($scope.imageUrls && $scope.imageUrls.length > 0) {
                $scope.imageArray = arr;
              } else {
                arr = $scope.imageArray;
                $scope.imageUrls = arr;
              }
            } else if ($scope.imageUrls && $scope.imageUrls.length) {
              $scope.imageArray = arr;
              if($scope.dNum){
                if($scope.imageArray.length < $scope.dNum){
                  $scope.imageArray.push({
                    uploadType: {
                      succeed: false,
                      error: false,
                      loading: false,
                    },
                  });
                }
              }else{
                $scope.imageArray.push({
                  uploadType: {
                    succeed: false,
                    error: false,
                    loading: false,
                  },
                });
              }
            } else {
              $scope.imageArray.push({
                uploadType: {
                  succeed: false,
                  error: false,
                  loading: false,
                },
              });
              $scope.imageUrls = [];
            }
          }
          $scope.init();
          
          $scope.remove = (item, index) => {
            $scope.imageArray.splice(index, 1);
            $scope.selectImg();
            if ($scope.moduleType === 'thumb' && $scope.imageArray.length < $scope.dNum) {
              let num = 0;
              for (let i = 0; i < $scope.imageArray.length; i++) {
                if ($scope.imageArray[i].uploadType.succeed || $scope.imageArray[i].uploadType.error || $scope.imageArray[i].uploadType.loading) {
                  num++;
                } else {
                  break;
                }
              };
              if (num === $scope.dNum - 1) {
                $scope.imageArray.push({
                  uploadType: {
                    succeed: false,
                    error: false,
                    loading: false,
                  },
                });
              }
            }
          };

          // 上传
          const $file = $element.find('input');
          $element.on('change', 'input', (event) => {
            const file = event.currentTarget;
            if (!file.files || (file.files && !file.files.length)) {
              return;
            }
            if($scope.file){
              var text = $scope.fileType.join('|');
              var alertText = $scope.fileType.join('/');
            }else{
              var text = 'jpg|jpeg|png|bmp';
              var alertText = 'JPG/JPEG/PNG/BMP';
            }
            var pattern = new RegExp('.('+text+')$');
            angular.forEach(file.files, (item, index) => {
              if (!pattern.test(item.name)) {
                G.alert('请上传格式为'+alertText+'格式的文件', { type: 'error' });
              } else {
                verify(item);
              }
            });
          });
          // 验证
          function verify(file) {
            const data = new FormData();
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (theFile) {
              if(!$scope.file){
                const image = new Image();
                image.src = theFile.target.result;
                image.onload = function () {
                  if ($scope.dWidth && this.width !== $scope.dWidth) {
                    G.alert(`图片宽度不等于${$scope.dWidth}px`, {
                      type: 'error',
                    });
                    return;
                  }
                  if ($scope.dHeight && this.height !== $scope.dHeight) {
                    G.alert(`图片高度不等于${$scope.dHeight}px`, {
                      type: 'error',
                    });
                    return;
                  }
                  if ($scope.dSize && file.size / 1024 > parseInt($scope.dSize, 10)) {
                    G.alert(`图片大于${$scope.dSize}KB`, {
                      type: 'error',
                    });
                    return;
                  }
                  if ($scope.moduleType === 'noThumb') {
                    $scope.imageArray.push({
                      imgName: file.name,
                      uploadType: {
                        succeed: false,
                        error: false,
                        loading: true,
                      },
                    });
                    const index = $scope.imageArray.length - 1;
                    $scope.$apply();
                    data.append('file', file);
                    uploadImage(data, $scope.imageArray[index]);
                  } else {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                      // console.log('成功读取文件路径');
                      const index = $scope.imageArray.length - 1;
                      if ($scope.moduleType === 'thumb') {
                        $scope.imageArray[index].dataImg = e.target.result;
                      }
                      $scope.$apply();
                      data.append('file', file);
                      uploadImage(data, $scope.imageArray[index]);
                      if ($scope.moduleType === 'thumb' && $scope.imageArray.length < $scope.dNum) {
                        $scope.imageArray.push({
                          uploadType: {
                            succeed: false,
                            error: false,
                            loading: false,
                          },
                        });
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                };
              }else{
                  if ($scope.dSize && file.size / 1024 > parseInt($scope.dSize, 10)) {
                    G.alert(`文件大于${$scope.dSize}KB`, {
                      type: 'error',
                    });
                    return;
                  }
                  $scope.imageArray.push({
                    imgName: file.name,
                    uploadType: {
                      succeed: false,
                      error: false,
                      loading: true,
                    },
                  });
                  const index = $scope.imageArray.length - 1;
                  $scope.$apply();
                  data.append('file', file);
                  uploadImage(data, $scope.imageArray[index]);
              }
            };
          }
          // 请求
          function uploadImage(data, item) {
            const xhr = new XMLHttpRequest();
            xhr.timeout = 30000;
            xhr.onloadstart = function (evt) {
              // console.log('开始')
              if ($scope.moduleType === 'thumb') {
                item.uploadType = {
                  succeed: false,
                  error: false,
                  loading: true,
                };
              }
              item.loadingTempo = 1;
              $scope.$apply();
            };
            xhr.upload.onprogress = function (evt) {
              if (evt.lengthComputable) {
                item.loadingTempo = (evt.loaded / evt.total) * 100;
                $scope.$apply();
              } else {
                console.log('无法计算进度信息，总大小是未知的', evt);
              }
            };
            xhr.ontimeout = function (event) {
              // 请求超时！
              item.uploadType = {
                succeed: false,
                error: true,
                loading: false,
              };
            };
            // xhr.onload = function(evt) {
            //     console.log("传输完成.");
            // }
            // xhr.onerror = function(evt) {
            //     console.log("在传输文件时发生了错误.");
            // }

            xhr.open('post', $scope.apiUrl);
            xhr.onreadystatechange = function () {
              if (xhr.readyState == 4) {
                if (xhr.status === 200) {
                  item.uploadType = {
                    succeed: true,
                    error: false,
                    loading: false,
                  };
                  const d = JSON.parse(xhr.responseText);
                  if (d && d.result === 'success') {
                    item.data = d.data;
                  }else{
                    item.uploadType = {
                      succeed: false,
                      error: true,
                      loading: false,
                    };
                    G.alert(d.msg , {
                      type: 'error',
                    });
                  }
                  $scope.selectImg();
                  $scope.$apply();
                } else {
                  item.uploadType = {
                    succeed: false,
                    error: true,
                    loading: false,
                  };
                  $scope.$apply();
                }
              }
            };
            xhr.send(data);
          }
          // 筛选可用图片
          $scope.selectImg = function () {
            $scope.imageUrls = [];
            var arr = G.clone($scope.imageArray);
            if (arr.length > 0) {
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].uploadType.succeed) {
                  $scope.imageUrls.push(arr[i]);
                }
              }
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
          $scope.initType = true;
          $scope.$watch('imageUrls',function(newValue,oldValue){
            if((newValue.length > oldValue.length) && $scope.initType){
              $scope.initType = false;
              // $scope.init();
              $scope.selectImg();
            }
          },true);
          
          $scope.clearData = function () {
            $scope.init();
          }
          // $scope.clearData = $scope.clear;
          // console.log($scope.imageArray)
          $scope.fileFn = ()=>{
            G.alert(`上传数量已满`,{type:'error'});
          }
        }
      }
    }
  ])
};
