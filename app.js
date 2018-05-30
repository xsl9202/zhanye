//app.js
var fun_aes = require('./utils/aes.js')
var aes = require('./utils/aes.min.js'); //引入aes类包
//十六位十六进制数作为秘钥
//var key = fun_aes.CryptoJS.enc.Utf8.parse("zxcvbnmasdfghjkl");
//十六位十六进制数作为秘钥偏移量
//var iv = fun_aes.CryptoJS.enc.Utf8.parse('mnbvcxzlkjhgfdae');  
//十六位十六进制数作为秘钥
var aeskey = aes.CryptoJS.enc.Utf8.parse("zxcvbnmasdfghjkl");
//十六位十六进制数作为秘钥偏移量
var aesiv = aes.CryptoJS.enc.Utf8.parse('mnbvcxzlkjhgfdae');
App({
  onLaunch: function () {
    var that = this;
    var wo = { code: 78, name: '小明' };
    //aes加密
    var aes_encode = this.encrypt(JSON.stringify(wo))
    //aes解密
    //console.log(aes_encode)
    //console.log(JSON.parse(this.decrypt(aes_encode)))
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    that.login();
    return false;
  },
  // getUserInfo: function (e) {
  //   console.log(e);
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  globalData: {
    userInfo: null,
    apiUrl: "https://minitest.jrweid.com/"
  },
  // 加密
  encrypt: function (data) {
    var srcs = aes.CryptoJS.enc.Utf8.parse(data);
    var encrypted = aes.CryptoJS.AES.encrypt(srcs, aeskey, { iv: aesiv, mode: aes.CryptoJS.mode.CBC, padding: aes.CryptoJS.pad.Pkcs7 });
    //返回base64加密结果
    return encrypted.toString();
  },

  //解密
  decrypt: function (data) {
    // data是base64编码数据
    var decrypt = aes.CryptoJS.AES.decrypt(data, aeskey, { iv: aesiv, mode: aes.CryptoJS.mode.CBC, padding: aes.CryptoJS.pad.Pkcs7 });
    var decryptedStr = decrypt.toString(aes.CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  },
  /**登陆检查 */
  login:function(){
    var that=this;
    var token = wx.getStorageSync('token');
    var user_id = wx.getStorageSync('user_id');
    if (token && user_id) {
      console.log("登录");
      // 接口参数
      var data = { access_token: token, user_id: user_id };
      wx.request({
        url: that.globalData.apiUrl + "user/login",
        data: { content: that.encrypt(JSON.stringify(data)) },//密文
        header: {},
        method: 'post',
        dataType: 'json',
        success: function (res) {
          if (res.data.code == 200) {
            console.log(res);
            //  console.log(JSON.parse(that.decrypt(res.data.data)));
          } else {
            console.log((res.data.data));
          };
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      that.register();
    }
  },
  /**注册 */
  register:function(){
    var that=this;
    console.log("注册");
    wx.login({
      success: res => {
        console.log("code： " + res.code);
       // wx.setStorageSync('code', res.code);
        // 接口参数
        var data = { code: res.code };
        console.log(data);
        wx.request({
          url: that.globalData.apiUrl + "user/register",
          data: { content: that.encrypt(JSON.stringify(data)) },//密文
          header: {},
          method: 'post',
          dataType: 'json',
          success: function (res) {
            if (res.data.code == 200) {
              console.log(res);
              console.log(JSON.parse(that.decrypt(res.data.data)));
              var user = JSON.parse(that.decrypt(res.data.data));
              console.log(user);
              wx.setStorageSync('token', user.token);
               wx.setStorageSync('user_id', user.user_id);
            } else {
              console.log((res.data.data));
            };
          },
          fail: function (res) { },
          complete: function (res) { },
        })
        //console.log( this.Encrypt(res.code))
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
  }
})