import table from "./table.html";
import tableDirective from "./tableDirective.json";
import tableDirectiveHtml from "./tableDirectiveHtml.html";
tableDirective[0].html = tableDirectiveHtml;
export default [{
	title: "Table Css",
	parentTitle: "Tables",
	author: "tianyanrong",
	html: [table],
	isCode: true
}].concat(tableDirective);