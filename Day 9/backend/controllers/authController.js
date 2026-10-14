const db = require("../config/db");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.signup = async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            error:"All fields are required."
        });
    }
    if(password.length<8){
        return res.status(400).json({
            error:"Password must be atleast 8 characters."
        })
    }
    try{
        const [existing] = await db.query("SELECT id FROM users WHERE email = ?",[email])
        if(existing.length>0){
            return res.status(400).json({
                error:"Email is already regiestered."
            })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        await db.query("INSERT INTO users (name, email, password) VALUES (?,?,?) ", [name, email, hashPassword]);
        res.json({
            message:"Signup successful. Please Login."
        })
    }catch (err) {
        console.log(err);
        res.status(500).json({
        error: "Something went wrong.",
        });
    }
}

exports.login = async (req,res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({
            error:"Email and password are required."
        })
    }
    try{
        const [rows] = await db.query("SELECT * FROM users WHERE email = (?)", [email]);
        if(rows.length==0){
            return res.status(400).json({
                error:"Invalid email or password."
            })
        }
        const user=rows[0];
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({
                error:"Invalid email or password."
            })
        }
        const token = jwt.sign({
            id:user.id, name:user.name
        }, process.env.JWT_SECRET, {
            expiresIn:"1d"
        })
        res.json({
            token,
            name:user.name
        })
    } catch(err){
        console.log(err);
        res.status(500).json({
            error: "Something went wrong.",
        });
    }
}