export default {
	title: "selectColor",
	author:"程乐",
	type: "directive",
	"keyName":"selectColor",
	"name":"selectColor 颜色选择器",
	"lastBy":"",
	"description":"",
	"date":"2018-03-13",
	"scope":[
		{
			"type":"string",
			"exampleValue":'#ff0000',
			"defaultValue":'#ff0000',
			"key":"initColor",
			"description":"颜色"
		}],
	"attrs":[],
	"deps":["scmsModules/selectColor"],
	"html":"<div select-color-directive init-color=\"initColor\"></div>",
	"api":"",
	"htmlUrl":""
}