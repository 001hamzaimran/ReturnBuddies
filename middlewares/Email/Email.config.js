
import nodemailer from 'nodemailer'


const transporter=nodemailer.createTransport({
    host:'smtp.gmail.com',
    secure:false,
    port:587,
    auth:{
   
        user:`developpment.mail@gmail.com`,
        pass: 'wizw klyf yeuw fdpn',
    }
})

export default transporter
