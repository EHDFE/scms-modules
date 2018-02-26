/**
 * <directive>
 * @name table 列表
 * @description 列表指令，获取列表数据，展示分页，展示无数据提示，之后会有排序等功能
 * @date 2016-12-01
 * @author 田艳容
 * @lastBy
 * @htmlUrl scmsModules/table/tableHtml.html
 */
define(
  [
    'angular',
    '../pagination/paginationDirective',
    '../errorNoData/errorNoDataDirective',
    './tableFixed'
  ],
  function(angular, paginationDirective, errorNoDataDirective, tableFixedDirective) {
    return function(app, elem, attrs, scope) {
      paginationDirective(app);
      errorNoDataDirective(app);
      tableFixedDirective(app);
      app.directive('tableDirective', [
        '$cookies',
        '$http',
        'G',
        'allRouterData',
        '$rootScope',
        '$state',
        '$timeout',
        function(
          $cookies,
          $http,
          G,
          allRouterData,
          $rootScope,
          $state,
          $timeout
        ) {
          return {
            template:
              '<div class="tablebox" ng-transclude></div><div ng-show="fixedTable" fixed-col="fixedPosition" table-fixed-directive></div><div ng-show="hasPagination"><div pagination-directive current-page="currPage" total-count="totalCount" page-size="pageSize" onchanged="fetch" hide-page-size="hidePageSize"></div></div><div error-no-data-directive show-by="isNoData"></div>',
            scope: {
              apiUrl: '=', //@scope apiUrl 依赖后端api接口地址 {type: "string",exampleValue: '/scms/scmsmodules/table/data.json'}
              fetch: '=', //@scope fetch 获取数据的函数 {type: "function"}
              items: '=', //@scope items 获得的items {type: "out-object"}
              pageSize: '=?', //@scope pageSize 每页显示个数 {type: "out-number"}
              currPage: '=?', //@scope currPage 当前页码 {type: "out-number"}
              fetchParam: '=', //@scope fetchParam 数据筛选的参数 {type: "object", "exampleValue": {keyword:"15810221572"}, defaultValue: {}}
              formatParam: '=', //@scope formatParam 格式化传入参数 {type: "callback", parentScopeValue: "console.log('格式化参数:',arguments);"}
              formatData: '=', //@scope formatData 格式化列表数据 {type: "function", parentScopeValue: "console.log('格式化数据:',arguments);"}
              disableStorage: '=', //@scope disableStorage 是否禁止从localStorage中获取搜索条件 {type: "boolean", exampleValue: "false"}
              delEmptyParam: '=', //@scope delEmptyParam 是否删除值为空字符串的请求参数 {type: "boolean", exampleValue: "false"}
              fixedTable: '=',
              fixedPosition: '@',
              domReady: '='
            },
            restrict: 'EA',
            transclude: true,
            link: function postLink($scope, $element, $attrs) {
              G = $;
              //@attrs method http类型 {type: "string", defaultValue: "post"}
              $element.css({
                position: 'relative',
                'min-height': '200px',
              });
              //@attrs isPagination 是否显示分页 {type: "string", defaultValue: "true"}
              $scope.hasPagination =
                $attrs.hasPagination === 'false' ? false : true;
              $scope.hidePageSize = $attrs.hidePageSize || false;
              $scope.currPage = $scope.currPage || 1;
              $scope.fetchParam = $scope.fetchParam || {};
              if (
                localStorage.fetchParamList &&
                !$scope.disableStorage &&
                localStorage.fromInnerToTable === 'true'
              ) {
                try {
                  var localStorageArray = JSON.parse(
                    localStorage.fetchParamList
                  );
                  angular.forEach(localStorageArray, function(param) {
                    if ($state.current.name === param.state) {
                      $timeout(function() {
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
                $scope.pageSize || parseInt($cookies['pageSize'], 10) || 15;
              $scope.fetch = function(options) {
                if (!$scope.apiUrl) {
                  return;
                }
                G.loading(true, {
                  $container: $element,
                });
                
                options = options || {};
                $scope.currPage = options.currPage || $scope.currPage;
                $scope.params = Object.assign({}, $scope.fetchParam);
                
                if ($scope.formatParam) {
                  $scope.formatParam($scope.params);
                }
                if ($scope.delEmptyParam) {
                  for (var key in $scope.params) {
                    if (
                      $scope.params[key] === '' ||
                      $scope.params[key] === undefined
                    ) {
                      delete $scope.params[key];
                    }
                  }
                }

                const pageParams = $scope.hasPagination ? {
                    pageSize: $scope.pageSize,
                    skipCount: ($scope.currPage - 1) * $scope.pageSize,
                } : {};

                $http({
                  url: $scope.apiUrl,
                  method: $attrs.method || 'post',
                  data: angular.extend({}, $scope.params, pageParams),
                  isDebug: $attrs.isDebug,
                  test: $attrs.test,
                }).then(
                  function(data) {
                    if (data && data.data) {
                      data = data.data;
                      $scope.totalCount = data.count || 0;
                      $scope.items = data.data;
                      if ($scope.items && $scope.items.length) {
                        $scope.isNoData = false;
                      } else {
                        $scope.isNoData = true;
                      }

                      if ($scope.formatData) {
                        $scope.formatData($scope.items, $scope.totalCount);
                      }
                    }
                    G.loading(false, {
                      $container: $element,
                    });
                  },
                  function() {
                    $scope.totalCount = 0;
                    $scope.items = [];
                    G.loading(false, {
                      $container: $element,
                    });
                  }
                );
              };

              $rootScope.$on('$stateChangeStart', function(
                state,
                next,
                nextParam,
                current,
                currentParam
              ) {
                try {
                  var localStorageArray = [];

                  var fromTableToInner = false,
                    fromInnerToTable = false,
                    fetchParamStorage = {};
                  angular.forEach(allRouterData, function(router) {
                    if (
                      router.state === next.name &&
                      router.inNav === current.name
                    ) {
                      fromTableToInner = true;
                    } else if (
                      router.state === current.name &&
                      router.inNav === next.name
                    ) {
                      fromInnerToTable = true;
                    }
                  });

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

                  var foundState = false;
                  if (localStorage.fetchParamList) {
                    localStorageArray = JSON.parse(localStorage.fetchParamList);
                    angular.forEach(localStorageArray, function(param) {
                      if (current.name === param.state) {
                        param.fetchParamObj = fetchParamStorage.fetchParamObj;
                        param.currPage = fetchParamStorage.currPage;
                        foundState = true;
                      }
                    });
                  }
                  if (!foundState) {
                    localStorageArray.push(fetchParamStorage);
                  }

                  localStorage.fetchParamList = JSON.stringify(
                    localStorageArray
                  );
                } catch (e) {
                  console.log(e);
                }
              });

              if($scope.fixedTable){
                $scope.domReady = function($last){
                  if($last){
                    $timeout(function(){
                      $rootScope.$broadcast('angularDomReady', $element);
                    });
                  }
                };
              }
            },

            controller: function(
              $scope,
              $element,
              $attrs,
              $transclude,
              $log,
              $http,
              G
            ) {},
          };
        },
      ]);
    };
  }
);
