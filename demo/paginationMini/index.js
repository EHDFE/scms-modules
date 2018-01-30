export default {
	title: "PaginationMini",
	author:"程乐",
	type: "directive",
	"keyName":"paginationMiniDirective",
	"name":"PaginationMini 翻页",
	"lastBy":"",
	"description":"",
	"date":"2016-09-20",
	"scope":
		[{
			"type":"number",
			"exampleValue":1,
			"defaultValue":1,
			"key":"currentPage",
			"description":"当前页码"
		},
		{
			"type":"number",
			"exampleValue":100,
			"key":"totalCount",
			"description":"总共行数"
		},
		{
			"type":"number",
			"exampleValue":15,
			"defaultValue":15,
			"isDisabled":1,
			"key":"pageSize",
			"description":"一页显示行数"
		}],
	"attrs":[],
	"deps":["scmsModules/paginationMini/paginationMiniDirective"],
	"html":"<div pagination-mini-directive current-page=\"currentPage\" page-size=\"pageSize\" total-count=\"totalCount\"></div>",
	"api":"",
	"htmlUrl":""
}