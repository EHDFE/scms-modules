export default {
	title: "colorPicker",
	author:"程乐",
	type: "directive",
	"keyName":"colorPicker",
	"name":"colorPicker 颜色选择器",
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
	"deps":["scmsModules/colorPicker"],
	"html":"<div color-picker-directive init-color=\"initColor\"></div>",
	"api":"",
	"htmlUrl":""
}