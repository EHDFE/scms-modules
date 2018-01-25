export default {
	title: "Crumb",
	author:"tianyanrong",
	type: "directive",
	"keyName":"crumbDirective",
	"name":"Crumb 面包屑",
	"lastBy":"",
	"description":"",
	"date":"2016-09-20",
	"scope":
		[{
			"type":"object",
			"exampleValue":[{
				"name": "货主管理",
				"href": "/",
				"hrefParams": "/?id=0",
			},{
				"name": "货主详情",
				"href": "/",
				"hrefParams": "/?id=0",
			}],
			"defaultValue":{},
			"key":"crumbsData",
			"description":"当前路径地址"
		}],
	"attrs":[],
	"deps":["scmsModules/crumb/crumbDirective"],
	"html":"<div crumb-directive crumbs-data='crumbsData'></div>",
	"api":"",
	"htmlUrl":""
}