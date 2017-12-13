//index.js
//获取应用实例
const app = getApp()


Page({
    data: {
        tab:0,
        todayNum:0,
        tjHeight:300,
        imgUrls: [
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],

    },

    changeIndex:function (e) {
        this.setData({
            tab: e.detail.current
        })
    },
    initScreen:function () {
        let _this=this;
        wx.getSystemInfo({
            success: function(res) {
                let  w= res.windowWidth;
                let  h = res.windowHeight;
                _this.setData({
                    tjHeight:  h -300
                })

            }
        })
    },

    getRunData:function () {
        let _this=this;
        wx.login({
            success: function(loginRes) {
                if (loginRes.code) {

                    wx.getWeRunData({
                        success(runRes) {
                            const encryptedData = runRes.encryptedData;
                            //发起网络请求
                            wx.request({
                                url: app.API_URL + "wei/xin/post/decrypt/data",
                                method: "POST",
                                data:{
                                    iv:runRes.iv,
                                    encryptedData:runRes.encryptedData,
                                    code:loginRes.code
                                },
                                success: function (data) {
                                    console.log(data.data)
                                    if(data.data.data.stepInfoList){
                                        _this.setData({
                                            todayNum: data.data.data.stepInfoList[data.data.data.stepInfoList.length-1].step,

                                        })
                                    }


                                }
                            })

                        }
                    });
                    console.log(loginRes.code)
                } else {

                }
            }
        });
    },

    onLoad: function () {
        this.initScreen();
        this.getRunData();

    },
    tab:function (e) {
        let  index= e.currentTarget.dataset.index
        this.setData({
            tab: index
        })
    }
})
