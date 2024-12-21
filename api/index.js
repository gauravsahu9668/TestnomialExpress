const express=require("express")
const app=express()
const mailsender=require('../mailsender')
require("dotenv").config()
app.use(express.json())
const cors=require('cors')
const PORT=process.env.PORT || 4000
app.use(cors({
    origin:"http://localhost:3000",
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