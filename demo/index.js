let demoData = [];

import base from "./base/index.js";
demoData.push(base);

import grid from "./grid/index.js";
demoData.push(grid);

import fontAwesome from "./fontAwesome/index.js";
demoData.push(fontAwesome);

import fontIcon from "./fontIcon/index.js";
demoData.push(fontIcon);

import title from "./title/index.js";
demoData.push(title);

import buttons from "./buttons/index.js";
demoData = demoData.concat(buttons);

import inputDate from "./inputDate/index.js";
demoData = demoData.concat(inputDate);

import nav from "./nav/index.js";
demoData = demoData.concat(nav);

import tooltip from "./tooltip/tooltip.json";
demoData = demoData.concat(tooltip);

import alert from "./alert/alert.js";
demoData = demoData.concat(alert);

//import imageShow from "./imageShow/index.js";
//demoData.push(imageShow);

import searchForm from "./searchForm/index.js";
demoData.push(searchForm);

import dialog from "./dialog/index.js";
demoData.push(dialog);

import selectDropdown from "./selectDropdown/index.js";
demoData.push(selectDropdown);

//import numberSelect from "./numberSelect/index.js";
//demoData = demoData.concat(numberSelect);

import form from "./form/index.js";
demoData = demoData.concat(form);


import table from "./table/index.js";
demoData = demoData.concat(table);

import pagination from "./pagination/index.js";
demoData.push(pagination);

import paginationMini from "./paginationMini/index.js";
demoData.push(paginationMini);

import crumb from "./crumb/index.js";
demoData.push(crumb);

import card from "./card/index.js";
demoData.push(card);



import starRating from "./starRating/index.js";
demoData.push(starRating);

import imageShow from "./imageShow/index.js";
demoData.push(imageShow);

import imageUpload from "./imageUpload/index.js";
demoData.push(imageUpload);

import circleSchedule from "./circleSchedule/";
demoData.push(circleSchedule);

import cascadeSelect from './cascadeSelect/';
demoData.push(cascadeSelect);

import colorPicker from './colorPicker/';
demoData.push(colorPicker);

export default demoData;