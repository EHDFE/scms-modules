/**
 * <directive>
 * @description 日期插件
 * @date 2016-09-20
 * @author 田艳容
 * @lastBy
 * @html <input class="form-control input-date" date-picker-directive ng-model='ngModel' min-date="minDate" max-date="maxDate" max-date-value="maxDateValue" min-date-value="minDateValue">
 */
export default (app, elem, attrs, scope) => {
  app.directive('datePickerDirective', [
    'G',
    '$rootScope',
    function (G, $rootScope) {
      return {
        require: '?ngModel',
        scope: {
          ngModel: '=', // @scope ngModel 选择的日期 {type:"string", exampleValue:"2016-12-01",isDisabled:1}
          minDate: '=', // @scope minDate 最小可选日期 {type:"string", exampleValue:"2016-06-07"}
          maxDate: '=', // @scope maxDate 最大可选日期 {type:"string", exampleValue:"2017-06-29"}
          minDateValue: '=', // @scope minDateValue 最小可选日期,距今天天数 {type:"number"}
          maxDateValue: '=', // @scope maxDateValue 最大可选日期,距今天天数 {type:"number"}
          initDate: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
        },
        controller: [
          '$scope',
          '$element',
          '$attrs',
          function ($scope, $element, $attrs) {
            const formatDate = $attrs.formatDate || 'YYYY-MM-DD';
            // @attrs initDate 初始日期字段,它的值为距今天的天数;当值为"null"时,input显示空值, {type:"string", defaultValue: 0}

            let initDate = $scope.initDate || $attrs.initDate || 0;
            let newDate;
            if (initDate && initDate !== 'null') {
              initDate = initDate * 24 * 60 * 60 * 1000;
              newDate = +new Date() + initDate;
              newDate = new Date(newDate);
            } else if ($scope.ngModel) {
              newDate = $scope.ngModel;
            }

            const getDate = function (date) {
              date = parseInt(date, 10);
              date = date * 24 * 60 * 60 * 1000;
              const newDateA = +new Date() + date;
              return new Date(newDateA);
            };

            $element.datetimepicker({
              pickTime: !!$attrs.pickTime,
              format: formatDate,
              useSeconds: !!$attrs.useSeconds,
              language: 'zh-cn',
              minViewMode: $attrs.minViewMode,
              minDate:
                  typeof $scope.minDateValue === 'number'
                    ? getDate($scope.minDateValue)
                    : $scope.minDate || undefined,
              maxDate: $scope.maxDateValue
                ? getDate($scope.maxDateValue)
                : $scope.maxDate || undefined,
            });

            $rootScope.$on('$stateChangeStart', (event, next, curr) => {
              if (
                $element.data('DateTimePicker') &&
                  $element.data('DateTimePicker').hide
              ) {
                $element.data('DateTimePicker').hide();
              }
            });

            $element.data('DateTimePicker').setDate(newDate);

            $scope.$watch('minDate', (newValue, oldValue) => {
              if (!newValue || !$element.data('DateTimePicker')) {
                return;
              }
              const initTime = '00:00:00';
              if (newValue.length > 11) {
                newValue += initTime.slice(newValue.length - 11);
              }
              $element.data('DateTimePicker').setMinDate(newValue);
            });
            $scope.$watch('maxDate', (newValue, oldValue) => {
              if (!newValue || !$element.data('DateTimePicker')) {
                return;
              }
              const initTime = '23:59:59';
              if (newValue.length > 11) {
                newValue += initTime.slice(newValue.length - 11);
              }
              $element.data('DateTimePicker').setMaxDate(newValue);
            });
            $scope.$watch('minDateValue', (newValue, oldValue) => {
              if (!newValue || !$element.data('DateTimePicker')) {
                return;
              }
              $element
                .data('DateTimePicker')
                .setMinDate(getDate($scope.minDateValue));
            });
            $scope.$watch('maxDateValue', (newValue, oldValue) => {
              if (!newValue || !$element.data('DateTimePicker')) {
                return;
              }
              $element
                .data('DateTimePicker')
                .setMaxDate(getDate($scope.maxDateValue));
            });
            if (initDate !== 'null') {
              $scope.ngModel = moment(newDate).format(formatDate);
            }
          },
        ],
      };
    },
  ]);
};
