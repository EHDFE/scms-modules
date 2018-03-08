/**
 * <directive>
 * @description 生产二维码
 * @date 2017-04-20
 * @author 黄思飞
 * @lastBy 
 * @html <qrcode-directive url-address="urlAddress" ></qrcode-directive>
 */
export default (app, elem, attrs, scope) => {
        app.directive('qrcodeDirective', ['$http','$timeout', function($http, $timeout) {
            return {
                template: html,
                restrict: 'EA',
                replace: false,
                scope: {
                    list: '=',          //@scope list 搜索列表 {type: "array", "exampleValue": [{text:'第一项'},{text:'第二项'}]}
                    itemSelected: '=',  //@scope itemSelected 所选元素 {type: "string","exampleValue":""}
                    isOptional: '=',    //@scope isOptional 是否必填 {type: "boolean", "exampleValue": true}
                    isErrorInline: '=', //@scope isErrorInline 错误信息是否在同一行 {type: "boolean", "exampleValue": true}
                    searchFromApi: '=', //@scope searchFromApi 搜索列表是否从服务端获取 {type: "function"}
                    displayText: '@'    //@scope displayText 显示文本属性名 {type: "string", "exampleValue":"text"}
                },
                link: function($scope, $element, $attrs) {

                },
               
                controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
                    
                }
            }
        }])
    }
