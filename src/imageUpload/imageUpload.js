/**
 * <directive>
 * @description 图片上传
 * @date 2018-02-02
 * @author 程乐
 * @lastBy
 * @html <div image-upload module-type="'noThumb'" api-url="'/goodstaxiAdmin/imagecs/uploadImage'"" image-urls="imageUrls" d-width="30" d-height="30" d-size="30"></div>
 * @html <div image-upload module-type="'thumb'" api-url="'/goodstaxiAdmin/imagecs/uploadImage1'" d-num="3" d-width="30" d-height="30" d-size="30" image-urls="imageUrls"></div>
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
          clearData: '='
        },
        controller: [
          '$scope',
          '$element',
          '$attrs',
          '$timeout',
          function ($scope, $element, $attrs, $timeout) {},
        ],
        link($scope, $element, $attrs, ngModel) {
          $scope.showClick = ()=>{};
          $scope.type = 1;
          $scope.init = ()=>{
            $scope.imageArray = [];
            $scope.imageUrls = $scope.imageUrls || [];
            if ($scope.moduleType === 'noThumb') {
              if ($scope.imageUrls && $scope.imageUrls.length > 0) {
                $scope.imageArray = $scope.imageUrls;
              } else {
                $scope.imageUrls = $scope.imageArray;
              }
            } else if ($scope.imageUrls && $scope.imageUrls.length) {
              $scope.imageArray = $scope.imageUrls;
              $scope.imageArray.push({
                uploadType: {
                  succeed: false,
                  error: false,
                  loading: false,
                },
              });
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
            angular.forEach(file.files, (item, index) => {
              if (!/\.(jpg|jepg|png|bmp)$/.test(item.name)) {
                G.alert('请上传格式为JPG/PNG/BMP格式的图片', { type: 'error' });
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
              const image = new Image();
              image.src = theFile.target.result;
              image.onload = function () {
                if ($scope.dWidth && this.width !== $scope.dWidth) {
                  G.alert(`图片宽度大于${$scope.dWidth}px`, {
                    type: 'error',
                  });
                  return;
                }
                if ($scope.dHeight && this.height !== $scope.dHeight) {
                  G.alert(`图片高度大于${$scope.dHeight}px`, {
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
                  uploadImage(data, index);
                } else {
                  const reader = new FileReader();
                  reader.onload = function (e) {
                    console.log('成功读取图片路径');
                    const index = $scope.imageArray.length - 1;
                    if ($scope.moduleType === 'thumb') {
                      $scope.imageArray[index].dataImg = e.target.result;
                    }
                    $scope.$apply();
                    data.append('file', file);
                    uploadImage(data, index);
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
            };
          }
          // 请求
          function uploadImage(data, index) {
            const xhr = new XMLHttpRequest();
            xhr.timeout = 30000;
            xhr.onloadstart = function (evt) {
              // console.log('开始')
              if ($scope.moduleType === 'thumb') {
                $scope.imageArray[index].uploadType = {
                  succeed: false,
                  error: false,
                  loading: true,
                };
              }
              $scope.imageArray[index].loadingTempo = 1;
              $scope.$apply();
            };
            xhr.upload.onprogress = function (evt) {
              if (evt.lengthComputable) {
                $scope.imageArray[index].loadingTempo = (evt.loaded / evt.total) * 100;
                $scope.$apply();
              } else {
                console.log('无法计算进度信息，总大小是未知的', evt);
              }
            };
            xhr.ontimeout = function (event) {
              // 请求超时！
              $scope.imageArray[index].uploadType = {
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
                  $scope.imageArray[index].uploadType = {
                    succeed: true,
                    error: false,
                    loading: false,
                  };
                  const d = JSON.parse(xhr.responseText);
                  if (d && d.result === 'success') {
                    $scope.imageArray[index].data = d.data;
                  }
                  $scope.selectImg();
                  $scope.$apply();
                } else {
                  $scope.imageArray[index].uploadType = {
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
            if ($scope.imageArray.length > 0) {
              for (let i = 0; i < $scope.imageArray.length; i++) {
                if ($scope.imageArray[i].uploadType.succeed) {
                  $scope.imageUrls.push($scope.imageArray[i]);
                }
              }
            }
          };
          
          $scope.clearData = function () {
            $scope.init();
          }
          // $scope.clearData = $scope.clear;
        }
      }
    }
  ])
};
