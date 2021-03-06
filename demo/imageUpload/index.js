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
			"description":"样式类型，有 “noThumb”、 “thumb” 和 “example”"
		},
		{
			"type":"string",
			"exampleValue":'/goodstaxiAdmin/imagecs/uploadImage',
			"key":"apiUrl",
			"description":"上传地址"
		},
		{
			"type":"object",
			// "exampleValue":[{imgName:'图片1.jpg',dataImg:'http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/04/61/Ck1AZF76q1KATDusAAHCodGW_ak042.jpg',data:[],uploadType:{succeed:true,error:false,loading:false}},{imgName:'图片2.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',data:[],uploadType:{succeed:false,error:true,loading:false}},{imgName:'图片3.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',data:[],uploadType:{succeed:false,error:false,loading:true}},{imgName:'xxx.pdf',dataImg:'http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/05/34/Ck1AZF8ySs-AFK9dACAcLbc8Su4554.pdf',data:[],uploadType:{succeed:true,error:false,loading:false}}],
			// "defaultValue":"[{imgName:'图片1.jpg',dataImg:'http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/04/61/Ck1AZF76q1KATDusAAHCodGW_ak042.jpg',data:[],uploadType:{succeed:true,error:false,loading:false}},{imgName:'图片2.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',data:[],uploadType:{succeed:false,error:true,loading:false}},{imgName:'图片3.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',data:[],uploadType:{succeed:false,error:false,loading:true}},{imgName:'xxx.pdf',dataImg:'http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/05/34/Ck1AZF8ySs-AFK9dACAcLbc8Su4554.pdf',data:[],uploadType:{succeed:true,error:false,loading:false}}]",
			// "exampleValue":[{imgName:'图片1.jpg',dataImg:'http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/04/61/Ck1AZF76q1KATDusAAHCodGW_ak042.jpg'},{imgName:'图片2.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg'},{imgName:'图片3.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg'},{imgName:'xxx.pdf',dataImg:'http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/05/34/Ck1AZF8ySs-AFK9dACAcLbc8Su4554.pdf'}],
			// "defaultValue":"[{imgName:'图片1.jpg',dataImg:'http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/04/61/Ck1AZF76q1KATDusAAHCodGW_ak042.jpg'},{imgName:'图片2.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg'},{imgName:'图片3.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg'},{imgName:'xxx.pdf',dataImg:'http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/05/34/Ck1AZF8ySs-AFK9dACAcLbc8Su4554.pdf'}]",
			"exampleValue":[{imgName:'图片1.jpg',dataImg:'http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/04/61/Ck1AZF76q1KATDusAAHCodGW_ak042.jpg',status: 'success'},{imgName:'图片2.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',status: 'error'},{imgName:'图片3.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',status: 'loading'},{imgName:'xxx.pdf',dataImg:'http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/05/34/Ck1AZF8ySs-AFK9dACAcLbc8Su4554.pdf',status: 'success'}],
			"defaultValue":"[{imgName:'图片1.jpg',dataImg:'http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/04/61/Ck1AZF76q1KATDusAAHCodGW_ak042.jpg',status: 'success'},{imgName:'图片2.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',status: 'error'},{imgName:'图片3.jpg',dataImg:'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/2934349b033b5bb5c7cf574830d3d539b600bc6f.jpg',status: 'loading'},{imgName:'xxx.pdf',dataImg:'http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/05/34/Ck1AZF8ySs-AFK9dACAcLbc8Su4554.pdf',status: 'success'}]",
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
			"description":"设定上传图片或文件的大小，单位KB"
		},
		{
			"type":"number",
			"exampleValue":5,
			"defaultValue":5,
			"key":"dNum",
			"description":"设定上传图片的数量，只限 “thumb,moduleType” 使用"
		},
        {
			"type":"function",
			"exampleValue":'',
            "defaultValue":'',
			"key":"clearData",
			"description":"清除数据"
		},
        {
			"type":"boolean",
			"exampleValue":false,
            "defaultValue":false,
			"key":"file",
			"description":"上传文件功能，，值适用于noThumb默认false"
		},
        {
			"type":"object",
			"exampleValue":['png','docx','xlsx'],
            "defaultValue":"['png','docx','xlsx']",
			"key":"fileTypes",
			"description":"与file搭配，file为true后，此选项必填"
		},
		{
			"type":"string",
			"exampleValue":"http://sitetest.tf56.com/fastdfsWeb/dfs/group1/M00/0A/24/CgcN7VtNhFmAHEbtAABHOlfUJaE375.png",
			"key":"defaultImg",
			"description":"示例图片，只适用于moduleType为example"
		},
		{
			"type":"string",
			"exampleValue":"上传图片清晰可见，不可超过3M，支持jpg、jpeg、png",
			"defaultValue":"上传图片清晰可见，不可超过3M，支持jpg、jpeg、png",
			"key":"exampleText",
			"description":"提示文字，只适用于moduleType为example"
		},
		{
			"type":"object",
			"exampleValue":"{a:1,b:2}",
			"defaultValue":"{a:1,b:2}",
			"key":"params",
			"description":"接口参数配置"
		},
		{
			"type":"boolean",
			"exampleValue":false,
			"defaultValue":false,
			"key":"readonly",
			"description":"是否只读"
		}],
	"attrs":[],
	"deps":["scmsModules/imageUpload/imageUpload"],
	"html":`
	<h3>noThumb</h3>
	<div image-upload module-type=\"moduleType\" clear-data=\"clearData\" api-url=\"apiUrl\" image-urls=\"imageUrls\" d-width=\"dWidth\" d-height=\"dHeight\" d-size=\"dSize\" file-types=\"fileTypes\"></div>
	<hr>
	<h3>thumb</h3>
	<div image-upload module-type=\"'thumb'\" api-url=\"apiUrl\" image-urls=\"imageUrls\" d-width=\"dWidth\" d-height=\"dHeight\" d-size=\"dSize\" d-num=\"dNum\"></div>
	<hr>
	<h3>example</h3>
	<div image-upload module-type=\"'example'\" api-url=\"apiUrl\" default-img=\"{{defaultImg}}\" example-text=\"{{exampleText}}\" image-urls=\"imageUrls\" d-width=\"dWidth\" d-height=\"dHeight\" d-size=\"dSize\"></div>`,
	"api":"",
	"htmlUrl":""
}