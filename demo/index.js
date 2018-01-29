let demoData = [];

import base from "./base/index.js";
demoData.push(base);

import grid from "./grid/index.js";
demoData.push(grid);

import fontAwesome from "./fontAwesome/index.js";
demoData.push(fontAwesome);

import title from "./title/index.js";
demoData.push(title);

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

import paginationMini from "./paginationMini/index.js";
demoData.push(paginationMini);

import crumb from "./crumb/index.js";
demoData.push(crumb);

import card from "./card/index.js";
demoData.push(card);

export default demoData