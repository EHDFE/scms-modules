/**
 * <directive>
 * @description 图片展示
 * @date 2017-08-03
 * @author 程乐
 * @lastBy
 * @html <img image-show img-url="item.imageurl" alt-text="'卸货凭证'" text-only="显示文字" bg-click="false" mini-img="false">
 */
import html from './imageShow.html';
import './imageShow.css';
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';

export default (app, elem, attrs, scope) => {
  app.directive('imageShow', ['$timeout', '$document', '$compile',
    function ($timeout, $document, $compile) {
      return {
        template: html,
        restrict: 'EA',
        replace: true,
        scope: {
          imgUrl: '=',
          altText: '=',
          textOnly: '=',
          bgClick: '=',
          customCss: '=',
          clickFun: '=',
          miniImg: '=',
          showClick: '='
        },
        link: function postLink() {

        },
        controller($scope, $element, $attrs, $transclude, $log, $http, G) {
          // let current = 0;
          // let rotateW,
          //   rotateH;
          if ($scope.miniImg && $scope.imgUrl) {
            if ($scope.imgUrl.substr(-4, 4) === '.png') {
              $scope.miniImgUrl = $scope.imgUrl.replace('.png', '_240x320.png');
            } else if ($scope.imgUrl.substr(-4, 4) === '.jpg') {
              $scope.miniImgUrl = $scope.imgUrl.replace('.jpg', '_240x320.jpg');
            } else if ($scope.imgUrl.substr(-4, 4) === 'jpeg') {
              $scope.miniImgUrl = $scope.imgUrl.replace('.jpeg', '_240x320.jpeg');
            } else if ($scope.imgUrl.substr(-4, 4) === '.gif') {
              $scope.miniImgUrl = $scope.imgUrl.replace('.gif', '_240x320.gif');
            }
          }
          
          let viewer = '';
          $scope.$watch('imgUrl', (newVal, oldVal)=>{
            if(newVal !== oldVal){
              if ($scope.miniImg && $scope.imgUrl) {
                if ($scope.imgUrl.substr(-4, 4) === '.png') {
                  $scope.miniImgUrl = $scope.imgUrl.replace('.png', '_240x320.png');
                } else if ($scope.imgUrl.substr(-4, 4) === '.jpg') {
                  $scope.miniImgUrl = $scope.imgUrl.replace('.jpg', '_240x320.jpg');
                } else if ($scope.imgUrl.substr(-4, 4) === 'jpeg') {
                  $scope.miniImgUrl = $scope.imgUrl.replace('.jpeg', '_240x320.jpeg');
                }else if ($scope.imgUrl.substr(-4, 4) === '.gif') {
                  $scope.miniImgUrl = $scope.imgUrl.replace('.gif', '_240x320.gif');
                }else if($scope.imgUrl.indexOf('data:') > -1){
                  $scope.miniImgUrl = $scope.imgUrl;
                }
              }
              if(viewer){
                viewer.destroy();
                $timeout(()=>{
                  setViewer();
                },100)
              }
            }
          });
          
          $timeout(()=>{
            setViewer();
          },100)
          $scope.imgClick = ($event, url) => {
            viewer['view']();
          };

          function setViewer(){
            viewer = new Viewer($($element).find('.imageShowHideImg')[0], {
              navbar:false,
              toolbar: {
                zoomIn: true,
                zoomOut: true,
                oneToOne: true,
                reset: true,
                prev: false,
                play: false,
                next: false,
                rotateLeft: true,
                rotateRight: true,
                flipHorizontal: true,
                flipVertical: true,
                download: function() {
                  const a = document.createElement('a');
                  a.href = viewer.image.src;
                  a.download = viewer.image.alt;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                },
              },
              show(event){
                event.stopPropagation();
              },
              hide(event){
                event.stopPropagation();
              }
            });
          }
          
          $scope.clickFun = $scope.clickFun;
          if ($scope.clickFun) {
            $scope.clickFun.imgClick = $scope.imgClick;
          }
          
          if($scope.showClick){
            $scope.showClick = $scope.imgClick;
          }


        },
      };
    }]);
};
