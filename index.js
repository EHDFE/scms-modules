// import 'bootstrap/less/bootstrap.less';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-colorpicker/dist/css/bootstrap-colorpicker.css';
import 'font-awesome/css/font-awesome.css';

import './libs/base.less';
import './libs/font-scms/less/style.less';
import './scmsUi/less/index.less';

import 'bootstrap';

import './scmsUi';

import ngHtmlContainer from './src/ngHtmlContainer/ngHtmlContainer';
import switchDirective from './src/switch/switchDirective';

import paginationDirective from './src/pagination/paginationDirective';
import paginationMiniDirective from './src/paginationMini/paginationMiniDirective';
import crumbDirective from './src/crumb/crumbDirective';

import ngCodeDirective from './src/ngCode/ngCodeDirective';
import cantonSelectDirective from './src/cantonSelect/cantonSelectDirective';
import changePwdDialogDirective from './src/changePwdDialog/changePwdDialogDirective';
import chartDirective from './src/chart/chartDirective';
import citysSelectDirective from './src/citysSelect/citysSelectDirective';
import citysSelectMultipleDirective from './src/citysSelectMultiple/citysSelectMultipleDirective';
import datePickerDirective from './src/datePicker/datePickerDirective';
import errorNoDataDirective from './src/errorNoData/errorNoDataDirective';
import exportDirective from './src/export/exportDirective';
import formRadioDirective from './src/formRadio/formRadio';
import imageShowDirective from './src/imageShow/imageShow';
import kaImageUploadDirective from './src/kaImageUpload/kaImageUploadDirective';
import loadingDirective from './src/loading/loadingDirective';
import mainNavDirective from './src/mainNav/mainNavDirective';
import multiselectDirective from './src/multiselect/multiselect';
// import noPermissionDirective from "./src/noPermission/noPermission";
import qrcodeDirective from './src/qrcode/qrcode';
import searchDropdownDirective from './src/searchDropdown/searchDropdown';
import starRatingDirective from './src/starRating/starRating';
import stepsDirective from './src/steps/steps';
import tableDirective from './src/table/table';
import tableHandleDirective from './src/tableHandle/tableHandle';
import timePickerDirective from './src/timePicker/timePickerDirective';
import tooltipDirective from './src/tooltip/tooltip';
import treeViewDirective from './src/treeView/treeView';
import fileUploaderDirective from './src/fileUploader/index';
import datePicker from './src/ngDatePicker/datePicker';
import datePickerRange from './src/ngDatePicker/datePickerRange';
import weekPicker from './src/ngDatePicker/weekPicker';
import timePicker from './src/ngDatePicker/timePicker';
import calendar from './src/ngDatePicker/calendar';
import calendarPanel from './src/ngDatePicker/calendarPanel';
import monthRangePicker from './src/ngDatePicker/monthRangePicker';
import buttonDropdown from './src/buttonDropdown/buttonDropdown';
import selectDropdown from './src/selectDropdown/selectDropdown';
import imageUpload from './src/imageUpload/imageUpload';

import numberSelect from './src/numberSelect/numberSelect';
import circleSchedule from './src/circleSchedule/circleSchedule';
import cascadeSelect from './src/cascadeSelect';
import rangeSelectBar from './src/rangeSelectBar/rangeSelectBar';
import businessCitySelect from './src/businessCitySelect';
import colorPicker from './src/colorPicker';
import multipleSelect from './src/multipleSelect';
import ngTableFixed from './src/table/ngTableFixed';

import datePickerRangeFixPanel from './src/ngDatePicker/datePickerRangeFixPanel';


export default {
  'ngCode/ngCodeDirective': ngCodeDirective,
  'switch/switchDirective': switchDirective,

  'ngHtmlContainer/ngHtmlContainer': ngHtmlContainer,
  'cantonSelect/cantonSelectDirective': cantonSelectDirective,
  'changePwdDialog/changePwdDialogDirective': changePwdDialogDirective,
  'chart/chartDirective': chartDirective,
  'citysSelect/citysSelectDirective': citysSelectDirective,
  'citysSelectMultiple/citysSelectMultipleDirective': citysSelectMultipleDirective,
  'crumb/crumbDirective': crumbDirective,
  'datePicker/datePickerDirective': datePickerDirective,
  'errorNoData/errorNoDataDirective': errorNoDataDirective,
  'export/exportDirective': exportDirective,
  fileUploader: fileUploaderDirective,
  'formRadio/formRadioDirective': formRadioDirective,
  'imageShow/imageShowDirective': imageShowDirective,
  'kaImageUpload/kaImageUploadDirective': kaImageUploadDirective,
  'loading/loadingDirective': loadingDirective,
  'mainNav/mainNavDirective': mainNavDirective,
  'multiselect/multiselectDirective': multiselectDirective,
  // 'noPermission/noPermissionDirective': noPermissionDirective,
  'pagination/paginationDirective': paginationDirective,
  'paginationMini/paginationMiniDirective': paginationMiniDirective,
  'qrcode/qrcodeDirective': qrcodeDirective,
  'searchDropdown/searchDropdownDirective': searchDropdownDirective,
  'starRating/starRatingDirective': starRatingDirective,
  'steps/stepsDirective': stepsDirective,
  'table/tableDirective': tableDirective,
  'tableHandle/tableHandleDirective': tableHandleDirective,
  'timePicker/timePickerDirective': timePickerDirective,
  'tooltip/tooltip': tooltipDirective,
  'treeView/treeViewDirective': treeViewDirective,
  'ngDatePicker/datePicker': datePicker,
  'ngDatePicker/datePickerRange': datePickerRange,
  'ngDatePicker/weekPicker': weekPicker,
  'ngDatePicker/timePicker': timePicker,
  'ngDatePicker/calendar': calendar,
  'ngDatePicker/calendarPanel': calendarPanel,
  'ngDatePicker/monthRangePicker': monthRangePicker,
  buttonDropdown,
  selectDropdown,
  'imageUpload/imageUpload': imageUpload,
  numberSelect,
  'circleSchedule/circleSchedule': circleSchedule,
  cascadeSelect,
  rangeSelectBar,
  businessCitySelect,
  colorPicker,
  multipleSelect,
  ngTableFixed,
  'ngDatePicker/datePickerRangeFixPanel': datePickerRangeFixPanel,
};
