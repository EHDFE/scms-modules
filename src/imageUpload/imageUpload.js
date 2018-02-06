/**
 * <directive>
 * @description 图片上传
 * @date 2018-02-02
 * @author 程乐
 * @lastBy 
 * @html 
 */

import angular from "angular";
// import angularFileUpload from "angular-file-upload";
import html from "./imageUpload.html";

export default (app, elem, attrs, scope) => {
  app.directive("imageUpload", [
    "$timeout",
    function($timeout) {
      return {
        template: html,
        restrict: 'EA',
        replace: true,
        scope: {
            imageUrls: '=',
            moduleType: '=',
            dWidth: '=',
            dHeihgt: '=',
            dSizi: '=',
            apiUrl: '='
        },
        controller: [
          "$scope",
          "$element",
          "$attrs",
          "$timeout",
          function($scope, $element, $attrs, $timeout) {},
        ],
        link: function($scope, $element, $attrs, ngModel) {
            // $scope.uploader = new FileUploader();
            $scope.type = 1;
            $scope.imageArray = [
                {
                    imgName: '图片1.jpg',
                    uploadType: {
                        succeed: true,
                        error: false,
                        loading: false
                    }
                },
                {
                    imgName: '图片2.jpg',
                    uploadType: {
                        succeed: false,
                        error: true,
                        loading: false
                    }
                },
                {
                    imgName: '图片3.jpg',
                    uploadType: {
                        succeed: false,
                        error: false,
                        loading: true
                    }
                }
            ]

            $scope.remove = (item,index) => {
                $scope.imageArray.splice(index,1);
            }

            // 上传
            var $file = $element.find('input');
            $element.on('change','input', function(event) {
                var file=event.currentTarget;
                if(!file.files || (file.files && !file.files.length)) {
                    return;
                }
                angular.forEach(file.files, function(item, index) {
                    if(!/\.(jpg|jepg|png|bmp)$/.test(item.name)){
                        G.alert('请上传格式为JPG/PNG/BMP格式的图片',{type:'error'});
                    }else{
                        verify(item);
                    }
                });

            });
            // 验证
            function verify(file){
                var data=new FormData();
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(theFile) {
　　                         var image = new Image();
                    image.src = theFile.target.result;
                    image.onload = function() {
                        if($scope.dWidth && this.width !== $scope.dWidth) {
                            setError(1);
                        }
                        else if($scope.dHeight && this.height !== $scope.dHeight) {
                            setError(2);
                        }
                        else if($scope.dSize && file.size/1024 > parseInt($scope.dSize, 10)) {
                            setError(3);
                        }else{
                            $scope.imageArray.push({
                                imgName: file.name,
                                uploadType: {
                                    succeed: false,
                                    error: false,
                                    loading: true
                                }
                            });
                            var index = $scope.imageArray.length-1;
                            $scope.$apply();
                            data.append('file', file);
                            // $scope.urls.push({
                            //     imageurl: ''
                            // });
                            uploadImage(data,index);
                            
                        }
                    };
                };
            }
            // 请求
            function uploadImage(data,index){




                // $http.post( $scope.apiUrl, data, {
                //     transformRequest: angular.identity,
                //     headers: { "Content-Type": undefined }
                // })
                // .success(function(d){
                //     console.log(d)
                // })
                // .error( function(d){
                //     console.log(d)
                // })



                // $.ajax({
                //     url: $scope.apiUrl,
                //     type: 'POST',
                //     iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',
                //     body: data,
                    
                //     // dataType: "jsonp",

                //     timeout: 30000,
                //     processData: false, //用来回避jquery对formdata的默认序列化，XMLHttpRequest会对其进行正确处理  
                //     contentType: false, //设为false才会获得正确的conten-Type  
                //     xhr: function() { //用以显示上传进度  
                //         var xhr = $.ajaxSettings.xhr();
                //         if (xhr.upload) {
                //             xhr.upload.addEventListener('progress', function(event) {
                //                 var percent = Math.floor(event.loaded / event.total * 100);
                //                 // document.querySelector("#progress .progress-item").style.width = percent + "%";
                //                 console.log(event)
                //             }, false);
                //         }
                //         return xhr
                //     },
                //     complete: function(d) {
                //         console.log(d,1)
                //     },
                //     error: function(d){
                //         $scope.imageArray[index].uploadType = {
                //             succeed: false,
                //             error: true,
                //             loading: false
                //         };
                //         $scope.$apply();
                //     }
                // })


                // var xhr=new XMLHttpRequest();
                // xhr.onloadstart = function(evt){
                //     console.log('开始')
                // }
                //     xhr.upload.onprogress = function(evt) {
                //         if (evt.lengthComputable) {
                //             var percentComplete = evt.loaded / evt.total;
                //             console.log(percentComplete)
                //         } else {
                //             console.log('无法计算进度信息，总大小是未知的',evt)
                //         }
                //     }
                //     xhr.onload = function(evt) {
                //         console.log("传输完成.",evt);
                //     }
                //     xhr.onerror = function(evt) {
                //         console.log("在传输文件时发生了错误.",evt);
                //     }

                // xhr.open("post", $scope.apiUrl);
                // xhr.onreadystatechange=function(){
                //     console.log(xhr.status)
                //     if(xhr.readyState==4){
                //         if(xhr.status === 200) {
                //         console.log(1)
                //             // var result=JSON.parse(xhr.responseText);
                //             // show(result);
                //         }
                //         else if(xhr.status === 413) {
                //         console.log(2)
                //             // $timeout(function() {
                //             //     setError(3);
                //             //     $scope.urls.splice($scope.urls.length -1, 1);
                //             //     $file.val('');
                //             // });
                //         }
                //         else {
                //             $scope.imageArray[index].uploadType = {
                //                 succeed: false,
                //                 error: true,
                //                 loading: false
                //             };
                //             $scope.$apply();
                //             // $timeout(function() {
                //             //     G.alert('上传图片失败，请重试', {
                //             //         type: 'error',
                //             //         speed: 5000
                //             //     });
                //             //     $scope.urls.splice($scope.urls.length -1, 1);
                //             //     $file.val('');
                //             // });
                //         }

                //     }
                // };
                // xhr.send(data);
                
            }
        }
      };
    },
  ]);
};


// define([
//     'angular',
//     './imageUpload.html'
//     ], function(
//         angular,
//         html,
//         css) {
//         return function(app, elem, attrs, scope) {
//             app.directive('imageUpload', ['$timeout', '$document', '$compile',function($timeout, $document, $compile) {
//                 return {
//                     template: html,
//                     restrict: 'EA',
//                     replace: true,
//                     scope: {
//                         moduleType: '=',
//                         dWidth: '=',
//                         dHeihgt: '=',
//                         dSizi: '=',
//                         apiUrl: '='
//                     },
//                     link: function postLink() {

//                     },
//                     controller: function($scope,$element,$attrs,$transclude,$log,$http,G){
//                         $scope.type = 1;
//                         $scope.imageArray = [
//                             {
//                                 imgName: '图片1.jpg',
//                                 uploadType: {
//                                     succeed: true,
//                                     error: false,
//                                     loading: false
//                                 }
//                             },
//                             {
//                                 imgName: '图片2.jpg',
//                                 uploadType: {
//                                     succeed: false,
//                                     error: true,
//                                     loading: false
//                                 }
//                             },
//                             {
//                                 imgName: '图片3.jpg',
//                                 uploadType: {
//                                     succeed: false,
//                                     error: false,
//                                     loading: true
//                                 }
//                             }
//                         ]

//                         $scope.remove = (item,index) => {
//                             $scope.imageArray.splice(index,1);
//                         }

//                         // 上传
//                         var $file = $element.find('input');
//                         $element.on('change','input', function(event) {
//                             var file=event.currentTarget;
//                             if(!file.files || (file.files && !file.files.length)) {
//                                 return;
//                             }
//                             angular.forEach(file.files, function(item, index) {
//                                 if(!/\.(jpg|jepg|png|bmp)$/.test(item.name)){
//                                     G.alert('请上传格式为JPG/PNG/BMP格式的图片',{type:'error'});
//                                 }else{
//                                     verify(item);
//                                 }
//                             });

//                         });
//                         // 验证
//                         function verify(file){
//                             var data=new FormData();
//                             var reader = new FileReader();
//                             reader.readAsDataURL(file);
//                             reader.onload = function(theFile) {
//     　　                         var image = new Image();
//                                 image.src = theFile.target.result;
//                                 image.onload = function() {
//                                     if($scope.dWidth && this.width !== $scope.dWidth) {
//                                         setError(1);
//                                     }
//                                     else if($scope.dHeight && this.height !== $scope.dHeight) {
//                                         setError(2);
//                                     }
//                                     else if($scope.dSize && file.size/1024 > parseInt($scope.dSize, 10)) {
//                                         setError(3);
//                                     }else{
//                                         $scope.imageArray.push({
//                                             imgName: file.name,
//                                             uploadType: {
//                                                 succeed: false,
//                                                 error: false,
//                                                 loading: true
//                                             }
//                                         });
//                                         var index = $scope.imageArray.length-1;
//                                         $scope.$apply();
//                                         data.append('file', file);
//                                         // $scope.urls.push({
//                                         //     imageurl: ''
//                                         // });
//                                         uploadImage(data,index);
                                        
//                                     }
//                                 };
//                             };
//                         }
//                         // 请求
//                         function uploadImage(data,index){
//                             $scope.uploader = new FileUploader();




//                             // $http.post( $scope.apiUrl, data, {
//                             //     transformRequest: angular.identity,
//                             //     headers: { "Content-Type": undefined }
//                             // })
//                             // .success(function(d){
//                             //     console.log(d)
//                             // })
//                             // .error( function(d){
//                             //     console.log(d)
//                             // })



//                             // $.ajax({
//                             //     url: $scope.apiUrl,
//                             //     type: 'POST',
//                             //     iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',
//                             //     body: data,
                                
//                             //     // dataType: "jsonp",

//                             //     timeout: 30000,
//                             //     processData: false, //用来回避jquery对formdata的默认序列化，XMLHttpRequest会对其进行正确处理  
//                             //     contentType: false, //设为false才会获得正确的conten-Type  
//                             //     xhr: function() { //用以显示上传进度  
//                             //         var xhr = $.ajaxSettings.xhr();
//                             //         if (xhr.upload) {
//                             //             xhr.upload.addEventListener('progress', function(event) {
//                             //                 var percent = Math.floor(event.loaded / event.total * 100);
//                             //                 // document.querySelector("#progress .progress-item").style.width = percent + "%";
//                             //                 console.log(event)
//                             //             }, false);
//                             //         }
//                             //         return xhr
//                             //     },
//                             //     complete: function(d) {
//                             //         console.log(d,1)
//                             //     },
//                             //     error: function(d){
//                             //         $scope.imageArray[index].uploadType = {
//                             //             succeed: false,
//                             //             error: true,
//                             //             loading: false
//                             //         };
//                             //         $scope.$apply();
//                             //     }
//                             // })


//                             // var xhr=new XMLHttpRequest();
//                             // xhr.onloadstart = function(evt){
//                             //     console.log('开始')
//                             // }
//                             //     xhr.upload.onprogress = function(evt) {
//                             //         if (evt.lengthComputable) {
//                             //             var percentComplete = evt.loaded / evt.total;
//                             //             console.log(percentComplete)
//                             //         } else {
//                             //             console.log('无法计算进度信息，总大小是未知的',evt)
//                             //         }
//                             //     }
//                             //     xhr.onload = function(evt) {
//                             //         console.log("传输完成.",evt);
//                             //     }
//                             //     xhr.onerror = function(evt) {
//                             //         console.log("在传输文件时发生了错误.",evt);
//                             //     }

//                             // xhr.open("post", $scope.apiUrl);
//                             // xhr.onreadystatechange=function(){
//                             //     console.log(xhr.status)
//                             //     if(xhr.readyState==4){
//                             //         if(xhr.status === 200) {
//                             //         console.log(1)
//                             //             // var result=JSON.parse(xhr.responseText);
//                             //             // show(result);
//                             //         }
//                             //         else if(xhr.status === 413) {
//                             //         console.log(2)
//                             //             // $timeout(function() {
//                             //             //     setError(3);
//                             //             //     $scope.urls.splice($scope.urls.length -1, 1);
//                             //             //     $file.val('');
//                             //             // });
//                             //         }
//                             //         else {
//                             //             $scope.imageArray[index].uploadType = {
//                             //                 succeed: false,
//                             //                 error: true,
//                             //                 loading: false
//                             //             };
//                             //             $scope.$apply();
//                             //             // $timeout(function() {
//                             //             //     G.alert('上传图片失败，请重试', {
//                             //             //         type: 'error',
//                             //             //         speed: 5000
//                             //             //     });
//                             //             //     $scope.urls.splice($scope.urls.length -1, 1);
//                             //             //     $file.val('');
//                             //             // });
//                             //         }

//                             //     }
//                             // };
//                             // xhr.send(data);
                            
//                         }
                        

                        

                        



//                     }
//                 };
//             }]);
//     };
// });