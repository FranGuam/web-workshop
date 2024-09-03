import express from "express";
import jwt from "jsonwebtoken";
import {sdk as graphql} from "./index";
import nodemailer from "nodemailer";

const router = express.Router();

router.get("/delete", async(req,res) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send("401 Unauthorized: Missing Authorization Header");
    }
    const token = authHeader.split(" ")[1];
    let userId;
    try{
        try{
            jwt.verify(token, process.env.JWT_SECRET!);
        }catch(err){
            return res.status(401).send("401 Unauthorized: Invalid Token");
        }
        const payload = jwt.decode(token) as {uuid:string};
        if(!payload.uuid){
            console.log(payload.uuid);
            return res.status(403).send("403 Forbidden: Invalid UUID");
        }
        const query = await graphql.deleteUser({uuid: payload.uuid});
        console.log(payload.uuid);
        return res.status(200).send("User Deleted");
    }catch(err){
        console.log(err);
        return res.status(500).send("500 Internal Server Error");
    }
});

export default router;