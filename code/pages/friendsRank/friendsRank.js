//logs.js


Page({
    data: {
        logs: []
    },
    onLoad: function () {
        this.setData({

        })
    },
    goHistory:function () {
        wx.navigateTo({
            url: '../rankHistory/rankHistory'
        })
    }
})
