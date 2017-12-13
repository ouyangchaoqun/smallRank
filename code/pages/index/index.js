//index.js
//获取应用实例
const app = getApp()
import marquee from '../marquee/marquee.js';
var options = Object.assign(marquee, {
    data: {
        userId:1275,
        marquee: { text: '生命在于运动，您迈出的每一步都将带来价值！每天都可将前一天的运动步数兑换成积分哟！' },
        tab:0,
        tabOver:false,
        todayNum:0,
        tjHeight:300,
        wHeight:600,
        today:[],
        yesterday:[],
        lastMonth:[],
        lastWeek:[],
        user:{},
        myRank:{rank:1},
        myTodayRank:{rank:1}
    },
    care:function (e) {
        let _this = this;
        let type = e.currentTarget.dataset.type;
        let index = e.currentTarget.dataset.index;

        let item;
        let dataType="day";
        if (type == "today") {
            item = _this.data.today[index];
        } else if (type == "yesterday") {
            item = _this.data.yesterday[index];
        } else if (type == "lastWeek") {
            dataType= "week";
            item = _this.data.lastWeek[index];
        } else if (type == "lastMonth") {
            dataType= "week";
            item = _this.data.lastMonth[index];
        }
        console.log(item)
        wx.request({
            url: app.API_URL + "werun/care",
            method: "PUT",
            data: {
                userId: _this.data.userId,
                withId : item.id,
                type:dataType
            },
            success: function (data) {
                if(data.data.status===1){
                    let dataRe =[];

                    if (type === "today") {
                        dataRe =  _this.data.today
                    } else if (type === "yesterday") {
                        dataRe =  _this.data.yesterday
                    } else if (type === "lastWeek") {
                        dataRe =  _this.data.lastWeek
                    } else if (type === "lastMonth") {
                        dataRe =  _this.data.lastMonth
                    }
                    dataRe[index].careCount=data.data.data.count;
                    dataRe[index].careMe=1;
                    dataRe[index].hit=true;
                    if (type === "today") {
                        _this.setData({
                            today:dataRe
                        })
                    } else if (type === "yesterday") {
                        _this.setData({
                            yesterday:dataRe
                        })
                    } else if (type === "lastWeek") {
                        _this.setData({
                            lastWeek:dataRe
                        })
                    } else if (type === "lastMonth") {
                        _this.setData({
                            lastMonth:dataRe
                        })
                    }
                }



            }
        })


    },
    scroll:function (e) {
        let top=e.detail.scrollTop;
        if(top>=416){
            this.setData({
                tabOver:true,
            })
        }else{
            this.setData({
                tabOver:false,
            })
        }
    },
    initScreen:function () {
        let _this=this;
        wx.getSystemInfo({
            success: function(res) {
                let  w= res.windowWidth;
                let  h = res.windowHeight;
                _this.setData({
                    wHeight:h-75,
                    tjHeight:  h -300
                })

            }
        })
    },
    getUserInfo: function () {
        let _this = this;
        wx.request({
            url: app.API_URL + "user/find/by/user/Id/" + this.data.userId,
            method: "GET",
            success: function (data) {
                _this.setData({
                    user: data.data.data
                })

            }
        })
    },
    getMyRank:function (index) {
        if(index==0){
            this.setData({
                myRank: this._getMyRank(this.data.today),
                myTodayRank: this._getMyRank(this.data.today),
            })
        }else if(index==1){
            this.setData({
                myRank: this._getMyRank(this.data.yesterday),
            })
        }else if(index==2){
            this.setData({
                myRank: this._getMyRank(this.data.lastWeek),
            })
        }else if(index==3){
            this.setData({
                myRank: this._getMyRank(this.data.lastMonth),
            })
        }
    },
    _getMyRank:function (data) {
        let rank={rank:1};
        for(let i =0;i<data.length;i++){
            if(data[i].userId==this.data.userId){
                rank=data[i];
                rank.rank=i+1;
                console.log("rankrankrankrankrank")
                console.log(rank)
                break
            }
        }
        return rank;
    },
    getRunData:function () {
        let _this=this;
        wx.login({
            success: function(loginRes) {
                console.log(loginRes)
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




                                    //获取本地userid
                                    //若本地userid 空则去获取
                                    if(data.data.data.session_key){
                                        let unionid= data.data.data.session_key.unionid;

                                    }


                                    if(data.data.data.stepInfoList){
                                        _this.setData({
                                            todayNum: data.data.data.stepInfoList[data.data.data.stepInfoList.length-1].step,
                                        });
                                        wx.request({
                                            url: app.API_URL + "werun/"+_this.data.userId,
                                            method: "PUT",
                                            data:data.data.data.stepInfoList,
                                            success: function (data) {
                                                _this.getLastWeekData();
                                                _this.getLastMonthData();
                                                _this.getTodayData();
                                                _this.getYesterdayData();

                                            }
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
    getTodayData:function () {
        let _this=this;
        this._getData("today",function (data) {
            _this.setData({
                today: data.data.data.rows
            });
            _this.getMyRank(0);
        })
    },
    getYesterdayData:function () {
        let _this=this;
        this._getData("yesterday",function (data) {
            _this.setData({
                yesterday: data.data.data.rows
            })
        })
    },
    getLastMonthData:function () {
        let _this=this;
        this._getData("last/month",function (data) {
            _this.setData({
                lastMonth: data.data.data.rows
            })
        })
    },
    getLastWeekData:function () {
        let _this=this;
        this._getData("last/week",function (data) {
            _this.setData({
                lastWeek: data.data.data.rows
            })
        })
    },
    _getData:function (type,callback) {
        wx.request({
            url: app.API_URL + "werun/rank/"+type+"/"+this.data.userId+"/1/400",
            method: "GET",
            success: function (data) {
                console.log(data)
                callback(data);
            }
        })
    },
    onLoad: function () {
        this.initScreen();
        this.getRunData();
        this.getLastWeekData();
        this.getLastMonthData();
        this.getTodayData();
        this.getYesterdayData();

        this.getUserInfo();

        const str = this.data.marquee.text;
        const width = this.getWidth(str);
        console.log('width',width);
        this.setData({ [`${'marquee'}.width`]: width });

    },
    tab:function (e) {
        let  index= e.currentTarget.dataset.index
        this.setData({
            tab: index
        });
        this.getMyRank(index);
    }
});
Page(options);

