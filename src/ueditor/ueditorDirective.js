import angular from 'angular';

export default async (app, elem, attrs, scope) => {
  await import('../../libs/ueditor/');
  app.directive('ueditorDirective', [
    'G',
    '$http',
    '$timeout',
    function(G, $http, $timeout) {
      return {
        template:
          '<div id="{{id}}" type="text/plain" style="width:100%;height:500px;"></div>',
        scope: {
          content: '=',
          ue: '=',
        },
        restrict: 'EA',
        replace: true,
        controller: function($scope, $element, $attrs) {
          /*UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
                    UE.Editor.prototype.getActionUrl = function(action) {
                        console.log(action,22222222222);
                        /*if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage' || action == 'uploadvideo') {
                            return '/goodstaxiAdmin/imagecs/uploadImage';
                        }else {
                            return this._bkGetActionUrl.call(this, action);
                        }*/
          //}
          $scope.id = +new Date() + '';
          $element[0].id = $scope.id;
          $scope.ue = UE.getEditor($scope.id);
  
          $scope.$watch('content', function(newValue, oldValue) {
            if (newValue && newValue != oldValue) {
              $scope.ue.ready(function() {
                $scope.ue.setContent(newValue, false);
              });
              /*UE.getEditor('editor').addListener("ready", function () {
                                // editor准备好之后才可以使用
                                UE.getEditor('editor').setContent(newValue, false);
                            });*/
            }
          });
        },
  
        link: function($scope, $element, $attrs, ngModel) {},
      };
    },
  ]);
};
