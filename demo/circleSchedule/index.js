export default {
	title: "circleSchedule",
	author:"程乐",
	type: "directive",
	"keyName":"circleSchedule",
	"name":"circleSchedule 环形进度",
	"lastBy":"",
	"description":"",
	"date":"2018-03-13",
	"scope":[
		{
			"type":"object",
			"exampleValue":{circleBottomColor:'rgba(255,255,255,0.5)',innerColorStart:'#ffdd00', innerColorEnd:'#fc7d37',lineW: 20},
			"defaultValue":"{circleBottomColor:'#f2f2f2',//圆环底色innerColorStart:'#ffdd00',  //内部圆环 渐变色开始innerColorEnd:'#fc7d37' //内部圆环 渐变色结束}",
			"key":"ops",
			"description":"参数  默认{circleBottomColor:'#f2f2f2',//圆环底色innerColorStart:'#ffdd00',  //内部圆环 渐变色开始innerColorEnd:'#fc7d37' //内部圆环 渐变色结束,lineW: 20}"
		},
		{
			"type":"number",
			"exampleValue":0.3,
			"defaultValue":0.3,
			"key":"percent",
			"description":"百分比"
		}],
	"attrs":[],
	"deps":["scmsModules/imageUpload/imageUpload"],
	"html":"<canvas circle-schedule percent=\"percent\" ops=\"ops\"  id=\"canvas1\" width=\"200\" height=\"200\" ></canvas>",
	"api":"",
	"htmlUrl":""
}