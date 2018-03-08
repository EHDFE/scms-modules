import paginationDirective from '../pagination/paginationDirective';
import versionUpgradeLogService from './versionUpgradeLogService';
import html from'./versionUpgradeLog.html';
export default (app, elem, attrs, scope) => {
            paginationDirective(app, elem, attrs, scope);
            versionUpgradeLogService(app, elem, attrs, scope);
            app.directive('versionUpgradeLogDirective', ['G', 'versionUpgradeLogService', function(G, service) {
                return {
                    template: html,
                    restrict: 'EA',
                    replace: true,
                    scope: {
                    },
                    link: function postLink($scope, $element, $attrs) {

                    },
                    controller: function($scope, $element, $attrs, $transclude,$timeout, $log, $http, G) {
                        $scope.versionUpgradeLog = formatData(G.userInfo.versionUpgrade);
                        $scope.totalCount = G.userInfo.UpgradeProjectCount;
                        $scope.pageSize = 4;
                        $scope.currentPage = 1;
                        var param = G.userInfo.fetchParam;
                        $scope.closeDialog = function(){
                            $('#versionUpgradeLog').modal('hide');
                        };
                        if(param){
                            $scope.fetch = function(){
                                service.queryVersionManageList({
                                    orderbyitem: param.orderbyitem,
                                    status: '1',
                                    datestart: param.datestart,
                                    dateend: param.dateend,
                                    skipCount: ($scope.currentPage - 1) * 4,
                                    pageSize: 4
                                }).then(function(data){
                                    $scope.versionUpgradeLog = formatData(data.data.data);
                                });
                            };
                        }

                        $('#versionUpgradeLog').on('hide.bs.modal', function(){
                            service.updateRbacUser({
                                ehdrbacusersid: G.userInfo.ehdrbacusersid,
                                lastlogindate: G.formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss'),
                                logindate: G.formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss')
                            }).then(function(data){
                                
                            });
                        });

                        function formatData(items){
                            angular.forEach(items, function(item){
                                item.description = item.description.replace(/\n/g, '<br>')
                            });
                            return items;
                        };
                    }
                };
            }]);
        }