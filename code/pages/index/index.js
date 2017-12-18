//index.js
//获取应用实例
const app = getApp()
import marquee from '../marquee/marquee.js';
import NumberAnimate from "../../utils/NumberAnimate";
var options = Object.assign(marquee, {
    data: {
        userId:app.getUserId(),
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
        myTodayRank:{rank:1},
        todayChanged:false,
        noticeLink:'',
        timeInData:null,
        todayChangeCoin:{},
        yesterdayChangeCoin:{},
        timetime:0,
        showAddCoinAninate:false,
        todayRunNum:0
    },
    getExChangeCoin:function () {
       //werun/coin/exchange
        let _this=this;
        wx.request({
            url: app.API_URL + "werun/coin/exchange/" + this.data.userId,
            method: "GET",
            success: function (data) {
                if(data.data.status==1){
                    _this.setData({
                        yesterdayChangeCoin: data.data.data[0],
                        todayChangeCoin: data.data.data[1]
                    });
                    if(_this.data.yesterdayChangeCoin.isExchange==1){
                        _this.setData({
                            todayChanged: true,
                        });
                    }
                }


            }
        })

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
            dataType= "month";
            item = _this.data.lastMonth[index];
        }
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
                        });
                        _this.getMyRank(0)
                    } else if (type === "yesterday") {
                        _this.setData({
                            yesterday:dataRe
                        });
                        _this.getMyRank(1)
                    } else if (type === "lastWeek") {
                        _this.setData({
                            lastWeek:dataRe
                        });
                        _this.getMyRank(2)
                    } else if (type === "lastMonth") {
                        _this.setData({
                            lastMonth:dataRe
                        });
                        _this.getMyRank(3)
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
            url: app.API_URL + "user/find/by/user/Id/" + _this.data.userId,
            method: "GET",
            success: function (data) {
                _this.setData({
                    user: data.data.data
                });

            }
        })
    },
    beComeFriend:function () {
        let _this = this;
        let fromuserid= wx.getStorageSync('fromuserid');
        if(fromuserid&&fromuserid!=''){
            console.log("beComeFriendfromus1111111erid"+fromuserid)
            wx.request({
                url: app.API_URL + "user/be/friend/width/ids/"+fromuserid+'/' + _this.data.userId,
                method: "POST",
                success: function (data) {
                    console.log("beComeFriendfrdataerid"+ +"|_this.data.userId"+_this.data.userId);
                    console.log(data)
                    if(data.data.status==1){

                    }


                }
            })


        }
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

                break
            }
        }
        return rank;
    },
    getRunData:function () {
        let _this=this;
        let data = app.getRunStorageData();
        if(data.length>0){
            clearTimeout(_this.data.timeInData);


            let todayRunNumEnd=data[data.length-1].step;

            if(todayRunNumEnd>_this.data.todayNum) {
                let n1 = new NumberAnimate({
                    from: _this.data.todayNum,
                    end:todayRunNumEnd,
                    speed: 1000,
                    refreshTime: 50,
                    decimals: 0,
                    onUpdate: () => {
                        console.log(n1.tempValue)
                        this.setData({
                            todayNum: n1.tempValue
                        });
                    },
                    onComplete: () => {

                    }
                });
            }


            if(_this.data.userId){
                wx.request({
                    url: app.API_URL + "werun/"+_this.data.userId,
                    method: "PUT",
                    data:{stepData:data},
                    success: function (data) {
                        _this.getLastWeekData();
                        _this.getLastMonthData();
                        _this.getTodayData();
                        _this.getYesterdayData();

                    }
                })
            }
        }else{
             _this.setData({
                 timeInData: setTimeout( function () {
                     _this.getRunData();
                 },300)

             })

        }
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
        if(this.data.userId){
            wx.showLoading()
            wx.request({
                url: app.API_URL + "werun/rank/"+type+"/"+this.data.userId,
                method: "GET",
                success: function (data) {
                    callback(data);
                    wx.hideLoading()
                }
            })
        }

    },
    getNotice:function () {
        let _this=this;
        //消息提醒
        wx.request({
            url: app.API_URL + 'werun/last/notice/' + _this.data.userId,
            success: function (res) {
                if (res.data.status == 1) {
                    let noticeLink = '/pages/notice/notice?time=' + app.run.dateTime.getTimeStamp();
                    _this.setData({
                        notice: res.data.data,
                        noticeLink: noticeLink
                    })


                }
            }
        })
    },
    goCareList:function (e) {
        let _this=this;
        let id =  e.currentTarget.dataset.id;
        let count =  e.currentTarget.dataset.count;
        if(count==0)return;
        let type = "day";
        if(_this.data.tab==2){
            type = "week";
        }else   if(_this.data.tab==3){
            type = "month";
        }
         wx.navigateTo({
            url: '/pages/care/list?type='+type+'&id='+id
        })


    },
    onLoad: function (options) {

        if(options.fromuserid) {
            wx.setStorageSync('fromuserid', options.fromuserid)
        }

        console.log("options.fromuserid"+options.fromuserid)
        this.setData({ userId: app.getUserId() });
        this.isChanged();
        this.initScreen();
        this.getUserInfo();
        this.beComeFriend();


        const str = this.data.marquee.text;
        const width = this.getWidth(str);
         this.setData({ [`${'marquee'}.width`]: width });

    },
    initData:function () {
        this.getRunData();
        this.getExChangeCoin();
    },

    onShow:function () {
            let _this = this;
            if(_this.data.userId){

                wx.login({
                    success: function (loginRes) {
                        console.log("showLoainres");
                        wx.getWeRunData({
                            success(runRes) {
                                //发起网络请求
                                wx.request({
                                    url: app.API_URL + "wei/xin/post/decrypt/data",
                                    method: "POST",
                                    data: {
                                        iv: runRes.iv,
                                        encryptedData: runRes.encryptedData,
                                        code: loginRes.code
                                    },
                                    success: function (data) {

                                        if (data.data.data.stepInfoList) {
                                            app.setRunStorageData(data.data.data.stepInfoList);
                                        }
                                        _this.initData();

                                    }
                                })

                            }
                        });
                    }
                });
                _this.getNotice();


            }


    },
    tab:function (e) {
        let  index= e.currentTarget.dataset.index
        this.setData({
            tab: index
        });
        this.getMyRank(index);
    },
    isChanged:function () {
        let _this=this;
        wx.getStorage({
            key: 'todayChanged',
            success: function(res) {

                if(_this.getDateFormat()==res.data.date){
                    _this.setData({
                        todayChanged:true
                    });
                }


            }
        })
    },
    getDateFormat:function () {
        let date=new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return year+"-"+month+'-'+day
    },
    change:function () {
        let _this=this;
        if(this.data.todayChanged){
            return ;
        }
        wx.showLoading();
        wx.request({
            url: app.API_URL + "werun/exchange/coin",
            method: "PUT",
            data:{
                userId:this.data.userId,
            },
            success: function (data) {
                wx.hideLoading();
                 if(data.data.status===1){

                    _this.getUserInfo();
                    wx.setStorage({
                        key:"todayChanged",
                        data:{date:_this.getDateFormat(),changed:true}
                    })
                    _this.setData({
                        todayChanged:true,
                        showAddCoinAninate:true
                    });
                }
            }
        })

    },
    onShareAppMessage: function (res) {
        let _this=this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            path: '/pages/index/index?fromuserid='+_this.data.userId,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }
});
Page(options);

