/**
 * <directive>
 * @description 星星评价
 * @date 2017-10-16
 * @author 程乐
 * @lastBy
 * @html <span star-rating num="datanum"></span>
 */
import html from './starRating.html';
import './starRating.css';

export default (app, elem, attrs, scope) => {
  app.directive('starRating', [
    '$timeout',
    '$document',
    '$compile',
    function($timeout, $document, $compile) {
      return {
        template: html,
        restrict: 'EA',
        replace: true,
        scope: {
          num: '=',
        },
        link: function postLink() {},
        controller: function(
          $scope,
          $element,
          $attrs,
          $transclude,
          $log,
          $http,
          G
        ) {
          function dispose(data) {
            $element.html('');
            data = data || 0;
            var num = data / 20;
            var integer = parseInt(num);
            var html = '';

            function isInteger(obj) {
              return Math.floor(obj) === obj;
            }
            var Boole = isInteger(num);

            for (var i = 1; i < 6; i++) {
              if (Boole) {
                if (i <= integer) {
                  html += '<span class="star star-full"></span>';
                } else {
                  html += '<span class="star"></span>';
                }
              } else {
                if (i <= integer) {
                  html += '<span class="star star-full"></span>';
                } else if (i == integer + 1) {
                  html += '<span class="star star-half"></span>';
                } else {
                  html += '<span class="star"></span>';
                }
              }
            }
            $element.append(html);
          }

          $scope.$watch('num', function(newVal, oldVal) {
            // if(newVal != oldVal){
            dispose(newVal);
            // }
          });
        },
      };
    },
  ]);
};
