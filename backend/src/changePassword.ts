import express from "express";
import jwt from "jsonwebtoken";
import {sdk as graphql} from "./index";
import nodemailer from "nodemailer";
import { prototype } from "events";

const router = express.Router();

router.post("/change-password/request", async (req, res) => {
    const {username} = req.body;
    if(!username){
        return res.status(422).send("422 Unprocessable Entity: Missing username");
    }
    try{
        const queryResult = await graphql.getUsersByUsername({username: username});
        if(queryResult.user.length == 0){
            return res.status(404).send("404 Not Found: User does not exist");
        }
        const user = queryResult.user[0];
        const payload = {uuid:user.uuid, username:username };  
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: "1h"});
        // 未检查username是不是合法的email地址
        // Check if the username is a valid email address
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) { // 这个写法值得学习
            return res.status(422).send("422 Unprocessable Entity: Invalid username(Not an email Address)");
        }
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT!),
            auth:{
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            },
            logger: true,
            debug: true
        });
        if(!process.env.EMAIL_ADDRESS || !process.env.EMAIL_PASSWORD){
            return res.status(500).send("500: Can't Send EMAIL");
        }
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: username,
            subject: "Password Reset Request",
            text: `Please use the following link to reset your password: localhost:3000/user/change-password/reset
            your token below : ${'\n'}${token}`
        };
        await transporter.sendMail(mailOptions);
        console.log(token);
        return res.status(200).send("Reset Email send");
    }catch (err){
        console.error(err);
        return res.sendStatus(500);
    }
});

router.post("/change-password/action", async (req,res) => { 
    const {token, newPassword} = req.body;
    if(!token || !newPassword){
        return res.status(422).send("422 Unprocessable Entity: Missing New Password/token");
    }
    try{ 
        try{
            console.log(jwt.decode(token));
            jwt.verify(token, process.env.JWT_SECRET!);
        }catch(err){
            return res.status(401).send("401 Unauthorized: Invalid token");
        }
        const decoded = jwt.decode(token) as {uuid: string, username: string};
        const query = await graphql.updateUserPassword({uuid: decoded.uuid, password: newPassword});
        if(query.update_user_by_pk){
            return res.status(200).send("Password Updated");
        }else{
            return res.status(500).send("500 Internal Server Error");
        }
    }catch(err){
        console.error(err);
        return res.status(500).send("500 Server Error");
    }
});

export default router;