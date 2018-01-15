const app = getApp()
Page({
    data: {
        logs: [],
        user:app.getUser()
    },
    onLoad: function () {
        this.setData({
            isShowCard:true,
            user:app.getUser()
        })
        this.getUserInfo();
    },
    getUserInfo:function () {
        wx.request({
            url: app.API_URL + "werun/get/userInfo/"+ app.getUserId(),
            method: "GET",
            success: function (data) {
                console.log(data)
            }
        })
        // 1275
    },
    showCard:function () {
        this.setData({
            isShowCard:true
        })

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
