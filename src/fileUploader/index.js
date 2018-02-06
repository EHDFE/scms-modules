import './index.less';
import match from 'mime-match';
import html from './index.html';

export default (app, elem, attrs, scope) => {
  app.directive('fileUploader', [function(){
    return {
      template: html,
      restrict: 'EA',
      scope: {
        accept: '@', // 接受上传的文件类型, 详见 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept
        action: '@', // 必选参数, 上传的地址
        onChange: '=', // 上传中、完成、失败都会调用这个函数。
        beforeUpload: '=', // 上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传。
        triggerId: '@', // 触发按钮
        data: '=', // 上传所需参数或返回上传参数的方法
        name: '@', // 发到后台的文件参数名 默认 ‘file’,
      },
      transclude: true,
      link(scope, element) {
        const input = document.getElementById('upload-trigger');
        element.on('click', scope.triggerId, e => {
          input.value = null;
          input.click();
        });
      },
      controller($scope) {
        $scope.errorMsg = null;

        if (typeof FormData !== 'function') {
          $scope.errorMsg = '当前浏览器不支持H5上传，请更换现代浏览器或选择极速模式！';
          return;
        }

        if (!$scope.triggerId) {
          $scope.errorMsg = '请指定上传 triggerId';
          return;
        }
        if (!$scope.action) {
          $scope.errorMsg = '上传地址不能为空';
          return;
        }

        const validator = {
          accept(file, accept) {
            if (!accept) return false;
            const acceptList = accept.split(',');
            const fileType = file.type;
            const fileExt = file.name.split('.').pop();
            const matched = acceptList.some(rule => {
              if (rule.includes('/')) {
                // match mime type
                return match(rule, fileType);
              } else {
                // match extname
                return fileExt === rule;
              }
            });
            if (matched) return false;
            return `不接受选择的文件类型！`;
          },
        };

        const input = document.getElementById('upload-trigger');
        const handleUpload = () => {
          const files = input.files;
          if (files.length === 0) return;
          const file = files[0];
          const hook = $scope.beforeUpload(file);
          if (!hook) return false;
          if (hook instanceof Promise) {
            hook.then(upload);
          } else {
            upload(hook);
          }
        };
        const upload = file => {
          const acceptValidateResult = validator.accept(file, $scope.accept);
          if (acceptValidateResult) {
            $scope.$apply(() => {
              $scope.errorMsg = acceptValidateResult;
            });
            return;
          }
          const formData = new FormData();
          formData.append($scope.name || 'file', file);
          if ($scope.data) {
            Object.keys($scope.data).forEach(key => {
              formData.append(key, $scope.data[key]);
            });
          }

          $.ajax({
            url:  $scope.action,
            type: 'POST',
            data: formData,
            processData: false,  // 不处理数据
            contentType: false   // 不设置内容类型
          }).done(data => {
            const res = JSON.parse(data);
            if (res.status === 500 || res.result === 'error') {
              console.warn('[FILEUPLAODER failed]')
              console.warn(res);
              $scope.onChange(res);
              $scope.$apply(() => {
                $scope.errorMsg = res.msg;
              });
            } else {
              $scope.onChange(res);
              $scope.$apply(() => {
                $scope.errorMsg = null;
              });
            }
          }).fail(err => {
            $scope.$apply(() => {
              if (typeof err === 'object') {
                $scope.errorMsg = err.toString();
              } else {
                $scope.errorMsg = err;
              }
            });
          });
          
          // fetch($scope.action, {
          //   method: 'POST',
          //   body: formData,
          //   credentials: 'include',
          // })
          //   .then(res => res.json())
          //   .then(res => {
          //     if (res.status === 500 || res.result === 'error') {
          //       console.warn('[FILEUPLAODER failed]')
          //       console.warn(res);
          //       $scope.onChange(res);
          //       throw new Error(res.msg);
          //     } else {
          //       $scope.onChange(res);
          //       $scope.$apply(() => {
          //         $scope.errorMsg = null;
          //       });
          //     }
          //   })
          //   .catch(err => {
          //     $scope.$apply(() => {
          //       if (typeof err === 'object') {
          //         $scope.errorMsg = err.toString();
          //       } else {
          //         $scope.errorMsg = err;
          //       }
          //     });
          //   });
        };

        $(input).on('change', handleUpload);
        
      }
    }
  }]);
};