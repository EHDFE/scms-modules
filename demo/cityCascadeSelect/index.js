export default {
	title: "cityCascadeSelect",
	author:"程乐",
	type: "directive",
	"keyName":"cityCascadeSelect",
	"name":"cityCascadeSelect 省市级联",
	"lastBy":"",
	"description":"",
	"date":"2020-08-14",
	"scope":[
		{
			"type":"number",
			"exampleValue":3,
			"defaultValue":3,
			"key":"lever",
			"description":"参数 定义层级，最小1，最大3"
		},
		{
			"type":"string",
			"exampleValue": '北京 北京市 东城区',
			"defaultValue": '北京 北京市 东城区',
			"key":"text",
			"description":"城市集合字符串"
		},
		{
			"type":"object",
			"exampleValue": {leve1: "北京", leve2: "北京市", leve3: "东城区"},
			"defaultValue": '{leve1: "北京", leve2: "北京市", leve3: "东城区"}',
			"key":"cityData",
			"description":"城市集合对象"
		}],
	"attrs":[],
	"deps":["scmsModules/cityCascadeSelect"],
	"html":"<div city-cascade-select lever=\"{{lever}}\" text=\"text\" city-data=\"cityData\"></div>",
	"api":"",
	"htmlUrl":""
}