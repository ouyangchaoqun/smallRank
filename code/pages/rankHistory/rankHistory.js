//logs.js


Page({
    data: {
        logs: [],
    },

    onLoad: function () {

    },
    onShow:function () {
        var animation = wx.createAnimation({
            duration:'3000',
            timingFunction: 'linear',
            delay:'400'
        })
        animation.top(14+'rpx').step()
        this.setData({
            animationData:animation.export()
        });
    }
})
