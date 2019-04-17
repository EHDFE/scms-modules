/**
 * <directive>
 * @name table 列表
 * @description 列表指令，获取列表数据，展示分页，展示无数据提示，之后会有排序等功能
 * @date 2016-12-01
 * @author 田艳容
 * @lastBy
 * @htmlUrl scmsModules/table/tableHtml.html
 */
import find from "lodash/find";
import paginationDirective from "../pagination/paginationDirective";
import errorNoDataDirective from "../errorNoData/errorNoDataDirective";
import ngTableFixed from "./ngTableFixed";
import html from "./index.html";

let useCacheParams = {}, isBindRootScope = false;
export default (app, elem, attrs, scope) => {
  paginationDirective(app);
  errorNoDataDirective(app);
  ngTableFixed(app);
  app.directive("tableDirective", [
    "$cookies",
    "$http",
    "allRouterData",
    "$rootScope",
    "$state",
    "$timeout",
    function($cookies, $http, allRouterData, $rootScope, $state, $timeout) {
      return {
        template: html,
        scope: {
          apiUrl: "=", // @scope apiUrl 依赖后端api接口地址 {type: "string",exampleValue: '/scms/scmsmodules/table/data.json'}
          fetch: "=", // @scope fetch 获取数据的函数 {type: "function"}
          items: "=", // @scope items 获得的items {type: "out-object"}
          pageSize: "=?", // @scope pageSize 每页显示个数 {type: "out-number"}
          currPage: "=?", // @scope currPage 当前页码 {type: "out-number"}
          fetchParam: "=", // @scope fetchParam 数据筛选的参数 {type: "object", "exampleValue": {keyword:"15810221572"}, defaultValue: {}}
          formatParam: "=", // @scope formatParam 格式化传入参数 {type: "callback", parentScopeValue: "console.log('格式化参数:',arguments);"}
          formatData: "=", // @scope formatData 格式化列表数据 {type: "function", parentScopeValue: "console.log('格式化数据:',arguments);"}
          disableStorage: "=", // @scope disableStorage 是否禁止从localStorage中获取搜索条件 {type: "boolean", exampleValue: "false"}
          delEmptyParam: "=", // @scope delEmptyParam 是否删除值为空字符串的请求参数 {type: "boolean", exampleValue: "false"}
          ngTableFixed: "=", //ngTableFixed指令在监听他的变化，重置计算：th宽度、是否显示固定元素、设置父容器高度
          miniPage: "=", //@scope miniPage 分页是否使用缩小样式 {type: "boolean", "exampleValue": false, defaultValue: false}
          sendJson: "=", //@scope contentType 请求类型
          getCountFromOtherApi: "=", //@scope getCountFromOtherApi 是否从其他接口获取总count {type: "function"}
          disabledInitFetch: '@',
        },
        restrict: "EA",
        transclude: true,
        link: function ($scope, $element, $attrs) {
          
          const crumbs = window.CRUMBS;
          // @attrs method http类型 {type: "string", defaultValue: "post"}
          $element.css({
            position: "relative",
            "min-height": "200px"
          });
          // @attrs isPagination 是否显示分页 {type: "string", defaultValue: "true"}
          $scope.hasPagination = $attrs.hasPagination !== "false";
          $scope.hidePageSize = $attrs.hidePageSize || false;
          $scope.currPage = $scope.currPage || 1;
          //$scope.fetchParam = $scope.fetchParam || {};
          $scope.items = [];
          $scope.pageSize =
            $scope.pageSize || parseInt($cookies.pageSize, 10) || 15;

          let preFetchTime = 0,
            preFetchContent;

          $scope.$watch('pageSize', function(newValue, oldValue) {
            if(newValue && oldValue && newValue !== oldValue) {
              $scope.fetch();
            }
          })

          let fetchParam, cacheFetchParamsName;
          $scope.fetch = async function(options) {
            if (!$scope.apiUrl) {
              return;
            }
            let currPage;
            options = options || {};

            if ($scope.getCountFromOtherApi) {
              var totalCount = await $scope.getCountFromOtherApi();
            }
            cacheFetchParamsName =
              "fetchParams." + $state.current.name + $scope.apiUrl;
            if (
              localStorage[cacheFetchParamsName] &&
              !$scope.disableStorage &&
              useCacheParams[$state.current.name]
            ) {
              fetchParam = JSON.parse(
                localStorage[cacheFetchParamsName] || {}
              );

              $scope.fetchParam = fetchParam;
              currPage = fetchParam.skipCount/fetchParam.pageSize + 1;
              useCacheParams[$state.current.name] = false;
            } else {
              currPage = options.currPage || $scope.currPage;
              $scope.params = Object.assign({}, $scope.fetchParam || {});
              if ($scope.formatParam) {
                $scope.formatParam($scope.params);
              }
              if ($scope.delEmptyParam) {
                for (const key in $scope.params) {
                  if (
                    $scope.params[key] === "" ||
                    $scope.params[key] === undefined
                  ) {
                    delete $scope.params[key];
                  }
                }
              }
              const pageParams = $scope.hasPagination
                ? {
                    pageSize: $scope.pageSize,
                    skipCount: (currPage - 1) * $scope.pageSize
                  }
                : {};
                fetchParam = Object.assign({}, $scope.params, pageParams);
              }
            

            //
            const fetchConfig = {
              url: $scope.apiUrl,
              method: $attrs.method || "post",
              data: fetchParam,
              isDebug: $attrs.isDebug,
              test: $attrs.test
            };

            if ($scope.sendJson) {
              Object.assign(fetchConfig, {
                isJson: true
              });
            }

            //一个相同请求在2秒内发送，第二次发送的请求失效。
            const currFetchContent = JSON.stringify(fetchConfig);
            const currFetchTime = +new Date();
            if (
              ((preFetchContent === currFetchContent &&
              currFetchTime - preFetchTime < 2000) || (currFetchTime - preFetchTime < 500))
            ) {
              return;
            }
            preFetchContent = currFetchContent;
            preFetchTime = currFetchTime;
            $scope.currPage = currPage;
            
            //loading效果
            $element.css({
              "min-height": "200px"
            });
            $.loading(true, {
              $container: $element
            });
            localStorage[cacheFetchParamsName] = JSON.stringify(fetchParam || {});
            $http(fetchConfig).then(
              data => {
                if (data && data.data) {
                  data = data.data;
                  $scope.totalCount = data.count || 0;
                  if ($scope.getCountFromOtherApi) {
                    $scope.totalCount = totalCount;
                  }
                  $scope.items = data.data;
                  if (
                    ($scope.items && $scope.items.length) ||
                    $scope.totalCount !== 0
                  ) {
                    $scope.isNoData = false;
                  } else {
                    $scope.isNoData = true;
                  }

                  if ($scope.formatData) {
                    $scope.formatData($scope.items, $scope.totalCount);
                  }
                }

                if ($attrs.ngTableFixed) {
                  $scope.ngTableFixed = +new Date() + "";
                }

                $.loading(false, {
                  $container: $element
                });
                $element.css({
                  "min-height": "auto"
                });
                
              },
              () => {
                $scope.totalCount = 0;
                $scope.items = [];
                $.loading(false, {
                  $container: $element
                });
                $element.css({
                  "min-height": "auto"
                });
              }
            );
          };

          if(!$scope.disabledInitFetch) {
            $scope.fetch();
          }

          if(!isBindRootScope) {
            $rootScope.$on(
              "$stateChangeStart",
              (state, next, nextParam, current, currentParam) => {
                const currentUrl = "#/" + current.name.replace(/\./g, "/");
                const nextUrl = "#/" + next.name.replace(/\./g, "/");
                const currentObj = crumbs[currentUrl];
                const currentObjLength = currentObj.length;
                if (
                  currentObjLength >= 2 &&
                  currentObj[currentObjLength - 2] &&
                  currentObj[currentObjLength - 2].resourceUrl === nextUrl
                ) {
                  useCacheParams[next.name] = true;
                }
              }
            );
            isBindRootScope = true;
          }
        },

        controller($scope, $element, $attrs, $transclude, $log, $http) {}
      };
    }
  ]);
};
