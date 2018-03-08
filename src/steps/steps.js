/**
 * <directive>
 * @name Steps 步骤条
 * @description 步骤条
 * @date 2017-11-27
 * @author 田艳容
 * @lastBy 
 * @html <steps current-index="currentIndex" status-data="statusData" data-direction="y"></steps>
 */
import './steps.css';
export default (app, elem, attrs, scope) => {
        app.directive('steps', ['$timeout', function($timeout) {
            return {
                restrict: 'E',
                template:'<ul class="steps-box steps-box-x"><li ng-repeat="item in statusData"><i class="steps-box-dot">{{$index+1}}</i><span class="steps-box-name">{{item.name}}</span><span class="steps-box-description">{{item.description}}</span></li></ul>',
                replace: true,
                scope: {
                    //@scope currentIndex 指定当前步骤(从0开始) {type: "number", exampleValue:1}
                    currentIndex: '=',
                    //@scope statusData 指定步骤状态数组 {type: "object", exampleValue:[{name:"第一步","description":"请输入个人的信息"},{name:"第二步","description":"请输入公司的信息"},{name:"第三步","description":"请上传公司相关资料"}]}
                    statusData: '='
                },
                link: function($scope,$element,$attrs) {
                    
                },

                controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
                }
            };
        }]);
    };