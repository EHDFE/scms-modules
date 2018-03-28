export default {
	title: "imageUpload",
	author:"程乐",
	type: "directive",
	"keyName":"imageUpload",
	"name":"imageUpload 图片上传",
	"lastBy":"",
	"description":"",
	"date":"2018-02-02",
	"scope":[{
			"type":"string",
			"exampleValue":'noThumb',
			"defaultValue":'noThumb',
			"key":"moduleType",
			"description":"样式类型，有 “noThumb” 和 “thumb” 两种"
		},
		{
			"type":"string",
			"exampleValue":'/goodstaxiAdmin/imagecs/uploadImage',
			"key":"apiUrl",
			"description":"上传地址"
		},
		{
			"type":"object",
			"exampleValue":[{imgName:'图片1.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',data:[],uploadType:{succeed:true,error:false,loading:false}},{imgName:'图片2.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',data:[],uploadType:{succeed:false,error:true,loading:false}},{imgName:'图片3.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',data:[],uploadType:{succeed:false,error:false,loading:true}}],
			"defaultValue":"[{imgName:'图片1.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',data:[],uploadType:{succeed:true,error:false,loading:false}},{imgName:'图片2.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',data:[],uploadType:{succeed:false,error:true,loading:false}},{imgName:'图片3.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',data:[],uploadType:{succeed:false,error:false,loading:true}}]",
			"key":"imageUrls",
			"description":"数据"
		},
		{
			"type":"number",
			"exampleValue":30,
			"defaultValue":30,
			"key":"dWidth",
			"description":"设定上传图片的宽度"
		},
		{
			"type":"number",
			"exampleValue":30,
			"defaultValue":30,
			"key":"dHeight",
			"description":"设定上传图片的高度"
		},
		{
			"type":"number",
			"exampleValue":30,
			"defaultValue":30,
			"key":"dSize",
			"description":"设定上传图片的大小，单位KB"
		},
		{
			"type":"number",
			"exampleValue":5,
			"defaultValue":5,
			"key":"dNum",
			"description":"设定上传图片的数量，只限 “thumb” 使用"
		},
        {
			"type":"function",
			"exampleValue":'',
            "defaultValue":'',
			"key":"clearData",
			"description":"清除数据"
		}],
	"attrs":[],
	"deps":["scmsModules/imageUpload/imageUpload"],
	"html":"<div image-upload module-type=\"moduleType\" clear-data=\"clearData\" api-url=\"apiUrl\" image-urls=\"imageUrls\" d-width=\"dWidth\" d-height=\"dHeight\" d-size=\"dSize\"></div><div image-upload module-type=\"'thumb'\" api-url=\"apiUrl\" image-urls=\"imageUrls\" d-width=\"dWidth\" d-height=\"dHeight\" d-size=\"dSize\" d-num=\"dNum\"></div>",
	"api":"",
	"htmlUrl":""
}