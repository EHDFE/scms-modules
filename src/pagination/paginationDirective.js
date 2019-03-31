/**
 * <directive>
 * @name Pagination 翻页
 * @description
 * @date 2016-09-20
 * @author 田艳容
 * @lastBy
 * @html <div pagination-directive current-page="currentPage" total-count="totalCount" page-size="pageSize" onchanged="onchanged" hide-page-size="hidePageSize"></div>
 */
import html from './pagination.html';

export default (app, elem, attrs, scope) => {
  app.directive('paginationDirective', [
    function () {
      return {
        template: html,
        restrict: 'EA',
        replace: true,
        scope: {
          currentPage: '=', // @scope currentPage 当前页码 {type: "number", "exampleValue": 1, defaultValue: 1}
          totalCount: '=', // @scope totalCount 总共行数 {type: "number", "exampleValue": 100}
          pageSize: '=', // @scope pageSize 一页显示行数 {type: "number", "exampleValue": 15, defaultValue: 15,isDisabled:1}
          onchanged: '=', // @scope onchanged 回调函数 {type: "function", "parentScopeValue": "$.alert('已执行回调函数,返回参数有:pageSize、currentPage', {type:'success'})"}
          hidePageSize: '=', // @scope hidePageSize pageSize是否显示 {type: "boolean", "exampleValue": false, defaultValue: false}
          miniPage: '=' // @scope miniPage 是否使用缩小样式 {type: "boolean", "exampleValue": false, defaultValue: false}
        },
        link: function postLink($scope, $element, $attrs) {},

        controller($scope, $element, $attrs, $cookies) {
          $scope.pages = [];
          $scope.hidePageSizeChange = $scope.hidePageSize || false;
          $scope.$watch('hidePageSize', (newValue) => {
            $scope.hidePageSizeChange = newValue;
          });

          $scope.pageSize =
              parseInt($scope.pageSize, 10) || parseInt($cookies.pageSize, 10) || 15;

          let timeoutValue;
          const onchanged = function (page) {
            $scope.currentPage = +page || 1;
            if ($scope.onchanged) {
              $scope.onchanged({
                currPage: $scope.currentPage,
                pageSize: $scope.pageSize,
                currentPage: $scope.currentPage,
              });
            }
          };

          let isHadInitFetch = false;
          $scope.$watch('onchanged', function(newValue, oldValue) {
            if(newValue && !isHadInitFetch) {
              onchanged($scope.currentPage);
              isHadInitFetch = true;
            }
          })

          const changePageSize = function () {
            $scope.maxPage =
                $scope.totalCount % $scope.pageSize > 0
                  ? parseInt($scope.totalCount / $scope.pageSize, 10) + 1
                  : $scope.totalCount / $scope.pageSize;
            $scope.pages = pushPages($scope.currentPage, $scope.maxPage);
            $scope.isShowAfEllipsis =
                !!($scope.currentPage < $scope.maxPage - 2 && $scope.maxPage > 5);
            $scope.isShowBeEllipsis =
                !!($scope.currentPage > 3 && $scope.maxPage > 5);

            if ($scope.number > $scope.maxPage) {
              $scope.number = $scope.maxPage;
            }
            $element
              .find('.pagination-left input')
              .css('width', 24 + $scope.maxPage.toString().length * 7);
          };

          $scope.$watch('totalCount', (newValue, oldValue) => {
            if (!newValue && newValue !== 0) {
              return;
            }
            $scope.totalCount = newValue;
            changePageSize();
          });

          var pushPages = function (centerPage, maxPage) {
            const pages = [];
            if (centerPage < 3) {
              centerPage = 3;
            }
            if (centerPage > maxPage - 2) {
              centerPage = maxPage - 2;
            }
            pages.push(centerPage - 2);
            if (maxPage >= centerPage - 1) {
              pages.push(centerPage - 1);
            }
            if (maxPage >= centerPage) {
              pages.push(centerPage);
            }
            if (maxPage >= centerPage + 1) {
              pages.push(centerPage + 1);
            }
            if (maxPage >= centerPage + 2) {
              pages.push(centerPage + 2);
            }
            const newPages = [];
            angular.forEach(pages, (item) => {
              if (item > 0 && item <= maxPage) {
                newPages.push(item);
              }
            });
            return newPages;
          };

          $scope.goPage = function (page) {
            if (
              !page ||
                page < 1 ||
                page > $scope.maxPage ||
                page == $scope.currentPage
            ) {
              return;
            }
            onchanged(page);
          };

          $scope.$watch('currentPage', (newValue, oldValue) => {
            if (!newValue || !$scope.maxPage) {
              return;
            }
            $scope.pages = pushPages(+newValue, $scope.maxPage);
            $scope.isShowAfEllipsis =
                !!(newValue < $scope.maxPage - 2 && $scope.maxPage > 5);
            $scope.isShowBeEllipsis =
                !!(newValue > 3 && $scope.maxPage > 5);

            $scope.number = $scope.currentPage;
          });

          const oldPageSize = $scope.pageSize;

          $scope.change = function () {
            changePageSize();
            $cookies.pageSize = $scope.pageSize;
            onchanged();
          };

          $scope.$watch('number', (newValue, oldValue) => {
            if (newValue > $scope.maxPage) {
              $scope.number = $scope.maxPage;
            }
          });

          $scope.number = $scope.currentPage;

          $scope.pageSizeList = [10, 15, 20, 30, 40, 50, 100, 500];
          $scope.pageSizeListName = {
            10: '10条/页',
            15: '15条/页',
            20: '20条/页',
            30: '30条/页',
            40: '40条/页',
            50: '50条/页',
            100 : '100条/页',
            500 : '500条/页'
          };
        },
      };
    },
  ]);
};
