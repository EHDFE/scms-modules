/**
 * <directive>
 * @description 单选框指令
 * @date 2016-12-22
 * @author 黄思飞
 * @lastBy 
 * @html <form-radio-directive radio-list="radioList" radio-model="radioModel" link-model="linkModel"></form-radio-directive>
 * @htmlUrl scmsModules/formRadio/formRadio.html
 */
import './formRadio.css';
import html from './formRadio.html';
export default (app, elem, attrs, scope) => {
        app.directive('formRadioDirective', ['$state', 'G', function($state, G) {
            return {
                template: html,
                restrict: 'EA',
                replace: false,
                scope: {
                    radioList: '=',//@scope radioList 选项数组 {type: "array",exampleValue: [{label:"Android",value:"Android",link: ["APK","ZIP"],checked:true},{label:"iOS",value:"iOS",link: ["IPA","ZIP"],checked:false}]}
                    radioModel: '=',//@scope radioModel 选中项的value {type: "string",exampleValue: "Android"}
                    linkModel: '='//@scope linkModel 选中项的value {type: "string",exampleValue: "APK"}
                },
                link: function($scope, $element, $attrs) {

                    
                },
               
                controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
                    $scope.addChecked = function(item){
                        if(item.disabled){
                            return;
                        }
                        angular.forEach($scope.radioList, function(radio){
                            if(item.label === radio.label){
                                radio.checked = true;
                            }else{
                                radio.checked = false;
                            }
                        });
                        $scope.radioModel = item.value;
                    };

                    function init(){
                        angular.forEach($scope.radioList, function(radio){
                            if(radio.checked === true){
                                $scope.radioModel = radio.value;
                            }
                        });
                    }

                    $scope.$watch('linkModel', function(newValue, oldValue){
                        if(!newValue){
                            return;
                        }
                        var index = 0,
                            hasCheckItem = false,
                            enableIndex = 0;

                        angular.forEach($scope.radioList, function(radio){
                            if(radio.link && radio.link.indexOf(newValue)<0){
                                radio.disabled = true;
                                radio.checked = false;
                            }else{
                                radio.disabled = false;
                                enableIndex = index;
                            }
                            if(radio.checked){
                                hasCheckItem = true;
                            }
                            index++;
                        });
                        if(!hasCheckItem && $scope.radioList && $scope.radioList[enableIndex]){
                            $scope.radioList[enableIndex].checked = true;
                            $scope.radioModel = $scope.radioList[enableIndex].value;
                        };
                    });

                    init();
                }
            };
        }]);
    }