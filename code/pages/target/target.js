//logs.js


Page({
    data: {
        logs: [],
        list:[0,1,2,3,4],
        select:0
    },

    select:function(e){
      var n = e.currentTarget.dataset.index
      this.setData({
        select:n
      })
    },
    onLoad: function () {
        this.setData({

        })
    }
})
