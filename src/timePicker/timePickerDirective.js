/**
 * <directive>
 * @description 时间插件
 * @date 2017-4-12
 * @author 程乐
 * @lastBy
 * @html <input class="form-control input-time" time-picker-directive ng-model='ngModel' now-time="true">
 */
export default (app, elem, attrs, scope) => {
  app.directive('timePickerDirective', ['G', '$rootScope', function (G, $rootScope) {
    return {
      require: '?ngModel',
      scope: {
        ngModel: '=',
        nowTime: '=',
      },
      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
        if (!$scope.nowTime) {
          $scope.nowTime = false;
        }
        if ($scope.nowTime) {
          var formatTime = 'HH:00';
        } else {
          var formatTime = 'HH:mm';
        }

        // var newDate = $scope.ngModel;

        $element.datetimepicker({
          format: formatTime,
        }).each(function () {
          $(this).data('DateTimePicker').widget.find('.picker-switch a.btn').click().hide();
        });

        $rootScope.$on('$stateChangeStart', (event, next, curr) => {
          if ($element.data('DateTimePicker') && $element.data('DateTimePicker').hide) {
            $element.data('DateTimePicker').hide();
          }
        });

        // $element.data("DateTimePicker").setDate(newDate);


        // $scope.$watch('minTime', function(newValue, oldValue) {
        //     if(!newValue || !$element.data("DateTimePicker")) {
        //         return;
        //     }
        //     $element.data("DateTimePicker").minDate(newValue);
        // });
        // $scope.$watch('maxTime', function(newValue, oldValue) {
        //     if(!newValue || !$element.data("DateTimePicker")) {
        //         return;
        //     }
        //     $element.data("DateTimePicker").maxDate(newValue);
        // });
      }],
      link($scope, $element, $attrs, ngModel) {

      },

    };
  }]);
};
