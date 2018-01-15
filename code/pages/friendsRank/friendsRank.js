const app = getApp()
Page({
    data: {
        logs: [],
        user:app.getUser(),
        info:{},
        medal:[{v:3000,t:'魅力新人'},{v:5000,t:'毅力帝'},{v:10000,t:'战无不胜'},{v:20000,t:'六出祁山'},{v:30000,t:'手机放哪了'},{v:50000,t:'什么情况'},{v:500,t:'蓝癌晚期'}],
        count:0,
        card:{},
        isShowCard:false
    },

    onShareAppMessage: function (res) {
        console.log(res)
        let _this=this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            path: '/pages/index/index?fromuserid='+_this.data.userId,
            success: function(res) {
                // 转发成功
                console.log(res)
                wx.getShareInfo({
                    shareTicket: res.shareTickets[0],
                    success: function (res) {

                        wx.login({
                            success: function (loginRes) {
                                wx.request({
                                    url: app.API_URL + "wei/xin/post/decrypt/data",
                                    method: "POST",
                                    data: {
                                        iv: res.iv,
                                        encryptedData: res.encryptedData,
                                        code: loginRes.code
                                    },
                                    success: function (data) {
                                        console.log(data.data.data);
                                        console.log(data.data.data.openGId);
                                        _this.setData({
                                            ggggggid:data.data.data.openGId
                                        })

                                    }
                                })
                            }
                        })


                        console.log(res)
                    },
                    fail: function (res) {
                        console.log(res)
                    },
                })
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
    onLoad: function () {
        this.setData({
            user:app.getUser()
        })
        this.getUserInfo();
    },
    getUserInfo:function () {
        let _this= this;
        wx.request({
            url: app.API_URL + "werun/get/userInfo/"+ app.getUserId(),
            method: "GET",
            success: function (data) {
                console.log(data);
                _this.setData({
                    info:data.data.data
                })
                let max = data.data.data.maxStep;
                for(let i =0;i<_this.data.medal.length;i++){
                    if( max >=_this.data.medal[i].v ){
                        let item= _this.data.medal[i];
                        item.on=true;
                        _this.setData({
                            ['medal['+i+']']:item,
                            count:++_this.data.count
                        })
                    }
                }

            }
        })
        // 1275
    },
    showCard:function (e) {
        console.log(e);


        let index = e.currentTarget.dataset.index;
        let item = this.data.medal[index]

        if(item.on){
            this.setData({
                isShowCard:true,
                card:item
            })

        }




    },
    goHistory:function () {
        wx.navigateTo({
            url: '../rankHistory/rankHistory'
        })
    },
    close:function(){
      this.setData({
      isShowCard: false,
      })
    }
})
