const express=require("express")
const axios=require('axios')
const app=express()
const mailsender=require('../mailsender')
require("dotenv").config()
app.use(express.json())
const cors=require('cors')
const crypto=require('crypto')
const PORT=process.env.PORT || 4000
app.use(cors({
    origin:"https://reviewcraft.netlify.app",
    credentials:true,
}))
app.post('/send-email',async(req,res)=>{
    try{
        const {email,title,html}=req.body;
        await mailsender(email,title,html)
        return res.json({
            success:true
        })
    }catch(e){
        return res.json({
            success:true,
            mess:"nhi hua"
        })
    }
})
app.get('/',async(req,res)=>{
    return res.json({
        success:false,
        message:"run ho gya hai"
    })
})
app.listen(PORT,()=>{
    console.log(`app is running at port ${PORT}`)
})
app.get('/getitems',async(req,res)=>{
        return res.json({
            message:"ye bhi ho gya",
            success:true,
        })
})
const {instance}=require('../controller/razorpay')
app.post('/create-order', async (req, res) => {
    try {
        const {amount,userId}= req.body
        const options = {
            amount: amount*100, // Amount in paise (₹100)
            currency: 'INR',
            receipt: Date.now().toString(),
            notes: {
            userId,
            }
        };
        const payment = await instance.orders.create(options);
        return res.status(200).json({
                success: true,
                orderid: payment.id,  // use `id`, not `_id`
                currency: payment.currency,
                amount: payment.amount
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Order creation failed');
    }
});
app.post('/verifyPayment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature,userId} = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", "JBKfxznCBECiXh4a3LiCDcjr")
        expectedSignature.update(body.toString())
        const digest=expectedSignature.digest("hex");
        if(razorpay_signature===digest){
            return res.status(200).json({
                success: true,
                message:"payement verify successfully"
            });
        }
        else{
            return res.json({
                success:false,
                message:"get some error"
            })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Order creation failed');
    }
});
const apiKey = 'AIzaSyAwG5Ns9RC3dpa6rODXOMGdaXt1k84yNqI';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
app.post('/generateText',async(req,res)=>{
    const {text}=req.body
    const data = {
     contents: [
      {
        parts: [
        {
          text: `${text} in 40 words`
        }
      ]
      }
     ]
    };
          axios.post(url, data, {
        headers: {
        'Content-Type': 'application/json'
         }
        })
         .then(response => {
         return res.json({
            success:true,
            text:response.data.candidates[0].content.parts[0].text
         })
        })
       .catch(error => {
        return res.json({
            success:false,
            error:error
        })
        });
})

