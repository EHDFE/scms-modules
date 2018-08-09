/**
 * <directive>
 * @name table 列表
 * @description 列表指令，获取列表数据，展示分页，展示无数据提示，之后会有排序等功能
 * @date 2016-12-01
 * @author 田艳容
 * @lastBy
 * @htmlUrl scmsModules/table/tableHtml.html
 */
import find from 'lodash/find';
import paginationDirective from '../pagination/paginationDirective';
import errorNoDataDirective from '../errorNoData/errorNoDataDirective';
import ngTableFixed from './ngTableFixed';
import html from './index.html';

export default (app, elem, attrs, scope) => {
  paginationDirective(app);
  errorNoDataDirective(app);
  ngTableFixed(app);
  app.directive('tableDirective', [
    '$cookies',
    '$http',
    'allRouterData',
    '$rootScope',
    '$state',
    '$timeout',
    function($cookies, $http, allRouterData, $rootScope, $state, $timeout) {
      return {
        template: html,
        scope: {
          apiUrl: '=', // @scope apiUrl 依赖后端api接口地址 {type: "string",exampleValue: '/scms/scmsmodules/table/data.json'}
          fetch: '=', // @scope fetch 获取数据的函数 {type: "function"}
          items: '=', // @scope items 获得的items {type: "out-object"}
          pageSize: '=?', // @scope pageSize 每页显示个数 {type: "out-number"}
          currPage: '=?', // @scope currPage 当前页码 {type: "out-number"}
          fetchParam: '=', // @scope fetchParam 数据筛选的参数 {type: "object", "exampleValue": {keyword:"15810221572"}, defaultValue: {}}
          formatParam: '=', // @scope formatParam 格式化传入参数 {type: "callback", parentScopeValue: "console.log('格式化参数:',arguments);"}
          formatData: '=', // @scope formatData 格式化列表数据 {type: "function", parentScopeValue: "console.log('格式化数据:',arguments);"}
          disableStorage: '=', // @scope disableStorage 是否禁止从localStorage中获取搜索条件 {type: "boolean", exampleValue: "false"}
          delEmptyParam: '=', // @scope delEmptyParam 是否删除值为空字符串的请求参数 {type: "boolean", exampleValue: "false"}
          ngTableFixed: '=',//ngTableFixed指令在监听他的变化，重置计算：th宽度、是否显示固定元素、设置父容器高度
          miniPage: '=', //@scope miniPage 分页是否使用缩小样式 {type: "boolean", "exampleValue": false, defaultValue: false}
          sendJson: '=', //@scope contentType 请求类型
          getCountFromOtherApi: '=' //@scope getCountFromOtherApi 是否从其他接口获取总count {type: "function"}
        },
        restrict: 'EA',
        transclude: true,
        link: function postLink($scope, $element, $attrs) {
          // @attrs method http类型 {type: "string", defaultValue: "post"}
          $element.css({
            position: 'relative',
            'min-height': '200px',
          });
          // @attrs isPagination 是否显示分页 {type: "string", defaultValue: "true"}
          $scope.hasPagination = $attrs.hasPagination !== 'false';
          $scope.hidePageSize = $attrs.hidePageSize || false;
          $scope.currPage = $scope.currPage || 1;
          $scope.fetchParam = $scope.fetchParam || {};

          if (
            localStorage.fetchParamList &&
            !$scope.disableStorage &&
            localStorage.fromInnerToTable === 'true'
          ) {
            try {
              const localStorageArray = JSON.parse(localStorage.fetchParamList);
              angular.forEach(localStorageArray, param => {
                if ($state.current.name === param.state) {
                  $timeout(() => {
                    $scope.fetchParam = JSON.parse(param.fetchParamObj);
                    $scope.currPage = param.currPage || $scope.currPage;
                  });
                }
              });
            } catch (e) {
              console.error(e);
            }
          }
          $scope.items = [];
          $scope.pageSize =
            $scope.pageSize || parseInt($cookies.pageSize, 10) || 15;
          $scope.fetch = async function(options) {
            if (!$scope.apiUrl) {
              return;
            }
            $.loading(true, {
              $container: $element,
            });
            
            if($scope.getCountFromOtherApi){
              var totalCount = await $scope.getCountFromOtherApi();
            }

            options = options || {};
            $scope.currPage = options.currPage || $scope.currPage;
            $scope.params = Object.assign({}, $scope.fetchParam);

            if ($scope.formatParam) {
              $scope.formatParam($scope.params);
            }
            if ($scope.delEmptyParam) {
              for (const key in $scope.params) {
                if (
                  $scope.params[key] === '' ||
                  $scope.params[key] === undefined
                ) {
                  delete $scope.params[key];
                }
              }
            }

            const pageParams = $scope.hasPagination
              ? {
                pageSize: $scope.pageSize,
                skipCount: ($scope.currPage - 1) * $scope.pageSize,
              }
              : {};

            const fetchConfig = {
              url: $scope.apiUrl,
              method: $attrs.method || 'post',
              data: Object.assign({}, $scope.params, pageParams),
              isDebug: $attrs.isDebug,
              test: $attrs.test,
            };

            if ($scope.sendJson) {
              Object.assign(fetchConfig, {
                isJson: true,
              });
            }

            $http(fetchConfig).then(
              data => {
                if (data && data.data) {
                  data = data.data;
                  $scope.totalCount = data.count || 0;
                  if($scope.getCountFromOtherApi){
                    $scope.totalCount = totalCount;
                    
                  }
                  $scope.items = data.data;
                  if ($scope.items && $scope.items.length || $scope.totalCount!==0) {
                    $scope.isNoData = false;
                  } else {
                    $scope.isNoData = true;
                  }

                  if ($scope.formatData) {
                    $scope.formatData($scope.items, $scope.totalCount);
                  }
                }

                if($attrs.ngTableFixed) {
                  $scope.ngTableFixed = (+new Date()) + '';
                }
                
                $.loading(false, {
                  $container: $element,
                });
              },
              () => {
                $scope.totalCount = 0;
                $scope.items = [];
                $.loading(false, {
                  $container: $element,
                });
              }
            );
          };

          $rootScope.$on(
            '$stateChangeStart',
            (state, next, nextParam, current, currentParam) => {
              if($scope.disableStorage) {
                return;
              }
              try {
                let localStorageArray = [];

                let fromTableToInner = false,
                  fromInnerToTable = false,
                  fetchParamStorage = {};
                const matchedRouter = find(allRouterData, (router, i) => {
                  return (router.state === next.name && router.inNav === current.name)
                    || (router.state === current.name && router.inNav === next.name);
                });
                if (matchedRouter) {
                  fromTableToInner = matchedRouter.state === next.name && matchedRouter.inNav === current.name;
                  fromInnerToTable = matchedRouter.state === current.name && matchedRouter.inNav === next.name;
                }

                if (fromTableToInner) {
                  fetchParamStorage.currPage = $scope.currPage;
                }
                if (fromInnerToTable) {
                  localStorage.currPage = fetchParamStorage.currPage;
                }

                localStorage.fromInnerToTable = fromInnerToTable;
                fetchParamStorage.state = current.name;
                fetchParamStorage.fetchParamObj = JSON.stringify(
                  $scope.fetchParam
                );

                let foundState = false;
                if (localStorage.fetchParamList) {
                  localStorageArray = JSON.parse(localStorage.fetchParamList);
                  const matchedParam = find(localStorageArray, param => param.state === current.name);
                  if (matchedParam) {
                    matchedParam.fetchParamObj = fetchParamStorage.fetchParamObj;
                    matchedParam.currPage = fetchParamStorage.currPage;
                    foundState = true;
                  }
                }
                if (!foundState) {
                  localStorageArray.push(fetchParamStorage);
                }

                localStorage.fetchParamList = JSON.stringify(localStorageArray);
              } catch (e) {
                console.warn(e);
              }
            }
          );
        },

        controller($scope, $element, $attrs, $transclude, $log, $http) {},
      };
    },
  ]);
};
