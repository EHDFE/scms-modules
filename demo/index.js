let demoData = [];

import base from "./base/index.js";
demoData.push(base);

import fontAwesome from "./fontAwesome/index.js";
demoData.push(fontAwesome);

import buttons from "./buttons/index.js";
demoData = demoData.concat(buttons);

import inputDate from "./inputDate/index.js";
demoData.push(inputDate);

import nav from "./nav/index.js";
demoData = demoData.concat(nav);

import searchForm from "./searchForm/index.js";
demoData.push(searchForm);

import dialog from "./dialog/index.js";
demoData.push(dialog);

import form from "./form/index.js";
demoData = demoData.concat(form);


import table from "./table/index.js";
demoData.push(table);

import pagination from "./pagination/index.js";
demoData.push(pagination);



export default demoData