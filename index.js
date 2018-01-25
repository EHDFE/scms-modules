import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './libs/base.less';
import './libs/font-awesome/css/font-awesome.css';


import angularUi from "./src/angularUi/less/angularUi.less";
import ngHtmlContainer from "./src/ngHtmlContainer/ngHtmlContainer";

import allNavDirective from "./src/allNav/allNavDirective";
import cantonSelectDirective from "./src/cantonSelect/cantonSelectDirective";
import changePwdDialogDirective from "./src/changePwdDialog/changePwdDialogDirective";
import chartDirective from "./src/chart/chartDirective";
import citysSelectDirective from "./src/citysSelect/citysSelectDirective";
import citysSelectMultipleDirective from "./src/citysSelectMultiple/citysSelectMultipleDirective";
import crumbDirective from "./src/crumb/crumbDirective";
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
//import noPermissionDirective from "./src/noPermission/noPermission";
import paginationDirective from "./src/pagination/paginationDirective";
import qrcodeDirective from "./src/qrcode/qrcode";
import searchDropdownDirective from "./src/searchDropdown/searchDropdown";
import starRatingDirective from "./src/starRating/starRating";
import stepsDirective from "./src/steps/steps";
import tableDirective from "./src/table/table";
import timePickerDirective from "./src/timePicker/timePickerDirective";
import tooltipDirective from "./src/tooltip/tooltip";
import treeViewDirective from "./src/treeView/treeView";

export default {
  'ngHtmlContainer/ngHtmlContainer': ngHtmlContainer,
  //'allNav/allNavDirective': allNavDirective,
  'cantonSelect/cantonSelectDirective': cantonSelectDirective,
  'changePwdDialog/changePwdDialogDirective': changePwdDialogDirective,
  'chart/chartDirective': chartDirective,
  'citysSelect/citysSelectDirective': citysSelectDirective,
  'citysSelectMultiple/citysSelectMultipleDirective': citysSelectMultipleDirective,
  'crumb/crumbDirective': crumbDirective,
  'datePicker/datePickerDirective': datePickerDirective,
  'errorNoData/errorNoDataDirective': errorNoDataDirective,
  'export/exportDirective': exportDirective,
  //'fileUploader': fileUploaderDirective,  
  'formRadio/formRadioDirective': formRadioDirective,
  'imageShow/imageShowDirective': imageShowDirective,
  'kaImageUpload/kaImageUploadDirective': kaImageUploadDirective,
  'loading/loadingDirective': loadingDirective,
  'mainNav/mainNavDirective': mainNavDirective,
  'multiselect/multiselectDirective': multiselectDirective,
  //'noPermission/noPermissionDirective': noPermissionDirective,
  'pagination/paginationDirective': paginationDirective,
  'qrcode/qrcodeDirective': qrcodeDirective,
  'searchDropdown/searchDropdownDirective': searchDropdownDirective,
  'starRating/starRatingDirective': starRatingDirective,
  'steps/stepsDirective': stepsDirective,
  'table/tableDirective': tableDirective,
  'timePicker/timePickerDirective': timePickerDirective,
  'tooltip/tooltipDirective': tooltipDirective,
  'treeView/treeViewDirective': treeViewDirective,
};