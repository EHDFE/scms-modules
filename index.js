import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './libs/base.less';
import './libs/font-awesome/css/font-awesome.css';


import angularUi from "./src/angularUi/less/angularUi.less";
import ngHtmlContainer from "./src/ngHtmlContainer/ngHtmlContainer";

import allNavDirective from "./src/allNav/allNavDirective";
import buttonDirective from "./src/button/button";
import cantonSelectDirective from "./src/cantonSelect/cantonSelectDirective";
import changePwdDialogDirective from "./src/changePwdDialog/changePwdDialogDirective";
import chartDirective from "./src/chart/chartDirective";
import citysSelectDirective from "./src/citysSelect/citysSelectDirective";
import citysSelectMultipleDirective from "./src/citysSelectMultiple/citysSelectMultipleDirective";
import crumbDirective from "./src/crumb/crumb";
import datePickerDirective from "./src/datePicker/datePickerDirective";
import errorNoDataDirective from "./src/errorNoData/errorNoDataDirective";
import exportDirective from "./src/export/exportDirective";
//import fileUploaderDirective from "./src/fileUploader/index";
import formRadioDirective from "./src/formRadio/formRadio";
import headerDirective from "./src/header/header";
import imageShowDirective from "./src/imageShow/imageShow";
import kaImageUploadDirective from "./src/kaImageUpload/kaImageUploadDirective";
import loadingDirective from "./src/loading/loadingDirective";
import mainNavDirective from "./src/mainNav/mainNavDirective";
import multiselectDirective from "./src/multiselect/multiselect";
import noPermissionDirective from "./src/noPermission/noPermission";
import paginationDirective from "./src/pagination/paginationDirective";
import qrcodeDirective from "./src/qrcode/qrcode";
import searchDropdownDirective from "./src/searchDropdown/searchDropdown";
import starRatingDirective from "./src/starRating/starRating";
import stepsDirective from "./src/steps/steps";
import tableDirective from "./src/table/table";
import timePickerDirective from "./src/timePicker/timePickerDirective";
import tooltipDirective from "./src/tooltip/tooltip";
import treeViewDirective from "./src/treeView/treeView";


const stateModules = {
  'ngHtmlContainer/ngHtmlContainer': ngHtmlContainer,
  'allNav/allNavDirective': allNavDirective,
  'button/button': buttonDirective,
  'cantonSelect/cantonSelectDirective': cantonSelectDirective,
  'changePwdDialog/changePwdDialogDirective': changePwdDialogDirective,
  'chart/chartDirective': chartDirective,
  'citysSelect/citysSelectDirective': citysSelectDirective,
  'citysSelectMultiple/citysSelectMultipleDirective': citysSelectMultipleDirective,
  'crumb/crumb': crumbDirective,
  'datePicker/datePickerDirective': datePickerDirective,
  'errorNoData/errorNoDataDirective': errorNoDataDirective,
  'export/exportDirective': exportDirective,
  //'fileUploader': fileUploaderDirective,  
  'formRadio/formRadio': formRadioDirective,
  'header/header': headerDirective,
  'imageShow/imageShow': imageShowDirective,
  'kaImageUpload/kaImageUploadDirective': kaImageUploadDirective,
  'loading/loadingDirective': loadingDirective,
  'mainNav/mainNavDirective': mainNavDirective,
  'multiselect/multiselect': multiselectDirective,
  'noPermission/noPermission': noPermissionDirective,
  'pagination/paginationDirective': paginationDirective,
  'qrcode/qrcode': qrcodeDirective,
  'searchDropdown/searchDropdown': searchDropdownDirective,
  'starRating/starRating': starRatingDirective,
  'steps/steps': stepsDirective,
  'table/table': tableDirective,
  'timePicker/timePickerDirective': timePickerDirective,
  'tooltip/tooltip': tooltipDirective,
  'treeView/treeView': treeViewDirective,
}
export default stateModules;