export default {
	title: "Selector",
	author:"程乐",
	type: "directive",
	"keyName":"selectorDirective",
	"name":"Selector 匹配选择框",
	"lastBy":"",
	"description":"",
	"date":"2018-01-30",
	"scope":
		[{
			"type":"string",
			"exampleValue":'城市1',
			"defaultValue":'城市1',
			"key":"text",
			"description":"默认展示参数"
		},
		{
			"type":"object",
			"exampleValue":[{text:'城市1',value:1},{text:'城市2',value:2},{text:'城市3',value:3},{text:'城市4',value:4}],
			"key":"items",
			"description":"数据组"
		},
		{
			"type":"number",
			"exampleValue":'',
			"defaultValue":'',
			"key":"value",
			"description":"选中数据"
		}],
	"attrs":[],
	"deps":["scmsModules/selector/selectorDirective"],
	"html":"<div selector-directive class=\"EUi-select-box\" items=\"items\" value=\"value\" text=\"text\"><input type=\"text\" placeholder=\"请选择城市\" ng-model=\"text\" ><i class=\"EUi-select-icon\"></i><div class=\"EUi-select-content\"><dl><dd ng-repeat=\"item in items\" data-value=\"{{ item.value }}\">{{ item.text }}</dd></dl></div></div>",
	"api":"",
	"htmlUrl":""
}