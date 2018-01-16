//logs.js


Page({
    data: {
        logs: [],
    },

    onLoad: function () {

    },
    onShow:function () {
        var animation = wx.createAnimation({
            duration:'1000',
            timingFunction: 'linear',
            delay:'400'
        })
        animation.top(0+'rpx').step()
        this.setData({
            animationData:animation.export()
        });
    },
    goGroup:function () {
        wx.navigateTo({
            url: '../groupDetail/groupDetail'
        })
    },
})
