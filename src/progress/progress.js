/**
 * <directive>
 * @name progress 进度条
 * @description 进度条
 * @date 2017-06-21
 * @author 黄思飞
 * @lastBy 
 * @html <div progress-directive progress-status="progressStatus" reset="reset" style="width:80%"></div>
 */
import './progress';
export default (app, elem, attrs, scope) => {
        app.directive('progressDirective', ['$interval', '$timeout',
            function($interval, $timeout) {
            return {
                template: '<div class="scms-progress-outer">' +
                              '<div class="scms-progress-inner">' +
                                  '<div class="scms-progress-bg" ng-class="{\'start\': \'scms-progress-bg-loading\', \'finish\': \'scms-progress-bg-success\', \'fail\': \'scms-progress-bg-fail\'}[progressStatus]" ng-style="progressStyle">' +
                                  '</div>' +
                                  '<i class="fa progress-icon" ng-if="progressStatus" ng-class="{\'start\': \'progress-icon-loading fa-spinner fa-spin\', \'finish\': \'progress-icon-success fa-check-circle\', \'fail\': \'progress-icon-fail fa-close\'}[progressStatus]"></i>' +
                              '</div>' +
                           '</div>',
                restrict: 'EA',
                replace: true,
                scope: {
                    progressStatus: '=',    //@scope progressStatus 进度条进度:start、finish {type: "string", "exampleValue": "start", defaultValue: "start"}
                    reset: '='              //@scope reset 重置进度条 {type: "function"}
                },
                link: function postLink($scope,$element,$attrs) {
                    $scope.$watch('progressStatus', function(newValue, oldValue){
                        if(newValue==='start'){
                            $scope.progressStyle = {
                                width: '5%',
                                height: '8px'
                            };
                            $timeout(function(){
                                $scope.progressStyle = {
                                    width: '90%',
                                    height: '8px'
                                };
                            });
                        }
                        if(newValue==='finish' || newValue==='fail'){
                            $scope.progressStyle = {
                                width: '100%',
                                height: '8px'
                            };
                        }
                    });

                    $scope.reset = function(){
                        $scope.progressStatus = '';
                        $scope.progressStyle = {};
                    };
                },

                controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
                }
            };
        }]);
    };