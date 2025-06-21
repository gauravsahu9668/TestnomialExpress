const Razorpay=require('razorpay')
require("dotenv").config()
exports.instance=new Razorpay({
    key_id:"rzp_test_f9jmD3i6pHEM3U",
    key_secret:"JBKfxznCBECiXh4a3LiCDcjr",
})