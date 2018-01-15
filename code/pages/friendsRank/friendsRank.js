//logs.js


Page({
    data: {
        logs: []
    },
    onLoad: function () {
        this.setData({
            isShowCard:true,

        })
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
