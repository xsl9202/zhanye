// pages/detail/detail.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    tel: "",
    id: 0,
    list: {}
  },
  // 存储输入的姓名
  InputName: function (res) {
    this.setData({
      name: res.detail.value
    })
  },
  // 存储输入的手机号
  InputTel: function (res) {
    this.setData({
      tel: res.detail.value
    })
  },
  // 验证手机号和姓名是否正确
  check: function () {
    var that = this;
    var name = that.data.name;
    var phone = that.data.tel;
    if (name) {
      if (phone) {
        if (!(/^1[34578]\d{9}$/.test(phone))) {
          wx.showToast({
            title: '手机号码有误',
            duration: 1500
          });
          return false;
        }
      } else {
        wx.showToast({
          title: '请输入手机号',
          duration: 1500
        });
        return false;
      }
    } else {
      wx.showToast({
        title: '请输入姓名',
        duration: 1500
      });
      return false;
    }
    that.charge();
  },
  // 一键生成
  charge: function (res) {
    var that = this;
    var imgurl;
    // that.setData({
    //   inputValue: res.detail.value
    // });
    console.log(that.data.name + that.data.tel);
    // 接口参数
    var data = { card_id: that.data.id, name: that.data.name, phone: that.data.tel };
    wx.request({
      url: app.globalData.apiUrl + "acquisition/download",
      data: { content: app.encrypt(JSON.stringify(data)) },//密文
      header: {},
      method: 'post',
      dataType: 'json',
      success: function (res) {
        if (res.data.code == 200) {
          console.log(JSON.parse(app.decrypt(res.data.data)));
          imgurl = JSON.parse(app.decrypt(res.data.data)).card_url;
          wx.navigateTo({
            url: '/pages/success/success?card_url=' + imgurl
          });
        } else {
          console.log((res.data.data));
        };
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var list = {};
    this.setData({
      id: options.listId
    });
    //console.log(that.data.id);  
    // 接口参数 获取图片详情
    var data = { card_id: that.data.id };
    wx.request({
      url: app.globalData.apiUrl + "acquisition/detailcard",
      data: { content: app.encrypt(JSON.stringify(data)) },//密文
      header: {},
      method: 'post',
      dataType: 'json',
      success: function (res) {
        if (res.data.code == 200) {
          //console.log(JSON.parse(app.decrypt(res.data.data)));  
          list = JSON.parse(app.decrypt(res.data.data));
          console.log(list.list);
          that.setData({
            list: list.list
          });
        } else {
          console.log((res.data.data));
        };
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})