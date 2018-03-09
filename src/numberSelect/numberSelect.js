/**
 * <directive>
 * @name progress 进度条
 * @description 进度条
 * @date 2017-06-21
 * @author 黄思飞
 * @lastBy 
 * @html <div progress-directive progress-status="progressStatus" reset="reset" style="width:80%"></div>
 */
export default (app, elem, attrs, scope) => {
        app.directive('numberSelect', [function($interval, $timeout) {
            return {
                template:'<select-dropdown drop-data="dropData" checked-item="checkedItem"></select-dropdown>',
                restrict: 'EA',
                replace: true,
                scope: {
                    ngModel: '=',    
                    start: '@',
                    end: '@',
                    step: '@'
                },
                compile: function($element,$attrs,transcludeFn) {
                   // console.log($element,$attrs,transcludeFn)
                },
                link: function($scope,$element,$attrs) {
                    
                },

                controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
                    $scope.dropData = [];
                    
                }
            };
        }]);
    };