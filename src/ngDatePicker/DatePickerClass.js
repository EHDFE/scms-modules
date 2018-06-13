import moment from 'moment';
import momentLocale from 'moment/locale/zh-cn.js';

const initYear = Array(...Array(12)).map((item, i) => i - 1);

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

let G = {};

class DatePicker {
  constructor(args) {
    Object.assign(this, args);
    this.maxDateArr = {};
    this.minDateArr = {};
    this.dateData = {};
    this.showPanel = 'day';
    this.checkedData = {};
    this.isCalender = args.isCalender;
    this.moment = moment;
    this.startDay = 0;//开始天（一周的周几）
    this.weekDayNames = ['日','一','二','三','四','五','六'];
  }
  
  init(date) {
    let formatDate;
    formatDate = this.formatDate || (this.timePick ? 'HH:mm:ss' : 'YYYY-MM-DD');
    
    this.dateData = {};
    this.dateData.year = moment(date, formatDate).year();
    this.dateData.month = moment(date, formatDate).month() + 1;
    this.dateData.date = moment(date, formatDate).date();
    this.dateData.hour = moment(date, formatDate).hour();
    this.dateData.minute = moment(date, formatDate).minute();
    this.dateData.second = moment(date, formatDate).second();
    this.setYearView(this.dateData.year);
    this.setMonthView();
    this.setDateView(date);
    this.setHourView();
    this.setMinView();
    this.setSecondView();
  }
  monthMap(month) {
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
  setYearView(year) {
    if (!this.dateData.year) {
      this.dateData.year = moment().year();
    }
    year = year || moment().year();
    const decade = Math.floor(year / 10) * 10;
    this.yearView = initYear.map((data, index) => {
      const thisYear = data + decade;
      return {
        data: thisYear,
        checked: this.dateData && this.dateData.year === thisYear,
        disabled: thisYear < this.minDateArr.year ||
          thisYear > this.maxDateArr.year,
      };
    });
  }
  setPreDecade() {
    if (!this.yearView[0].disabled) {
      this.setYearView(this.yearView[0].data - 1);
      this.setTitleStatus();
    }
  }
  setNextDecade() {
    if (!this.yearView[11].disabled) {
      this.setYearView(this.yearView[11].data + 1);
      this.setTitleStatus();
    }
  }
  setYear(year) {
    if (!year.disabled) {
      this.dateData.year = year.data;
      this.setYearView(year.data);
      if (
        this.dateData.year === this.minDateArr.year &&
        this.dateData.month < this.minDateArr.month
      ) {
        this.dateData.month = this.minDateArr.month;
      }
      if (
        this.dateData.year === this.maxDateArr.year &&
        this.dateData.month > this.maxDateArr.month
      ) {
        this.dateData.month = this.maxDateArr.month;
      }
      this.setMonthView();
      this.showPanel = 'month';
      this.setTitleStatus();
    }
  }
  setMonthView() {
    if (!this.dateData.month) {
      this.dateData.month = moment().month() + 1;
    }
    this.monthView = Array(...Array(12)).map((item, i) => {
      const thisMonth = i + 1;
      return {
        data: thisMonth,
        year: this.dateData.year,
        dataView: this.monthMap(thisMonth),
        checked: thisMonth === this.dateData.month,
        today: this.dateData.year == moment().year() &&
          i == moment().month(),
        disabled: moment([
          this.minDateArr.year,
          this.minDateArr.month - 1,
        ]).valueOf() > moment([this.dateData.year, i]).valueOf() ||
          moment([
            this.maxDateArr.year,
            this.maxDateArr.month - 1,
          ]).valueOf() < moment([this.dateData.year, i]).valueOf(),
      };
    });
    if (this.minDateArr.year && this.minDateArr.month) {
      this.monthView.prevYear =
        moment([
          this.minDateArr.year,
          this.minDateArr.month - 1,
        ]).valueOf() < moment([this.dateData.year, 0]).valueOf();
    } else {
      this.monthView.prevYear = true;
    }
    if (this.maxDateArr.year && this.maxDateArr.month) {
      this.monthView.nextYear =
        moment([
          this.maxDateArr.year,
          this.maxDateArr.month - 1,
        ]).valueOf() > moment([this.dateData.year, 11]).valueOf();
    } else {
      this.monthView.nextYear = true;
    }
  }
  setMonth(month) {
    if (!month.disabled) {
      this.dateData.month = month.data;
      this.setMonthView();
      this.setDateView(moment([this.dateData.year, this.dateData.month - 1]));
      if (this.minViewMode === 'months') {
        return;
      }
      this.showPanel = 'day';
    }
  }

  setDateView(date) {
    if (!this.dateData.date) {
      this.dateData.date = moment().date();
    }
    if (this.timePick) {
      return;
    }
    const dateView = [];
    const startDate = moment(date)
      .date(1)
      .weekday(0);
    const month = moment(date).month();
    if (
      (this.minDateArr.year &&
        this.minDateArr.month &&
        this.minDateArr.date)
    ) {
      dateView.prevMonth =
        moment([
          this.minDateArr.year,
          this.minDateArr.month - 1,
          this.minDateArr.date,
        ]).valueOf() <
        moment(date).date(1).hour(0).minute(0)
          .second(0)
          .millisecond(0)
          .valueOf();
    } else {
      dateView.prevMonth = true;
    }
    if (
      this.maxDateArr.year &&
      this.maxDateArr.month &&
      this.maxDateArr.date
    ) {
      dateView.nextMonth =
        moment([
          this.maxDateArr.year,
          this.maxDateArr.month - 1,
          this.maxDateArr.date,
        ]).valueOf() >
        moment(date).add(1, 'month').date(1).hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .valueOf();
    } else {
      dateView.nextMonth = true;
    }
    if (
      (this.minDateArr.year,
        this.minDateArr.month,
        this.minDateArr.date)
    ) {
      dateView.prevYear =
        moment([
          this.minDateArr.year,
          this.minDateArr.month - 1,
          this.minDateArr.date,
        ]).valueOf() <
        moment(date)
          .add(-1, 'year')
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .valueOf();
    } else {
      dateView.prevYear = true;
    }
    if (
      this.maxDateArr.year &&
      this.maxDateArr.month &&
      this.maxDateArr.date
    ) {
      dateView.nextYear =
        moment([
          this.maxDateArr.year,
          this.maxDateArr.month - 1,
          this.maxDateArr.date,
        ]).valueOf() >
        moment(date)
          .add(1, 'year')
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .valueOf();
    } else {
      dateView.nextYear = true;
    }

    let minMomentValue = (this.dateRange || this.weekPick) ? this.minDateArr.data && this.minDateArr.data.valueOf() :
        moment([this.minDateArr.year, this.minDateArr.month - 1, this.minDateArr.date]).valueOf(),
      maxMomentValue = (this.dateRange || this.weekPick) ? this.maxDateArr.data && this.maxDateArr.data.valueOf() :
        moment([this.maxDateArr.year, this.maxDateArr.month - 1, this.maxDateArr.date]).valueOf(),
      weekPickStartValue = this.weekPickerData.start && this.weekPickerData.start.valueOf(),
      weekPickEndValue = this.weekPickerData.end && this.weekPickerData.end.clone().hour(0).minute(0).second(0)
        .millisecond(0)
        .valueOf();

    for (let i = this.startDay-1; i < (41+this.startDay); i++) {
      let isToday = false;
      const nowDate = startDate
        .clone()
        .add(i, 'day')
        .hour(0)
        .minute(0)
        .second(0)
        .millisecond(0);
      let tag = 'now';
      if (
        nowDate.valueOf() <
        moment(date)
          .date(1)
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .valueOf()
      ) {
        tag = 'old';
      }
      if (
        nowDate.valueOf() >=
        moment(date)
          .add(1, 'month')
          .date(1)
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .valueOf()
      ) {
        tag = 'new';
      }
      if (
        nowDate.valueOf() ===
        moment()
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0)
          .valueOf() &&
        (tag !== 'new' && tag !== 'old')
      ) {
        tag = 'today';
        isToday = true;
      }

      if (this.dateRange) {
        if (
          this.dateRangeData &&
          ((this.dateRangeData.start &&
              (tag === 'now' || tag === 'today') &&
              nowDate.valueOf() ===
              this.dateRangeData.start
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
                .valueOf()) ||
            (this.dateRangeData.end &&
              (tag === 'now' || tag === 'today') &&
              nowDate.valueOf() ===
              this.dateRangeData.end
                .hour(0)
                .minute(0)
                .second(0)
                .millisecond(0)
                .valueOf()))
        ) {
          tag = 'hover';
        }
      } else if (this.weekPick) {

      } else if (
        date && !this.isCalender && 
        nowDate.valueOf() ===
          moment([
            this.dateData.year,
            this.dateData.month - 1,
            this.dateData.date,
          ])
            .hour(0)
            .minute(0)
            .second(0)
            .millisecond(0)
            .valueOf()
      ) {
        tag = 'active';
      }
      if (
        this.dateRange &&
        this.tmpDate &&
        (tag === 'now' || tag === 'today')
      ) {
        if (
          nowDate.valueOf() ===
          this.tmpDate
            .hour(0)
            .minute(0)
            .second(0)
            .millisecond(0)
            .valueOf()
        ) {
          tag = 'hover';
        }
      }

      //时间范围为中间日期设置属性
      let range = false;
      let rangeTag = '';
      if(this.dateRange) {
        if(this.dateRangeData && this.dateRangeData.start && !this.dateRangeData.end && this.tmpDate && !(tag === 'old' || tag === 'new')) {
          if (
            nowDate.valueOf() > this.dateRangeData.start.valueOf() &&
            nowDate.valueOf() < this.tmpDate.valueOf()
          ) {
            range = true;
          }
          if (
            nowDate.valueOf() < this.dateRangeData.start.valueOf() &&
            nowDate.valueOf() > this.tmpDate.valueOf()
          ) {
            range = true;
          }
        }
        else if(this.dateRangeData && this.dateRangeData.start && this.dateRangeData.end && !(tag === 'old' || tag === 'new')) {
          if (
            nowDate.valueOf() > this.dateRangeData.start.valueOf() &&
            nowDate.valueOf() < this.dateRangeData.end.valueOf()
          ) {
            range = true;
          }
          if(nowDate.valueOf() === this.dateRangeData.start.valueOf() && nowDate.valueOf() === this.dateRangeData.end.valueOf()) {
            rangeTag = '';
          }
          else if(nowDate.valueOf() === this.dateRangeData.start.valueOf()){
            rangeTag = 'start';
          }
          else if(nowDate.valueOf() === this.dateRangeData.end.valueOf()) {
            rangeTag = 'end';
          }
        }
      }

      let weekStart,
        weekBetween,
        weekEnd;
      if (this.weekPick) {
        if (nowDate.valueOf() === weekPickStartValue) {
          weekStart = true;
        } else if ((nowDate.valueOf() > weekPickStartValue) && (nowDate.valueOf() < weekPickEndValue)) {
          weekBetween = true;
        } else if (nowDate.valueOf() === weekPickEndValue) {
          weekEnd = true;
        }
      }
      
      if (nowDate.day() === this.startDay) {
        dateView.push([{
          isToday: isToday,
          tag: tag || 'now',
          value: nowDate.date(),
          data: nowDate,
          dateValue: nowDate.format('YYYY-MM-DD'),
          range,
          rangeTag: rangeTag,
          weekStart,
          weekBetween,
          weekEnd,
          disabled: minMomentValue > nowDate.valueOf() || maxMomentValue < nowDate.valueOf(),
        }]);
        dateView[dateView.length - 1].week = nowDate.week();
      } else {
        dateView[dateView.length - 1].push({
          isToday: isToday,
          tag: tag || 'now',
          value: nowDate.date(),
          data: nowDate,
          dateValue: nowDate.format('YYYY-MM-DD'),
          range,
          rangeTag: rangeTag,
          weekStart,
          weekBetween,
          weekEnd,
          disabled: minMomentValue > nowDate.valueOf() || maxMomentValue < nowDate.valueOf(),
        });
      }
    }
    
    this.dateView = dateView;
    this.setTitleStatus();
    return dateView;
  }
  setDate(momentDate) {
    if(this.isPickEvent || momentDate.disabled) {
      return;
    }

    this.isPickEventing = 1;
    var _this = this;
    setTimeout(function() {
      _this.isPickEventing = null;
    }, 500)

    //周范围设置选中的值
    if (this.weekPick) {
      if (momentDate.data.clone().startOf('week').valueOf() < this.minDateArr.data && this.minDateArr.data.valueOf()) {
        return;
      }
      if (momentDate.data.clone().endOf('week').valueOf() > this.maxDateArr.data && this.maxDateArr.data.valueOf()) {
        return;
      }
      this.weekPickerData.start = momentDate.data.clone().startOf('week');
      this.weekPickerData.end = momentDate.data.clone().endOf('week');
      this.weekPickerData.year = this.weekPickerData.end.clone().year();
      this.weekPickerData.week = momentDate.data.clone().week();
    }
    //时间范围设置选中的值
    else if (this.dateRange) {
      G.pickEventTimes = G.pickEventTimes || 0;
      G.startValue = G.startValue || '';
      G.endValue = G.endValue || '';
      G.pickEventTimes ++;
      if(G.pickEventTimes%2 > 0) {
        G.startValue = momentDate.dateValue;
        G.endValue = '';
      }
      else {
        if(moment(G.startValue).valueOf() > moment(momentDate.dateValue).valueOf()) {
          G.endValue = G.startValue;
          G.startValue = momentDate.dateValue;
        }
        else {
          G.endValue = momentDate.dateValue;
        }
        G.pickEventTimes = 0;
      }

      this.dateRangeData.start = G.startValue ? moment(G.startValue) : '';
      this.dateRangeData.end = G.endValue ? moment(G.endValue) : '';
    }

    this.dateData.date = momentDate.data.date();
    this.dateData.month = momentDate.data.month() + 1;
    this.dateData.year = momentDate.data.year();

    this.setDateView(momentDate.data);
    this.setMonthView();
    this.setYearView(this.dateData.year);
    this.setHourView();
    this.setMinView();
    this.setSecondView();

  }
  setTitleStatus() {

  }
  setPrevMonth() {
    if (this.dateView.prevMonth) {
      let prevMonth;
      if (
        this.minDateArr.year &&
        this.minDateArr.month &&
        this.minDateArr.date
      ) {
        prevMonth =
          moment([
            this.dateData.year,
            this.dateData.month - 1,
            this.dateData.date,
          ])
            .add(-1, 'month')
            .valueOf() >
          moment([
            this.minDateArr.year,
            this.minDateArr.month - 1,
            this.minDateArr.date,
          ]).valueOf() ?
            moment([
              this.dateData.year,
              this.dateData.month - 1,
              this.dateData.date,
            ]).add(-1, 'month') :
            moment([
              this.minDateArr.year,
              this.minDateArr.month - 1,
              this.minDateArr.date,
            ]);
      } else {
        prevMonth = moment([
          this.dateData.year,
          this.dateData.month - 1,
          this.dateData.date,
        ]).add(-1, 'month');
      }
      this.dateData.date = prevMonth.date();
      this.dateData.month = prevMonth.month() + 1;
      this.setMonthView();
      if (prevMonth.year() !== this.dateData.year) {
        this.dateData.year = prevMonth.year();
        this.setYearView(this.dateData.year);
      }
      this.setDateView(prevMonth);
    }
  }
  setNextMonth() {
    if (this.dateView.nextMonth) {
      let nextMonth;
      if (
        this.maxDateArr.year &&
        this.maxDateArr.month &&
        this.maxDateArr.date
      ) {
        nextMonth =
          moment([
            this.dateData.year,
            this.dateData.month - 1,
            this.dateData.date,
          ])
            .add(1, 'month')
            .valueOf() <
          moment([
            this.maxDateArr.year,
            this.maxDateArr.month - 1,
            this.maxDateArr.date,
          ]).valueOf() ?
            moment([
              this.dateData.year,
              this.dateData.month - 1,
              this.dateData.date,
            ]).add(1, 'month') :
            moment([
              this.maxDateArr.year,
              this.maxDateArr.month - 1,
              this.maxDateArr.date,
            ]);
      } else {
        nextMonth = moment([
          this.dateData.year,
          this.dateData.month - 1,
          this.dateData.date,
        ]).add(1, 'month');
      }

      this.dateData.date = nextMonth.date();
      if (this.dateData.year !== nextMonth.year()) {
        this.dateData.year = nextMonth.year();
        this.setYearView(this.dateData.year);
      }
      this.dateData.month = nextMonth.month() + 1;
      this.setMonthView();
      this.setDateView(nextMonth);
    }
  }
  setPreYear(type) {
    if (type === 'day' && !this.dateView.prevYear) {
      return;
    }
    if (!type && !this.monthView.prevYear) {
      return;
    }
    this.dateData.year -= 1;
    if (this.dateData.year === this.minDateArr.year) {
      this.dateData.month =
        this.dateData.month > this.minDateArr.month ?
          this.dateData.month :
          this.minDateArr.month;
    }
    this.yearView = this.dateData.year;
    this.setYearView(this.dateData.year);
    this.setMonthView();
    this.setDateView(moment([this.dateData.year, this.dateData.month - 1, 1]));
  }
  setNextYear(type) {
    if (type === 'day' && !this.dateView.nextYear) {
      return;
    }
    if (!type && !this.monthView.nextYear) {
      return;
    }
    this.dateData.year += 1;
    if (this.dateData.year === this.maxDateArr.year) {
      this.dateData.month =
        this.dateData.month < this.maxDateArr.month ?
          this.dateData.month :
          this.maxDateArr.month;
    }
    this.yearView = this.dateData.year;
    this.setYearView(this.dateData.year);
    this.setMonthView();
    this.setDateView(moment([this.dateData.year, this.dateData.month - 1, 1]));
  }
  setMinDate(date) {
    let formatDate;
    formatDate = this.formatDate || (this.timePick ? 'HH:mm:ss' : 'YYYY-MM-DD');
    const time = moment(date, formatDate);
    this.hasMinDate = true;
    this.minDateArr = {
      year: time.year(),
      month: time.month() + 1,
      date: time.date(),
      hour: time.hour(),
      minute: time.minute(),
      second: time.second(),
      data: time,
    };

    if (time.valueOf() > moment([
      this.dateData.year,
      this.dateData.month - 1,
      this.dateData.date,
      this.dateData.hour,
      this.dateData.minute,
      this.dateData.second,
    ]).valueOf()) {
      this.dateData = Object.assign({}, this.minDateArr);
    }
  }
  setMaxDate(date) {
    let formatDate;
    formatDate = this.formatDate || (this.timePick ? 'HH:mm:ss' : 'YYYY-MM-DD');
    const time = moment(date, formatDate);
    this.hasMaxDate = true;
    this.maxDateArr = {
      year: time.year(),
      month: time.month() + 1,
      date: time.date(),
      hour: time.hour(),
      minute: time.minute(),
      second: time.second(),
      data: time,
    };
    if (time.valueOf() < moment([
      this.dateData.year,
      this.dateData.month - 1,
      this.dateData.date,
      this.dateData.hour,
      this.dateData.minute,
      this.dateData.second,
    ]).valueOf()) {
      this.dateData = Object.assign({}, this.maxDateArr);
    }
  }
  setHourView() {
    if (!this.dateData.hour && this.dateData.hour !== 0) {
      this.dateData.hour = moment().hour();
    }
    this.hourView = Array(...Array(24)).map((item, i) => ({
      value: (i / 100)
        .toFixed(2)
        .toString()
        .slice(2),
      active: i === Number(this.dateData.hour),
      disabled: moment([
        this.minDateArr.year,
        this.minDateArr.month - 1,
        this.minDateArr.date,
        this.minDateArr.hour,
      ]).valueOf() >
          moment([
            this.dateData.year,
            this.dateData.month - 1,
            this.dateData.date,
            i,
          ]).valueOf() ||
          moment([
            this.maxDateArr.year,
            this.maxDateArr.month - 1,
            this.maxDateArr.date,
            this.maxDateArr.hour,
          ]).valueOf() <
          moment([
            this.dateData.year,
            this.dateData.month - 1,
            this.dateData.date,
            i,
          ]).valueOf(),
    }));
    for (let i = 1, len = this.hourView.length; i < len; i++) {
      if (!this.hourView[i].disabled && this.hourView[i - 1].disabled) {
        this.hourView[i].first = true;
      }
      if (this.hourView[i].disabled && !this.hourView[i - 1].disabled) {
        this.hourView[i - 1].last = true;
      }
    }
  }
  setHour(hour) {
    if (!hour.disabled && (hour.value != this.dateData.hour)) {
      this.dateData.hour = hour.value;
      this.setHourView();
      if (this.hasMinDate || this.hasMaxDate) {
        this.setMinView();
        this.setSecondView();
      }
    }
  }
  setMinView() {
    if (!this.dateData.minute && this.dateData.minute !== 0) {
      this.dateData.minute = moment().minute();
    }
    let minMomentValue = moment([this.minDateArr.year, this.minDateArr.month - 1, this.minDateArr.date, this.minDateArr.hour, this.minDateArr.minute]).valueOf(),
      maxMomentValue = moment([this.maxDateArr.year, this.maxDateArr.month - 1, this.maxDateArr.date, this.maxDateArr.hour, this.maxDateArr.minute]).valueOf(),
      nowMomentValue = moment([this.dateData.year, this.dateData.month - 1, this.dateData.date, this.dateData.hour, this.dateData.minute]).valueOf();
    if (nowMomentValue < minMomentValue) {
      this.dateData.minute = this.minDateArr.minute;
    } else if (nowMomentValue > maxMomentValue) {
      this.dateData.minute = this.maxDateArr.minute;
    }
    this.minView = Array(...Array(60)).map((item, i) => ({
      value: (i / 100)
        .toFixed(2)
        .toString()
        .slice(2),
      active: i === Number(this.dateData.minute),
      disabled: minMomentValue >
          moment([
            this.dateData.year,
            this.dateData.month - 1,
            this.dateData.date,
            this.dateData.hour,
            i,
          ]).valueOf() || maxMomentValue <
          moment([
            this.dateData.year,
            this.dateData.month - 1,
            this.dateData.date,
            this.dateData.hour,
            i,
          ]).valueOf(),
    }));
    for (let i = 1, len = this.minView.length; i < len; i++) {
      if (!this.minView[i].disabled && this.minView[i - 1].disabled) {
        this.minView[i].first = true;
      }
      if (this.minView[i].disabled && !this.minView[i - 1].disabled) {
        this.minView[i - 1].last = true;
      }
    }
  }
  setMinute(minute) {
    if (!minute.disabled && (minute.value != this.dateData.minute)) {
      this.dateData.minute = minute.value;
      this.setMinView();
      if (this.hasMaxDate || this.hasMinDate) {
        this.setSecondView();
      }
    }
  }
  setSecondView() {
    if (!this.dateData.second && this.dateData.second !== 0) {
      this.dateData.second = moment().second();
    }
    let minMomentValue = moment([this.minDateArr.year, this.minDateArr.month - 1, this.minDateArr.date, this.minDateArr.hour, this.minDateArr.minute, this.minDateArr.second]).valueOf(),
      maxMomentValue = moment([this.maxDateArr.year, this.maxDateArr.month - 1, this.maxDateArr.date, this.maxDateArr.hour, this.maxDateArr.minute, this.maxDateArr.second]).valueOf(),
      nowMomentValue = moment([this.dateData.year, this.dateData.month - 1, this.dateData.date, this.dateData.hour, this.dateData.minute, this.dateData.second]).valueOf();
    if (nowMomentValue < minMomentValue) {
      this.dateData.second = this.minDateArr.second;
    } else if (nowMomentValue > maxMomentValue) {
      this.dateData.second = this.maxDateArr.second;
    }
    this.secondView = Array(...Array(60)).map((item, i) => ({
      value: (i / 100)
        .toFixed(2)
        .toString()
        .slice(2),
      active: i == Number(this.dateData.second),
      disabled: moment([
        this.minDateArr.year,
        this.minDateArr.month - 1,
        this.minDateArr.date,
        this.minDateArr.hour,
        this.minDateArr.minute,
        this.minDateArr.second,
      ]).valueOf() >
          moment([
            this.dateData.year,
            this.dateData.month - 1,
            this.dateData.date,
            this.dateData.hour,
            this.dateData.minute,
            i,
          ]).valueOf() ||
          moment([
            this.maxDateArr.year,
            this.maxDateArr.month - 1,
            this.maxDateArr.date,
            this.maxDateArr.hour,
            this.maxDateArr.minute,
            this.maxDateArr.second,
          ]).valueOf() <
          moment([
            this.dateData.year,
            this.dateData.month - 1,
            this.dateData.date,
            this.dateData.hour,
            this.dateData.minute,
            i,
          ]).valueOf(),
    }));
    for (let i = 1, len = this.secondView.length; i < len; i++) {
      if (!this.secondView[i].disabled && this.secondView[i - 1].disabled) {
        this.secondView[i].first = true;
      }
      if (this.secondView[i].disabled && !this.secondView[i - 1].disabled) {
        this.secondView[i - 1].last = true;
      }
    }
  }
  setSecond(second) {
    if (!second.disabled && (second.value != this.dateData.second)) {
      this.dateData.second = second.value;
      this.setSecondView();
    }
  }
  getResult() {
    let formatDate;
    formatDate = this.formatDate || (this.timePick ? 'HH:mm:ss' : 'YYYY-MM-DD');
    if (this.timePick) {
      return moment()
        .set('hour', this.dateData.hour || this.dateData.hour === 0 ? this.dateData.hour : moment().hour())
        .set('minute', this.dateData.minute || this.dateData.minute === 0 ? this.dateData.minute : moment().minute())
        .set('second', this.dateData.second || this.dateData.second === 0 ? this.dateData.second : moment().second())
        .format(formatDate);
    }
    return moment()
      .set('year', this.dateData.year || moment().year())
      .set(
        'month',
        typeof this.dateData.month === 'number' ? this.dateData.month - 1 : moment().month(),
      )
      .set('date', this.dateData.date || moment().date())
      .set('hour', this.dateData.hour || moment().hour())
      .set('minute', this.dateData.minute || moment().minute())
      .set('second', this.dateData.second || moment().second())
      .format(formatDate);
  }

  getDateRangeData() {
    return this.dateRangeData;
  }
}

export default DatePicker;
