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

export const getAnyStudentController = async (req, res) => {
    try {

        const { query, field } = req.query;

        let queryOptions = {};

        if (field === 'enrollment_no') {
            queryOptions = { enrollment_no: new RegExp(query, 'i'), role: "student" }; // Case-insensitive search
        } else if (field === 'name') {
            queryOptions = { name: new RegExp(query, 'i'), role: "student" };
        } else if (field === 'scholar_no') {
            queryOptions = { scholar_no: new RegExp(query, 'i'), role: "student" };
        }

        const students = await userModel.find(queryOptions).select("-password");

        res.status(200).json({
            success: true,
            students: students,
        });


    } catch (error) {

        console.log(error);
        res.status(500).send({
            success: false,
            error: error,
            message: "Error in getting Student"
        })
    }
}

export const getStudentDetails = async (req, res) => {
    try {

        const { id: student_id } = req.params

        const student = await userModel.findById(student_id).select("-password")

        res.status(200).send({
            success: "true",
            message: "Students retrieved successfully",
            student
        })

    } catch (error) {

        console.log(error);
        res.status(500).send({
            success: false,
            error: error,
            message: "Error in getting Student Details"
        })
    }
}


export const assignMentorController = async (req, res) => {
    try {

        const { id, assigned_teacher } = req.body;

        const updated = await userModel.findByIdAndUpdate(id, { assigned_teacher })

        if (updated) {
            const teacher_name = await userModel.findById(updated?.assigned_teacher)

            res.status(200).send({
                success: true,
                teacher: teacher_name?.name
            })
        }



    } catch (error) {

        console.log(error);
        res.status(500).send({
            success: false,
            error: error,
            message: "Error in Assigning Mentor"
        })
    }
}

export const assignMentorToMultiple = async (req, res) => {
    try {

        const { mentorId, studentIds } = req.body;

        console.log(mentorId, studentIds)

        // Use Promise.all to update all student documents in parallel
        const updatePromises = studentIds.map(studentId => {
            return userModel.findByIdAndUpdate(studentId, { assigned_teacher: mentorId }).exec();
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);


        res.status(200).send({
            success: true,
        })


    } catch (error) {
        console.log(error)
    }
}

export const getRangeStudents = async (req, res) => {
    try {
        console.log("hii")
        const { startRange, endRange } = req.query;

        console.log(startRange, "start")
        console.log(endRange, "end")


        const studentsInRange = await userModel.find({
            enrollment_no: { $gte: startRange, $lte: endRange },
        });

        console.log(studentsInRange)

        res.status(200).send({
            success: true,
            studentsInRange
        })

    } catch (error) {
        res.status(400).send({
            error,
            success: false
        })
    }
}