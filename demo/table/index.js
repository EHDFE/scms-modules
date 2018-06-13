import table from './table.html';
import table2 from './table2.html';
import table3 from './table3.html';

import tableDirective from './tableDirective';
import tableDirectiveHtml from './tableDirectiveHtml.html';
tableDirective[0].html = tableDirectiveHtml;

import tableFixed from './tableFixed';
import tableFixedHtml from './tableFixed.html';
tableFixed[0].html = tableFixedHtml;

import tableFixedTheadRows from './tableFixedTheadRows';
import tableFixedTheadRowsHtml from './tableFixedTheadRows.html';
tableFixedTheadRows[0].html = tableFixedTheadRowsHtml;

export default [{
  title: 'Table Css',
  parentTitle: 'Tables',
  author: 'tianyanrong',
  html: [table, table2, table3],
  isCode: true,
}].concat(tableDirective, tableFixed, tableFixedTheadRows);
