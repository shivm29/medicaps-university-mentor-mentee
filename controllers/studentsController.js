import userModel from "../models/userModel.js"

export const getAssignedStudents = async (req, res) => {
    try {
        const { id: teacher_id } = req.params
        const students = await userModel.find({ assigned_teacher: teacher_id })

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