import table from "./table.html";
import table2 from "./table2.html";
import table3 from "./table3.html";
import tableDirective from "./tableDirective.json";
import tableDirectiveHtml from "./tableDirectiveHtml.html";
tableDirective[0].html = tableDirectiveHtml;
export default [{
	title: "Table Css",
	parentTitle: "Tables",
	author: "tianyanrong",
	html: [table, table2, table3],
	isCode: true
}].concat(tableDirective);