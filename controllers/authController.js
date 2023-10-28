import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from 'jsonwebtoken';


export const registerController = async (req, res) => {
    try {
        const { name, email, password, enrollment_no, scholar_no, mobile, program, faculty, branch, class_name, role, assigned_teacher } = await req.body

        // validation messages
        if (!name) {
            return res.send({ error: 'Name is required' });
        }
        if (!email) {
            return res.send({ error: 'Email is required' });
        }
        if (!mobile) {
            return res.send({ error: 'Mobile is required' });
        }
        if (!password) {
            return res.send({ error: 'Password is required' });
        }
        // check if user already exists 
        const existingUser = await userModel.findOne({ email })

        // if user already exists : 
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "User already registered, please login"
            })
        }
        const hashedPassword = await hashPassword(password);
        const user = new userModel({
            name, email, password: hashedPassword, role, assigned_teacher, enrollment_no, scholar_no, mobile, program, faculty, branch, class_name
        }).save()

        res.status(201).send({
            success: true,
            message: 'User registered successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error: error,
            message: "Error in registration"
        })
    }
};


export const loginController = async (req, res) => {

    try {
        const { email, password } = await req.body;

        if (!email) return res.status(404).send({ error: 'Invalid email or password' })
        if (!password) return res.status(404).send({ error: 'Invalid email or password' })

        const existingUser = await userModel.findOne({ email });

        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: 'User do not exist Please register'
            })
        }
        const match = await comparePassword(password, existingUser.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid credentials'
            })
        }

        // JWT Token
        const token = await JWT.sign({ _id: existingUser._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })


        res.status(201).send({
            success: true,
            message: 'Logged in successfully',
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                teacherId: existingUser.teacherId,
            },
            token,
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in login"
        })
    }


};