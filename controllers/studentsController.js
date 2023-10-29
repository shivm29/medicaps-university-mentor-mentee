import userModel from "../models/userModel.js"
import JWT from 'jsonwebtoken'


export const getAssignedStudents = async (req, res) => {
    try {

        const token = req.headers.authorization;

        const decoded = JWT.verify(token, process.env.JWT_SECRET)

        const teacher_id = decoded._id;


        const students = await userModel.find({ assigned_teacher: teacher_id }).select('-password -email -role -assigned_teacher')

        if (students.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No Students Assigned",
            });
        }

        res.status(200).send({
            success: "true",
            message: "Students retrieved successfully",
            students
        })


    } catch (error) {

        console.log(error);
        res.status(500).send({
            success: false,
            error: error,
            message: "Error in getting Students"
        })
    }
}