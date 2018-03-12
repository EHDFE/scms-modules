/**
 * ka-image-upload-directive图片上传
 * @param ngModel,图片bind，array
 * @param dMax，最大可以上传几张图片，不超过10
 * @param dWidth,图片限制宽度
 * @param dHeight,图片限制高度
 * @param dSize,图片限制大小
 * @param dValue,图片路径
 * @param uploadUrl,图片上传地址
 * @param resFormat,服务端返回数据格式{url:绝对路径字段名, name:文件名字段名, id: 相对路径字段名}
 * @param canEdit, 可编辑的状态有删除按钮
 * @param source,调用插件的来源,不同来源接口回调内容不同,['ka']
 */
import imageShow from '../imageShow/imageShow';
import './kaImageUpload.css';
import html from './kaImageUpload.html';

export default (app, elem, attrs, scope) => {
  imageShow(app, elem, attrs, scope);
  app.directive('kaImageUploadDirective', [
    'G',
    '$http',
    '$timeout',
    '$location',
    function (G, $http, $timeout, $location) {
      return {
        template: html,
        require: '?ngModel',
        scope: {
          ngModel: '=',
          dMax: '=',
          dWidth: '=',
          dHeight: '=',
          dSize: '=',
          dValue: '=',
          uploadUrl: '=',
          resFormat: '=', // 服务端返回数据格式{url:绝对路径字段名, name:文件名字段名, id: 相对路径字段名}
          canEdit: '=',
          source: '@',
        },
        controller($scope, $element, $attrs) {
          $scope.dMax = parseInt($scope.dMax, 10) || 1;
          $scope.ngModel =
                $scope.source == 'ka' ? $scope.ngModel : $scope.ngModel || [];
          $scope.urls = $scope.urls || [];
          $scope.isDownloading = true;
          const $file = $element.find('.file');

          // 上传图片可多选
          if ($scope.dMax > 1) {
            $file.attr('multiple', 'multiple');
          }

          // 显示默认的图片
          $scope.$watch(
            'ngModel',
            (newValue, oldValue) => {
              if (newValue) {
                $scope.urls = [];
                if ($scope.source == 'ka' && newValue) {
                  $scope.urls = [newValue];
                } else if (newValue.length) {
                  angular.forEach($scope.ngModel, (item) => {
                    $scope.urls.push({
                      url: item,
                    });
                  });
                  $scope.dValue = newValue.join(',');
                }
              }
            },
            true,
          );

          $scope.loadImage = function () {
            $scope.isDownloading = false;
          };

          // 删除图片
          $scope.remove = function ($index) {
            $scope.urls.splice($index, 1);
            $scope.isDownloading = true;
            if ($scope.source == 'ka') {
              $scope.ngModel = '';
            } else {
              $scope.ngModel.splice($index, 1);
              $scope.dValue = $scope.ngModel.join(',')
                ? $scope.ngModel.join(',')
                : null;
            }
          };

          // 下载文件
          $scope.download = function (event, url) {
            console.log(url, 8888);
            $location.path(url);
          };

          $scope.clickFun = {};

          // 查看大图
          $scope.showBig = function (event, url) {
            $scope.clickFun.imgClick(event, url);
          };

          // 上传图片报错处理
          const setError = function (type) {
            G.alert($attrs.errormsg || '请按要求上传正确的图片', {
              type: 'error',
              speed: 5000,
            });
            $scope.urls.splice($scope.urls.length - 1, 1);
          };

          // 上传图片成功，显示图片
          const show = function (data) {
            $timeout(() => {
              if (data.result == 'error') {
                $file.val('');
                G.alert(data.msg || '上传失败', { type: 'error' });
                $scope.urls.splice($scope.urls.length - 1, 1);
                $scope.loadImage();
                return;
              }
              if ($scope.source == 'ka') {
                if ($scope.resFormat) {
                  $scope.ngModel = {
                    url: data.data[$scope.resFormat.url] || '',
                    id: data.data[$scope.resFormat.id] || '',
                    name: data.data[$scope.resFormat.name] || '',
                  };
                } else {
                  $scope.ngModel = {
                    url: data.data.absolutefilepath
                      ? data.data.absolutefilepath
                      : data.data[2],
                    id: data.data.fileid ? data.data.fileid : data.data[1],
                    name: data.data.filename
                      ? data.data.filename
                      : data.data[0],
                  };
                }
              } else {
                const item = data.data[0];
                if ($scope.dWidth && item.width !== $scope.dWidth) {
                  setError(1);
                } else if (
                  $scope.dHeight &&
                      item.height !== $scope.dHeight
                ) {
                  setError(2);
                } else if (
                  $scope.dSize &&
                      item.size / 1024 > parseInt($scope.dSize, 10)
                ) {
                  setError(3);
                } else {
                  const length = data.data ? data.data.length : 0;
                  angular.forEach(data.data, (item, index) => {
                    $scope.urls[
                      $scope.urls.length - 1 - (length - 1 - index)
                    ] = item;
                  });

                  $scope.ngModel = [];
                  angular.forEach($scope.urls, (item, index) => {
                    $scope.ngModel.push(item.url);
                  });
                  $scope.dValue = $scope.ngModel.join(',')
                    ? $scope.ngModel.join(',')
                    : null;
                }
              }
              $file.val('');
            });
          };

          // 判断图片大小
          function judgeSize(file) {
            const data = new FormData();
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (theFile) {
              const image = new Image();
              image.src = theFile.target.result;
              image.onload = function () {
                if ($scope.dWidth && this.width !== $scope.dWidth) {
                  setError(1);
                } else if (
                  $scope.dHeight &&
                      this.height !== $scope.dHeight
                ) {
                  setError(2);
                } else if (
                  $scope.dSize &&
                      file.size / 1024 > parseInt($scope.dSize, 10)
                ) {
                  setError(3);
                } else {
                  data.append('img', file);
                  $scope.urls.push({
                    url: '',
                  });
                  uploadImage(data);
                }
              };
            };
          }

          // 上传图片动作
          $file.bind('change', function (event) {
            const file = event.currentTarget;
            const _this = this;

            if (!file.files || (file.files && !file.files.length)) {
              return;
            }
            angular.forEach(file.files, (item, index) => {
              if (!/\.(jpg|jpeg|png)$/.test(item.name)) {
                G.alert('请上传格式为JPG/PNG/jpeg格式的图片', {
                  type: 'error',
                });
              } else {
                judgeSize(item);
              }
            });
          });
          function uploadImage(data) {
            $timeout(() => {
              const xhr = new XMLHttpRequest();
              xhr.open('post', $scope.uploadUrl);
              xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                  if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    show(result);
                  } else if (xhr.status === 413) {
                    $timeout(() => {
                      setError(3);
                      $scope.urls.splice($scope.urls.length - 1, 1);
                      $file.val('');
                    });
                  } else {
                    $timeout(() => {
                      G.alert('上传图片失败，请重试', {
                        type: 'error',
                        speed: 5000,
                      });
                      $scope.urls.splice($scope.urls.length - 1, 1);
                      $file.val('');
                    });
                  }
                }
              };
              xhr.send(data);
            }, 0);
          }

          $scope.isimg = function (name) {
            if (name) {
              name = name.toLowerCase();
              if (
                name.indexOf('.png') >= 0 ||
                    name.indexOf('.jpg') >= 0 ||
                    name.indexOf('.jpeg') >= 0 ||
                    name.indexOf('.svg') >= 0
              ) {
                return true;
              }
              return false;
            }
          };
        },
        link($scope, $element, $attrs, ngModel) {},
      };
    },
  ]);
  app.directive('imageonload', () => ({
    restrict: 'A',
    link(scope, element, attrs) {
      element.bind('load', () => {
        scope.$apply(attrs.imageonload);
      });
    },
  }));
};
