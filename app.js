//app.js
var fun_aes = require('./utils/aes.js')
var aes = require('./utils/aes.min.js'); //引入aes类包
//十六位十六进制数作为秘钥
var aeskey = aes.CryptoJS.enc.Utf8.parse("zxcvbnmasdfghjkl");
//十六位十六进制数作为秘钥偏移量
var aesiv = aes.CryptoJS.enc.Utf8.parse('mnbvcxzlkjhgfdae');
App({
  onLaunch: function () {
    var that = this;
    console.log("h" + wx.getStorageSync('user_id'))
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)
    var test = false;
    that.globalData.apiUrl = test ? that.globalData.apiUrl : that.globalData.test_apiUrl;
    that.login();
    return false;
  },
  globalData: {
    userInfo: null,
    apiUrl: "https://mini.jrweid.com/",
    test_apiUrl: "https://minitest.jrweid.com/",
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
    console.log("lo " + user_id)
    if (user_id > 0) {
      console.log("PP" + user_id)
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
            var content = JSON.parse(that.decrypt(res.data.data));
             wx.setStorageSync('user_id', content.user_id);
          } else {
          
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
    wx.login({
      success: res => {
        console.log("code： " + res.code);
       // wx.setStorageSync('code', res.code);
        // 接口参数
        var data = { code: res.code };
        wx.request({
          url: that.globalData.apiUrl + "user/register",
          data: { content: that.encrypt(JSON.stringify(data)) },//密文
          header: {},
          method: 'post',
          dataType: 'json',
          success: function (res) {
            if (res.data.code == 200) {
              var user = JSON.parse(that.decrypt(res.data.data));
              wx.setStorageSync('token', user.token);
              console.log("re" + user.user_id);
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