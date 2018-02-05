export default {
	title: "starRating",
	author:"程乐",
	type: "directive",
	"keyName":"starRating",
	"name":"starRating 星星评价",
	"lastBy":"",
	"description":"",
	"date":"2017-10-16",
	"scope":
		[{
			"type":"number",
			"exampleValue":75,
			"defaultValue":75,
			"key":"num",
			"description":"分数"
		}],
	"attrs":[],
	"deps":["scmsModules/starRating/starRating"],
	"html":"<span star-rating num=\"num\"></span>",
	"api":"",
	"htmlUrl":""
}