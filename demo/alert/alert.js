export default {
    title: "Alert",
    author: "tianyanrong",
    buttons: [
        {
            "value": "Info提示",
            "callback": "$.alert('这个显示提示内容！', {type:'info'});"
        },
        {
            "value": "Warning提示",
            "callback": "$.alert('这个显示提示内容！', {type:'warning'});"
        },
        {
            "value": "Success提示",
            "callback": "$.alert('这个显示提示内容！', {type:'success'});"
        },
        {
            "value": "Error提示",
            "callback": "$.alert('这个显示提示内容！', {type:'error'});"
        },
        {
            "value": "确认提示",
            "callback": "$.alert('是否确认删除此记录？', {type:'confirm', callback:function() {console.log('执行：确认提示回调函数')}});"
        },
        {
            "value": "确认提示有title,有回调函数，同时自动关闭弹出框",
            "callback": "$.alert('是否确认删除此记录？', {type:'confirm', title:'确认提示',callback:function() {console.log('执行：确认提示回调函数')}});"
        },
        {
            "value": "确认提示有title,有回调函数，提交后需在回调中调用关闭弹出框事件",
            "callback": "$.alert('是否确认删除此记录？', {type:'confirm', title:'确认提示',submit:function(object) {object.hide();}});"
        }
    ]
}