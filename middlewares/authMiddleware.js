import JWT from 'jsonwebtoken'
import userModel from "../models/userModel.js"


// Protected routes token base
// if the token is not provided or the provided token is wrong, next will not be implemented

export const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'Login to proceed',
            });
        }

        const decode = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: 'Invalid Credentials',
        });
    }
};


export const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decode = JWT.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(decode._id);

        if (user.role !== "admin") {
            return res.status(200).send({
                success: false,
                message: 'Unauthorized access'
            })
        }
        else {
            next();
        }

    }
    catch (error) {
        res.status(401).send({
            success: false,
            message: 'Error in admin middleware',
        })
    }
}
export const isTeacher = async (req, res, next) => {
    try {

        const token = req.headers.authorization;

        const decoded = JWT.verify(token, process.env.JWT_SECRET)

        const user_id = decoded._id;

        const user = await userModel.findById(user_id);

        if (user.role !== "teacher") {
            return res.status(200).send({
                success: false,
                message: 'Unauthorized access'
            })
        }
        else {
            next();
        }

    }
    catch (error) {
        res.status(401).send({
            success: false,
            message: 'Error in teacher middleware',
        })
    }
}
export const isStudent = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        const decoded = JWT.verify(token, process.env.JWT_SECRET)

        const user_id = decoded._id;

        const user = await userModel.findById(user_id);

        if (user.role !== "student") {
            return res.status(200).send({
                success: false,
                message: 'Unauthorized access'
            })
        }
        else {
            next();
        }

    }
    catch (error) {
        res.status(401).send({
            success: false,
            message: 'Error in student middleware',
        })
    }
}


export const isAssignedTeacher = async (req, res, next) => {
    try {

        const { id: studentID } = req.params
        const student = await userModel.findById(studentID);

        const token = req.headers.authorization;

        const decoded = JWT.verify(token, process.env.JWT_SECRET)

        const user_id = decoded._id;


        if (student && student.assigned_teacher.toString() === user_id) {
            next();
        }
        else {
            return res.status(200).send({
                success: false,
                message: 'You are not authorised to access this information'
            })
        }

    } catch (error) {
        res.status(401).send({
            success: false,
            message: 'Error in assigned teacher middleware',
        })
    }
}