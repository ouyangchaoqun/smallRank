//logs.js

const app = getApp()
Page({
    data: {
        list: [],
        pkId:''

    },

    onLoad: function (option) {
        console.log(option.pkId)
        this.setData({
            pkId : option.pkId
        })
        this.getList()
    },
    initRunDataItem:function (item) {
        item.nickName=  item.nickName.substring(0,7);
        item.faceUrl= app.string.smallFace(item.faceUrl);
        if(item.sex==1){
            item.km= Math.ceil(item.step * 0.74 / 1000);
            item.kll=Math.ceil(item.step * 0.74 / 1000 * 40)
        }else{
            item.km= Math.ceil(item.step * 0.66 / 1000);
            item.kll=Math.ceil(item.step * 0.66 / 1000 * 35)
        }
        return item;
    },
    getList:function () {
        let _this= this;
        let userId = app.getUserId();
        wx.request({
            url: app.API_URL + "werun/rank/pk/"+userId+'/'+_this.data.pkId,
            method: "GET",
            success: function (data) {
                for(let i=0;i<data.data.data.list.length;i++){
                    data.data.data.list[i] =_this.initRunDataItem( data.data.data.list[i] );
                }
                _this.setData({
                    list: data.data.data.list
                })
            }
        })
    }
})
