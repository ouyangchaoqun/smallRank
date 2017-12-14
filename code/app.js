//app.js
App({

    API_URL: "http://api.mood.hh-idea.com/api/v1/",

    // API_URL: "http://api.m.xqzs.cn/api/v1/",
    WEB_DOMAIN: 'http://js.mood.hh-idea.com/',

    onLaunch: function () {

        let _this = this;
        let user = wx.getStorageSync('user') || {};



        if (!user.id) {
            // 获取用户信息
            wx.getSetting({
                success: res => {
                    if (!res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        console.log("/ 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框")
                        wx.getUserInfo({
                            success: res => {
                                // 可以将 res 发送给后台解码出 unionId
                                // this.globalData.userInfo = res.userInfo

                                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                // 所以此处加入 callback 以防止这种情况
                                if (_this.userInfoReadyCallback) {
                                    _this.userInfoReadyCallback(res)
                                }
                            },
                            fail: function (res) {
                                wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                                console.log("授权许可")
                                wx.showModal({
                                    title: '授权许可',
                                    content: '是否授权访问您的信息???',
                                    success: function (res) {
                                        if (res.confirm) {
                                            wx.openSetting({
                                                success: function (data) {
                                                    if (data) {
                                                        if (data.authSetting["scope.userInfo"] == true) {
                                                            loginStatus = true;
                                                            wx.getUserInfo({

                                                                success: function (data) {

                                                                    wx.reLaunch({
                                                                        url: '/pages/index/index'
                                                                    })
                                                                },
                                                                fail: function () {
                                                                    console.info("3授权失败返回数据");
                                                                }
                                                            });
                                                        }
                                                    }
                                                    76
                                                },
                                                fail: function () {
                                                    console.info("设置失败返回数据");
                                                }
                                            });
                                        } else if (res.cancel) {

                                        }
                                    }
                                });
                                console.log("fail")
                                console.log(res)
                            },
                            complete:function (res) {

                            }
                        })
                    }
                }
            })

        } else {
            _this.getUserRunData();

        }


    },

    run:{
        dateTime: {
            DATE_TIME: "date_time",
            TIME: "time",
            DATE_PATH: "date_path",
            _format: function (type, time) {
                time = time * 1000;
                let now = new Date(time);
                let year = now.getFullYear();
                let month = now.getMonth() + 1;
                let date = now.getDate();
                let hour = now.getHours();
                let minute = now.getMinutes();
                let second = now.getSeconds();
                if (month < 10) month = "0" + month;
                if (date < 10) date = "0" + date;
                if (hour < 10) hour = "0" + hour;
                if (minute < 10) minute = "0" + minute;
                if (second < 10) second = "0" + second;
                if (type === this.DATE_TIME) {
                    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
                } else if (type === this.TIME) {
                    return hour + ":" + minute;
                } else if (type === this.DATE_PATH) {
                    return year + "/" + month + "/" + date
                }
            },
            formatTime: function (time) {
                return this._format(this.TIME, time);
            },
            formatDateTime: function (time) {
                return this._format(this.DATE_TIME, time);
            },
            getTimeStamp: function (dateTime) {
                var _timestamp = new Date().getTime();
                if (dateTime) {
                    _timestamp = Date.parse(dateTime);
                }
                _timestamp = parseInt(_timestamp / 1000);
                return _timestamp;


            }


        },
    },


    getUserRunData: function () {
        let _this = this;
        wx.login({
            success: function (loginRes) {
                console.log(loginRes);
                wx.getWeRunData({
                    success(runRes) {
                        //发起网络请求
                        wx.request({
                            url: _this.API_URL + "wei/xin/post/decrypt/data",
                            method: "POST",
                            data: {
                                iv: runRes.iv,
                                encryptedData: runRes.encryptedData,
                                code: loginRes.code
                            },
                            success: function (data) {

                                if (data.data.data.stepInfoList) {
                                    _this.setRunStorageData(data.data.data.stepInfoList);
                                }


                            }
                        })

                    }
                });
            }
        });
    },

    getUser: function () {
        return wx.getStorageSync('user');
    },
    getUserId: function () {
        let user = this.getUser();
        return user.id;
    },
    setUser: function (user) {
        wx.setStorageSync('user', user)
    },
    getRunStorageData: function () {
        return wx.getStorageSync('runData');
    },
    setRunStorageData: function (data) {
        wx.setStorageSync('runData', data)
    },
    globalData: {
        userInfo: null
    }
})