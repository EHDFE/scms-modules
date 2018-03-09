/**
 * <directive>
 * @description 日期插件
 * @date 2017-12-06
 * @author 黄国标
 * @lastBy
 * @html <input class="form-control input-date" date-picker-directive ng-model='ngModel' min-date="minDate" max-date="maxDate" max-date-value="maxDateValue" min-date-value="minDateValue">
 */
define(
  ['angular', './datePanel.html', './datePanel.css'],
  (angular, html) => function (app, elem, attrs, scope) {
    app.directive('datePanel', [
      'G',
      '$rootScope',
      '$timeout',
      function (G, $rootScope, $timeout) {
        return {
          // require: '?ngModel',
          template: html,
          scope: {
            date: '=', // @scope ngModel 选择的日期 {type:"string", exampleValue:"2016-12-01",isDisabled:1}
            minDate: '=', // @scope minDate 最小可选日期 {type:"string", exampleValue:"2016-06-07"}
            maxDate: '=', // @scope maxDate 最大可选日期 {type:"string", exampleValue:"2017-06-29"}
            minDateValue: '=', // @scope minDateValue 最小可选日期,距今天天数 {type:"number"}
            maxDateValue: '=', // @scope maxDateValue 最大可选日期,距今天天数 {type:"number"}
            initDate: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
            useSeconds: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
            minViewMode: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
            pickTime: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
            formatDate: '=', // @scope initDate 初始日期,它的值为距今天的天数 {type:"number"}
            leftRange: '=',
            rightRange: '=',
            dateRangeData: '=',
            watchDate: '=',
          },
          controller: [
            '$scope',
            '$element',
            '$attrs',
            '$timeout',
            function ($scope, $element, $attrs, $timeout) {},
          ],
          link($scope, $element, $attrs, ngModel) {
            const formatDate = $scope.formatDate || 'YYYY-MM-DD';
            // @attrs initDate 初始日期字段,它的值为距今天的天数;当值为"null"时,input显示空值, {type:"string", defaultValue: 0}
            $scope.dateRange = $attrs.dateRange;
            let initDate = $scope.initDate;
            let newDate;
            if (initDate && initDate !== 'null') {
              initDate = initDate * 24 * 60 * 60 * 1000;
              newDate = +new Date() + initDate;
              newDate = new Date(newDate);
            } else if ($scope.date) {
              newDate = $scope.date;
            }
            $scope.showPanel = 'day';
            // $scope.useSeconds = !!$attrs.useSeconds;
            // $scope.minViewMode = $attrs.minViewMode;
            // $scope.pickTime = !!$attrs.pickTime;


            $scope.$watch('minViewMode', (newVal, oldVal) => {
              if (newVal === 'months') {
                $scope.showPanel = 'month';
              }
            });

            $scope.maxDateArr = {};
            $scope.minDateArr = {};

            function init(date) {
              $scope.dateData = {};
              $scope.dateData.year = moment(date).year();
              $scope.dateData.month = moment(date).month() + 1;
              $scope.dateData.date = moment(date).date();
              $scope.dateData.hour = moment(date).hour();
              $scope.dateData.minute = moment(date).minute();
              $scope.dateData.second = moment(date).second();
              setYearView($scope.dateData.year);
              setMonthView();
              setDateView(date);
              setHourView();
              setMinView();
              setSecondView();
            }

            const initYear = Array(...Array(12)).map((
              item,
              i,
            ) => i - 1);

            function getDecade(year) {
              return Math.floor(year / 10) * 10;
            }

            function setDateView(date) {
              if (!$scope.dateData.date) {
                $scope.dateData.date = moment().date();
              }
              const dateView = [];
              const startDate = moment(date).date(1).weekday(0);
              const month = moment(date).month();
              if ($scope.minDateArr.year, $scope.minDateArr.month, $scope.minDateArr.date) {
                dateView.prevMonth = moment([
                  $scope.minDateArr.year,
                  $scope.minDateArr.month - 1,
                  $scope.minDateArr.date,
                ]).valueOf() < moment(date).date(1).hour(0).minute(0)
                    .second(0)
                    .millisecond(0)
                    .valueOf();
              } else {
                dateView.prevMonth = true;
              }
              if ($scope.maxDateArr.year && $scope.maxDateArr.month && $scope.maxDateArr.date) {
                dateView.nextMonth = moment([
                  $scope.maxDateArr.year,
                  $scope.maxDateArr.month - 1,
                  $scope.maxDateArr.date,
                ]).valueOf() > moment(date).add(1, 'month').date(1).hour(0)
                    .minute(0)
                    .second(0)
                    .millisecond(0)
                    .valueOf();
              } else {
                dateView.nextMonth = true;
              }
              if ($scope.minDateArr.year, $scope.minDateArr.month, $scope.minDateArr.date) {
                dateView.prevYear = moment([
                  $scope.minDateArr.year,
                  $scope.minDateArr.month - 1,
                  $scope.minDateArr.date,
                ]).valueOf() < moment(date).add(-1, 'year').hour(0).minute(0)
                    .second(0)
                    .millisecond(0)
                    .valueOf();
              } else {
                dateView.prevYear = true;
              }
              if ($scope.maxDateArr.year && $scope.maxDateArr.month && $scope.maxDateArr.date) {
                dateView.nextYear = moment([
                  $scope.maxDateArr.year,
                  $scope.maxDateArr.month - 1,
                  $scope.maxDateArr.date,
                ]).valueOf() > moment(date).add(1, 'year').hour(0).minute(0)
                    .second(0)
                    .millisecond(0)
                    .valueOf();
              } else {
                dateView.nextYear = true;
              }
              for (let i = 0; i < 42; i++) {
                const nowDate = startDate.clone().add(i, 'day').hour(0).minute(0)
                  .second(0)
                  .millisecond(0);
                let tag = 'now';
                if (
                  nowDate.valueOf() < moment(date).date(1).hour(0).minute(0)
                    .second(0)
                    .millisecond(0)
                    .valueOf()
                ) {
                  tag = 'old';
                }
                if (
                  nowDate.valueOf() >=
                    moment(date).add(1, 'month').date(1).hour(0)
                      .minute(0)
                      .second(0)
                      .millisecond(0)
                      .valueOf()
                ) {
                  tag = 'new';
                }
                if (
                  nowDate.valueOf() ===
                    moment().hour(0).minute(0).second(0)
                      .millisecond(0)
                      .valueOf()
                ) {
                  tag = 'today';
                }
                if (!$scope.dateRange) {
                  if (
                    nowDate.valueOf() ===
                      moment([$scope.dateData.year, $scope.dateData.month - 1, $scope.dateData.date]).hour(0).minute(0).second(0)
                        .millisecond(0)
                        .valueOf()
                  ) {
                    tag = 'active';
                  }
                } else if ($scope.dateRangeData && (
                  ($scope.dateRangeData.start && (tag === 'now' || tag === 'today') && (nowDate.valueOf() ===
                        $scope.dateRangeData.start.hour(0).minute(0).second(0).millisecond(0)
                          .valueOf())) ||
                      ($scope.dateRangeData.end && (tag === 'now' || tag === 'today') && (nowDate.valueOf() ===
                        $scope.dateRangeData.end.hour(0).minute(0).second(0).millisecond(0)
                          .valueOf())))) {
                  tag = 'hover';
                }
                if ($scope.dateRange && $scope.tmpDate && (tag === 'now' || tag === 'today')) {
                  if (
                    nowDate.valueOf() ===
                      $scope.tmpDate.hour(0).minute(0).second(0).millisecond(0)
                        .valueOf()
                  ) {
                    tag = 'hover';
                  }
                }
                let range = false;
                if ($scope.dateRange && $scope.tmpDate && (tag === 'now' || tag === 'today')) {
                  if ($scope.dateRangeData && $scope.dateRangeData.start && !$scope.dateRangeData.end) {
                    if ((nowDate.valueOf() > $scope.dateRangeData.start.valueOf()) && (nowDate.valueOf() < $scope.tmpDate.valueOf())) {
                      range = true;
                    }
                    if ((nowDate.valueOf() < $scope.dateRangeData.start.valueOf()) && (nowDate.valueOf() > $scope.tmpDate.valueOf())) {
                      range = true;
                    }
                  }
                }
                if ($scope.dateRangeData && $scope.dateRangeData.start && $scope.dateRangeData.end && (tag === 'now' || tag === 'today')) {
                  if ((nowDate.valueOf() > $scope.dateRangeData.start.valueOf()) && (nowDate.valueOf() < $scope.dateRangeData.end.valueOf())) {
                    range = true;
                  }
                }

                if (nowDate.day() === 0) {
                  dateView.push([{
                    tag: tag || 'now',
                    value: nowDate.date(),
                    data: nowDate,
                    range,
                    disabled: moment([
                      $scope.minDateArr.year,
                      $scope.minDateArr.month - 1,
                      $scope.minDateArr.date,
                    ]).valueOf() > nowDate.valueOf() ||
                        moment([
                          $scope.maxDateArr.year,
                          $scope.maxDateArr.month - 1,
                          $scope.maxDateArr.date,
                        ]).valueOf() < nowDate.valueOf(),
                  }]);
                } else {
                  dateView[dateView.length - 1].push({
                    tag: tag || 'now',
                    value: nowDate.date(),
                    data: nowDate,
                    range,
                    disabled: moment([
                      $scope.minDateArr.year,
                      $scope.minDateArr.month - 1,
                      $scope.minDateArr.date,
                    ]).valueOf() > nowDate.valueOf() ||
                        moment([
                          $scope.maxDateArr.year,
                          $scope.maxDateArr.month - 1,
                          $scope.maxDateArr.date,
                        ]).valueOf() < nowDate.valueOf(),
                  });
                }
              }
              $scope.dateView = dateView;
            }

            $scope.setDate = function (momentDate) {
              if (!momentDate.disabled) {
                $scope.dateData.date = momentDate.data.date();
                $scope.dateData.month = momentDate.data.month() + 1;
                $scope.dateData.year = momentDate.data.year();
                if ($scope.dateRange) {
                  if ($scope.dateRangeData.start && $scope.dateRangeData.end ||
                      !$scope.dateRangeData.start && !$scope.dateRangeData.end) {
                    $scope.dateRangeData.start = momentDate.data;
                    $scope.dateRangeData.end = null;
                    $scope.$emit('refresh');
                  }
                  if ($scope.dateRangeData.start && !$scope.dateRangeData.end) {
                    if ($scope.dateRangeData.start && $scope.dateRangeData.start.valueOf() > momentDate.data.valueOf()) {
                      $scope.dateRangeData.end = $scope.dateRangeData.start.clone();
                      $scope.dateRangeData.start = momentDate.data;
                    } else if ($scope.dateRangeData.start && $scope.dateRangeData.start.valueOf() < momentDate.data.valueOf()) {
                      $scope.dateRangeData.end = momentDate.data;
                    } else {
                      $scope.dateRangeData.start = momentDate.data;
                    }
                  }
                }
                setDateView(momentDate.data);
                setMonthView();
                setYearView($scope.dateData.year);
                setHourView();
                setMinView();
                setSecondView();
              }
            };

            $scope.setPreMonth = function () {
              if ($scope.dateView.prevMonth) {
                let prevMonth;
                if ($scope.minDateArr.year && $scope.minDateArr.month && $scope.minDateArr.date) {
                  prevMonth = moment([$scope.dateData.year, $scope.dateData.month - 1, $scope.dateData.date]).add(-1, 'month').valueOf() >
                      moment([$scope.minDateArr.year, $scope.minDateArr.month - 1, $scope.minDateArr.date]).valueOf() ?
                    moment([$scope.dateData.year, $scope.dateData.month - 1, $scope.dateData.date]).add(-1, 'month') :
                    moment([$scope.minDateArr.year, $scope.minDateArr.month - 1, $scope.minDateArr.date]);
                } else {
                  prevMonth = moment([$scope.dateData.year, $scope.dateData.month - 1, $scope.dateData.date]).add(-1, 'month');
                }
                $scope.dateData.date = prevMonth.date();
                $scope.dateData.month = prevMonth.month() + 1;
                setMonthView();
                if (prevMonth.year() !== $scope.dateData.year) {
                  $scope.dateData.year = prevMonth.year();
                  setYearView($scope.dateData.year);
                }
                setDateView(prevMonth);
              }
            };
            $scope.setNextMonth = function () {
              if ($scope.dateView.nextMonth) {
                let nextMonth;
                if ($scope.maxDateArr.year && $scope.maxDateArr.month && $scope.maxDateArr.date) {
                  nextMonth = moment([$scope.dateData.year, $scope.dateData.month - 1, scope.dateData.date]).add(1, 'month').valueOf() <
                      moment([$scope.maxDateArr.year, $scope.maxDateArr.month - 1, $scope.maxDateArr.date]).valueOf() ?
                    moment([$scope.dateData.year, $scope.dateData.month - 1, $scope.dateData.date]).add(1, 'month') :
                    moment([$scope.maxDateArr.year, $scope.maxDateArr.month - 1, $scope.maxDateArr.date]);
                } else {
                  nextMonth = moment([$scope.dateData.year, $scope.dateData.month - 1, $scope.dateData.date]).add(1, 'month');
                }

                $scope.dateData.date = nextMonth.date();
                if ($scope.dateData.year !== nextMonth.year()) {
                  $scope.dateData.year = nextMonth.year();
                  setYearView($scope.dateData.year);
                }
                $scope.dateData.month = nextMonth.month() + 1;
                setMonthView();
                setDateView(nextMonth);
              }
            };


            // 月
            function monthMap(month) {
              const map = {
                1: '一',
                2: '二',
                3: '三',
                4: '四',
                5: '五',
                6: '六',
                7: '七',
                8: '八',
                9: '九',
                10: '十',
                11: '十一',
                12: '十二',
              };
              return map[month];
            }

            function setMonthView() {
              if (!$scope.dateData.month) {
                $scope.dateData.month = moment().month() + 1;
              }

              $scope.monthView = Array(...Array(12)).map((
                item,
                i,
              ) => {
                const thisMonth = i + 1;
                return {
                  data: thisMonth,
                  dataView: monthMap(thisMonth),
                  checked: thisMonth === $scope.dateData.month,
                  today: (($scope.dateData.year == moment().year()) && (i == moment().month())),
                  disabled: moment([
                    $scope.minDateArr.year,
                    $scope.minDateArr.month - 1,
                  ]).valueOf() >
                      moment([$scope.dateData.year, i]).valueOf() ||
                      moment([
                        $scope.maxDateArr.year,
                        $scope.maxDateArr.month - 1,
                      ]).valueOf() <
                      moment([$scope.dateData.year, i]).valueOf(),
                };
              });
              if ($scope.minDateArr.year && $scope.minDateArr.month) {
                $scope.monthView.prevYear = (moment([
                  $scope.minDateArr.year,
                  $scope.minDateArr.month - 1,
                ]).valueOf() < moment([$scope.dateData.year, 0]).valueOf());
              } else {
                $scope.monthView.prevYear = true;
              }
              if ($scope.maxDateArr.year && $scope.maxDateArr.month) {
                $scope.monthView.nextYear = moment([
                  $scope.maxDateArr.year,
                  $scope.maxDateArr.month - 1,
                ]).valueOf() > moment([$scope.dateData.year, 11]).valueOf();
              } else {
                $scope.monthView.nextYear = true;
              }
            }

            function setCanChooseYear() {
              if ($scope.minDateArr.year && $scope.minDateArr.month) {
                $scope.canChoosePrevYear = (moment([
                  $scope.minDateArr.year,
                  $scope.minDateArr.month - 1,
                ]).valueOf() < moment([$scope.dateData.year, 0]).valueOf());
              } else {
                $scope.canChoosePrevYear = true;
              }
              if ($scope.maxDateArr.year && $scope.maxDateArr.month) {
                $scope.canChooseNextYear = moment([
                  $scope.maxDateArr.year,
                  $scope.maxDateArr.month - 1,
                ]).valueOf() > moment([$scope.dateData.year, 11]).valueOf();
              } else {
                $scope.canChooseNextYear = true;
              }
            }

            $scope.setMonth = function (month) {
              if (!month.disabled) {
                $scope.dateData.month = month.data;
                setMonthView();
                setDateView(moment([$scope.dateData.year, $scope.dateData.month - 1]));
                if ($scope.minViewMode === 'months') {
                  return;
                }
                $scope.showPanel = 'day';
              }
            };

            $scope.setPreYear = function (type) {
              if (type === 'day' && !$scope.dateView.prevYear) {
                return;
              }
              if (!type && !$scope.monthView.prevYear) {
                return;
              }
              $scope.dateData.year -= 1;
              if ($scope.dateData.year === $scope.minDateArr.year) {
                $scope.dateData.month = $scope.dateData.month > $scope.minDateArr.month ? $scope.dateData.month : $scope.minDateArr.month;
              }
              $scope.yearView = $scope.dateData.year;
              setYearView($scope.dateData.year);
              setMonthView();
              setDateView(moment([$scope.dateData.year, $scope.dateData.month - 1, 1]));
            };
            $scope.setNextYear = function (type) {
              if (type === 'day' && !$scope.dateView.nextYear) {
                return;
              }
              if (!type && !$scope.monthView.nextYear) {
                return;
              }
              $scope.dateData.year += 1;
              if ($scope.dateData.year === $scope.maxDateArr.year) {
                $scope.dateData.month = $scope.dateData.month < $scope.maxDateArr.month ? $scope.dateData.month : $scope.maxDateArr.month;
              }
              $scope.yearView = $scope.dateData.year;
              setYearView($scope.dateData.year);
              setMonthView();
              setDateView(moment([$scope.dateData.year, $scope.dateData.month - 1, 1]));
            };

            // 年
            function setYearView(year) {
              var year = year || moment().year();
              if (!$scope.dateData.year) {
                $scope.dateData.year = moment().year();
              }
              const decade = getDecade(year);
              $scope.yearView = initYear.map((data, index) => {
                const thisYear = data + decade;
                return {
                  data: thisYear,
                  checked: $scope.dateData && $scope.dateData.year === thisYear,
                  disabled: thisYear < $scope.minDateArr.year ||
                      thisYear > $scope.maxDateArr.year,
                };
              });
            }

            $scope.setPreDecade = function () {
              if (!$scope.yearView[0].disabled) {
                setYearView($scope.yearView[0].data - 1);
              }
            };
            $scope.setNextDecade = function () {
              if (!$scope.yearView[11].disabled) {
                setYearView($scope.yearView[11].data + 1);
              }
            };


            $scope.setYear = function (year) {
              if (!year.disabled) {
                $scope.dateData.year = year.data;
                setYearView(year.data);
                if ($scope.dateData.year === $scope.minDateArr.year && $scope.dateData.month < $scope.minDateArr.month) {
                  $scope.dateData.month = $scope.minDateArr.month;
                }
                if ($scope.dateData.year === $scope.maxDateArr.year && $scope.dateData.month > $scope.maxDateArr.month) {
                  $scope.dateData.month = $scope.maxDateArr.month;
                }
                setMonthView();
                $scope.showPanel = 'month';
              }
            };

            function setMinDate(date) {
              const time = moment(date);
              $scope.minDateArr = {
                year: time.year(),
                month: time.month() + 1,
                date: time.date(),
                hour: time.hour(),
                minute: time.minute(),
                second: time.second(),
              };
            }

            function setMaxDate(date) {
              const time = moment(date);
              $scope.maxDateArr = {
                year: time.year(),
                month: time.month() + 1,
                date: time.date(),
                hour: time.hour(),
                minute: time.minute(),
                second: time.second(),
              };
            }

            $scope.$watch('minDate', (newValue, oldValue) => {
              if (!newValue) {
                return;
              }
              const initTime = '00:00:00';
              if (newValue.length > 11) {
                newValue += initTime.slice(newValue.length - 11);
              }
              setMinDate(newValue);
              init(getResult());
            });
            $scope.$watch('maxDate', (newValue, oldValue) => {
              if (!newValue) {
                return;
              }
              const initTime = '23:59:59';
              if (newValue.length > 11) {
                newValue += initTime.slice(newValue.length - 11);
              }
              setMaxDate(newValue);
              init(getResult());
            });
            $scope.$watch('minDateValue', (newValue, oldValue) => {
              if (!newValue) {
                return;
              }
              setMinDate(getDate($scope.minDateValue));
              init(getResult());
            });
            $scope.$watch('maxDateValue', (newValue, oldValue) => {
              if (!newValue) {
                return;
              }
              setMaxDate(getDate($scope.maxDateValue));
              init(getResult());
            });

            function getDate(date) {
              date = parseInt(date, 10);
              if (typeof date === 'number') {
                date = date * 24 * 60 * 60 * 1000;
                const newDateA = +new Date() + date;
                return new Date(newDateA);
              } else if (date) {
                return date;
              }
            }

            function setHourView() {
              if (!$scope.dateData.hour) {
                $scope.dateData.hour = moment().hour();
              }
              $scope.hourView = Array(...Array(24)).map((
                item,
                i,
              ) => ({
                value: (i / 100)
                  .toFixed(2)
                  .toString()
                  .slice(2),
                active: i === Number($scope.dateData.hour),
                disabled: moment([
                  $scope.minDateArr.year,
                  $scope.minDateArr.month - 1,
                  $scope.minDateArr.date,
                  $scope.minDateArr.hour,
                ]).valueOf() >
                      moment([
                        $scope.dateData.year,
                        $scope.dateData.month - 1,
                        $scope.dateData.date,
                        i,
                      ]).valueOf() ||
                      moment([
                        $scope.maxDateArr.year,
                        $scope.maxDateArr.month - 1,
                        $scope.maxDateArr.date,
                        $scope.maxDateArr.hour,
                      ]).valueOf() <
                      moment([
                        $scope.dateData.year,
                        $scope.dateData.month - 1,
                        $scope.dateData.date,
                        i,
                      ]).valueOf(),
              }));
            }

            function setMinView() {
              if (!$scope.dateData.minute) {
                $scope.dateData.minute = moment().minute();
              }
              $scope.minView = Array(...Array(60)).map((
                item,
                i,
              ) => ({
                value: (i / 100)
                  .toFixed(2)
                  .toString()
                  .slice(2),
                active: i === Number($scope.dateData.minute),
              }));
            }

            function setSecondView() {
              if (!$scope.dateData.second) {
                $scope.dateData.second = moment().second();
              }
              $scope.secondView = Array(...Array(60)).map((
                item,
                i,
              ) => ({
                value: (i / 100)
                  .toFixed(2)
                  .toString()
                  .slice(2),
                active: i === Number($scope.dateData.second),
              }));
            }

            $scope.setHour = function (hour) {
              if (!hour.disabled) {
                $scope.dateData.hour = hour.value;
                setHourView();
              }
            };
            $scope.setMinute = function (minute) {
              if (!minute.disabled) {
                $scope.dateData.minute = minute.value;
                setMinView();
              }
            };
            $scope.setSecond = function (second) {
              if (!second.disabled) {
                $scope.dateData.second = second.value;
                setSecondView();
              }
            };


            $scope.hover = (col) => {
              if ($scope.dateRange && $scope.dateRangeData.start && !$scope.dateRangeData.end) {
                if ($scope.tmpDate && $scope.tmpDate.valueOf() === col.data.valueOf()) {
                  return;
                }
                $scope.tmpDate = col.data;
                // setDateView(getResult());
                $scope.$emit('refresh', $scope.tmpDate);
              }
            };
            $scope.mouseleave = () => {
              if ($scope.dateRange) {
                $timeout(() => {
                  $scope.tmpDate = null;
                  $scope.$emit('refresh');
                });
              }
            };
            init(newDate);

            function getResult() {
              return moment()
                .set('year', $scope.dateData.year || moment().year())
                .set('month', typeof $scope.dateData.month === 'number' ? ($scope.dateData.month - 1) : moment().month())
                .set('date', $scope.dateData.date || moment().date())
                .set('hour', $scope.dateData.hour || moment().hour())
                .set('minute', $scope.dateData.minute || moment().minute())
                .set('second', $scope.dateData.second || moment().second())
                .format($scope.formatDate || 'YYYY-MM-DD');
            }
            if (initDate !== 'null' && initDate || initDate === 0) {
              $timeout(() => {
                $scope.date = getResult();
              });
            } else {
              $scope.date = '';
            }

            $scope.$on('refreshDate', (e, data) => {
              $scope.tmpDate = data;
              setDateView(getResult());
            });

            function showArrow() {
              if ($attrs.part === 'left' && $scope.watchDate) {
                if (moment($scope.date).add(1, 'month').year() === moment($scope.watchDate).year() && moment($scope.date).add(1, 'month').month() === moment($scope.watchDate).month()) {
                  $scope.hideMonthRight = true;
                } else {
                  $scope.hideMonthRight = false;
                }
                if (moment($scope.date).add(1, 'year').valueOf() > moment($scope.watchDate).valueOf()) {
                  $scope.hideYearRight = true;
                } else {
                  $scope.hideYearRight = false;
                }
              }
              if ($attrs.part === 'right' && $scope.watchDate) {
                if (moment($scope.date).year() === moment($scope.watchDate).add(1, 'month').year() && moment($scope.date).month() === moment($scope.watchDate).add(1, 'month').month()) {
                  $scope.hideMonthLeft = true;
                } else {
                  $scope.hideMonthLeft = false;
                }
                if (moment($scope.date).valueOf() < moment($scope.watchDate).add(1, 'year').valueOf()) {
                  $scope.hideYearLeft = true;
                } else {
                  $scope.hideYearLeft = false;
                }
              }
            }

            $scope.$watch('watchDate', (newVal) => {
              if ($scope.dateRange) {
                showArrow();
              }
            });
            $scope.$watch('dateData', (newVal) => {
              if ($scope.dateRange) {
                $scope.date = getResult();
                showArrow();
              }
            }, true);

            $scope.$watch('date', (newVal) => {
              // console.log(newVal, $attrs.name, '@#$%^&*')
            });

            $scope.$on('init', () => {
              $timeout(() => {
                let newDate;
                if ($scope.date) {
                  newDate = $scope.date;
                } else if (initDate && initDate !== 'null') {
                  initDate = initDate * 24 * 60 * 60 * 1000;
                  newDate = +new Date() + initDate;
                  newDate = new Date(newDate);
                }
                init(newDate);
              });
            });
            $scope.$on('selectTime', () => {
              $timeout(() => {
                $scope.date = getResult();
              }, 500);
            });
          },
        };
      },
    ]);
  },
);
