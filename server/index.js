const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/user')

const app = express();
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/seminar");

app.post('/login',(req,res) => {
    const { email, password } = req.body;
    UserModel.findOne({email:email})
    .then( user => {
        if(user){
            if(user.password == password){
                res.json("success");
            } else {
                res.json("the password is incorrect") 
            }
        } else {
            res.json("No record existed")
        }
    })
})

app.post('/register', (req,res) => {
    UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err))
})

app.post('/check-email', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });  // ใช้ async/await
        if (user) {
            return res.json({ exists: true });  // อีเมลมีอยู่แล้ว
        } else {
            return res.json({ exists: false });  // อีเมลยังไม่มีในระบบ
        }
    } catch (err) {
        console.error("Database error: ", err);
        return res.status(500).json({ message: 'Server error' });  // จัดการกับข้อผิดพลาด
    }
});



app.listen(3301, () => {
    console.log("server is running!!");
})

