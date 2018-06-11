//index.js
//获取应用实例
const app = getApp();
// app.requestDetailid = id;
Page({
  data: {
    active: [],
    show: false,
    haveMore: true,//加载更多
    categoryList: [],//图片分类
    category_name:"展业",
    imglist: [],//图片列表
    keywords: "",
    currentcategory_type: "",
    card_type: 2,//1名片 2趣图
    page: 1,
    pagesize: 9,
    userInfo: {},
    code: "",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    //图片分类
    that.getClassify();
    //图片列表
    that.setData({
      page: 1,
      haveMore: true,
    });
    that.getCardList(function (res) {
      that.setData({
        imglist: res
      });
    });
  },
  //页面上拉触底事件的处理函数 
  onReachBottom: function () {
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })
    if (!that.data.haveMore) {
      wx.showToast({
        title: '已到底啦'
      });
      return false;
    }
    // 页数+1  
    var page = that.data.page + 1;
    that.setData({
      page: page
    });
    console.log(page);
    //图片列表
    that.getCardList(function (res) {
      var list = that.data.imglist;
      for (var i = 0; i < res.length; i++) {
        list.push(res[i]);
      };
      that.setData({
        imglist: list
      });
      if (res == null || res.length < that.data.pagesize) {
        that.setData({
          haveMore: false
        });
      }
    });
  },
  // 保存关键字
  getvalue: function (e) {
    this.setData({
      keywords: e.detail.value
    });
  },
  // 搜索
  search: function () {
    var that = this;
    that.setData({
      haveMore: true,
      page: 1,
      currentcategory_type: ""
    });
    var imglist = [];
    if (that.data.keywords == undefined ||
      that.data.keywords == null ||
      that.data.keywords.length <= 0) {
      // that.setData({ hiddenData: true });
      wx.showToast({
        title: '请输入关键字',
        duration: 1500
      });
      return;
    };
    //图片列表
    that.getCardList(function (res) {
      that.setData({
        imglist: res
      });
    });
  },
  /** 图片分类类型 */
  getClassify: function () {
    var that = this;
    // var active=[];
    var list = [];
    var data = {
      card_type: that.data.card_type
    };
    wx.request({
      url: app.globalData.apiUrl + "acquisition/classify",
      data: {
        content: app.encrypt(JSON.stringify(data))
      }, //密文
      header: {},
      method: "post",
      success: function (res) {
        if (res.data.code == 200) {
          list = JSON.parse(app.decrypt(res.data.data)).categoryList;
          for (var i = 0; i < list.length; i++) {
            list[i].active = "none";
          };
          //console.log(list);
          that.setData({
            categoryList: list,
            show: true,
          });
        } else {
          console.log((res.data.data));
        };
        // wx.setStorageSync('categoryList', list)
      },
      fail: function (res) { },
      complete: function (res) { },
    });
  },
  /** 图片分类 */
  getCardList: function (callBack) {
    var that = this;
    var imglist = [];
    var data;
    data = {
      card_type: that.data.card_type,
      page: that.data.page,
      category_type: that.data.currentcategory_type,
      keywords: that.data.keywords
    };

    wx.request({
      url: app.globalData.apiUrl + "acquisition/list",
      data: {
        content: app.encrypt(JSON.stringify(data))
      }, //密文
      header: {},
      method: 'post',
      dataType: 'json',
      success: function (res) {
        if (res.data.code == 200) {
          imglist = JSON.parse(app.decrypt(res.data.data)).list;
          
          typeof callBack === 'function' && callBack(imglist)
        } else {
          console.log((res.data.data));
        };
        // 隐藏加载框  
        wx.hideLoading();
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    return imglist;
  },
  //按照分类获取列表
  getList: function (e) {
    var that = this;
    //设置类型 按类型获取图片列表
    var category_type = e.currentTarget.id;
    var list = that.data.categoryList;
    for (var i = 0; i < list.length; i++) {
      if (list[i].category_id == category_type) {
        console.log(list[i].active);
        //设置点击效果
        list[i].active = "active";
       //设置点击后的文案
        that.setData({
          category_name: list[i].category_name
        });
      } else {
        list[i].active = "none";
      }
    };

    that.setData({
      categoryList: list,
      haveMore: true,
      page: 1,
      keywords: "",
      currentcategory_type: category_type
    });
    console.log(e.currentTarget.id);

    //图片列表
    that.getCardList(function (res) {
      that.setData({
        imglist: res
      });
    });
  }
})