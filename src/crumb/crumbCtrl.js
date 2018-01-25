define([
    'angular'
], function(
) {
    return function(app, elem, attrs, scope) {
        app.controller('crumbCtrl', ['$scope', 'navsData', '$rootScope', '$stateParams', '$state', async function($scope, navsDataPromise, $rootScope, $stateParams, $state) {
                var currCrumbs = [];
                var data = {};
                var params,paramString;
                var key;
                $scope.crumbs = [];

                let navsData = await navsDataPromise;

                var getCrumbs = function(data) {
                    var href = '',
                        nextParams = $scope.nextParams || $state.params;
                    angular.forEach(data, function(item) {
                        if(item.isChecked) {
                            if(item.level > 1 && item.href !== 'javascript:void(0);') {
                                if(item.href&&item.href.indexOf('?')>-1){
                                    $state.current;
                                    href = item.href.substring(item.href.indexOf('?')+6)
                                    if(nextParams&&nextParams.href===decodeURIComponent(href)){
                                        $scope.crumbs.push(item);
                                    }
                                }else{
                                    $scope.crumbs.push(item);
                                }
                            }
                            getCrumbs(item.children);
                        }
                    });
                };
                var getAllCrumbs = function(name, template) {
                    getCrumbs(navsData.data);
                    var currHref = '#/'+name.replace('.', '/'),
                        crumbsHref = $scope.crumbs[$scope.crumbs.length - 1]&&$scope.crumbs[$scope.crumbs.length - 1].href;
                    if(!$scope.crumbs || ($scope.crumbs && !$scope.crumbs.length)) {
                        return;
                    }
                    if(crumbsHref&&crumbsHref.indexOf('?')>-1){
                        crumbsHref = crumbsHref.substring(0,crumbsHref.indexOf('?'));
                    }
                    if(crumbsHref !== currHref && template) {
                        $scope.crumbs.push({
                            name: template.match(/[^\x00-\xff]+/g)[0]
                        });
                    };
                };

                getAllCrumbs($state.current.name, $state.current.template);

				$rootScope.$on('$stateChangeStart', function(event, next, nextParams) {
                    $scope.crumbs = [];
                    $scope.nextParams = nextParams;
                    getAllCrumbs(next.name, next.template);
                });
        }]);
    }
});