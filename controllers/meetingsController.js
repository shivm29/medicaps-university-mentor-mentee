import meetingModel from "../models/meetingModel.js"
import JWT from "jsonwebtoken"
export const handleCreateMeetingController = async (req, res) => {
    try {

        const { mentor_id, student_id, attendance, advice } = req.body

        console.log(mentor_id, student_id, advice, attendance)
        if (!mentor_id) return res.send({ error: "Mentor id required" })
        if (!advice) return res.send({ error: "Advice required" })
        if (!student_id) return res.send({ error: "Student id required" })
        if (!attendance) return res.send({ error: "Attendance required" })

        console.log("mentor_id", mentor_id)

        const meeting = new meetingModel({
            student_id, mentor_id, attendance, advice
        })

        const savedMeeting = await meeting.save();

        if (savedMeeting) {
            res.status(200).send({
                success: true,
                message: 'Successfully created a meeting',
                meeting: savedMeeting
            })
        }


    } catch (error) {
        res.status(400).send({
            success: false,
            error
        })
    }
}

export const handleGetMeetingController = async (req, res) => {
    try {

        const student_id = req.query.student_id;

        console.log(student_id)

        if (!student_id) return res.send({ error: "Student not found" })

        const meetings = await meetingModel.find({ student_id });

        if (meetings) {
            res.status(200).send({
                success: true,
                meetings
            })
        } else {

            res.status(201).send({
                success: false,
                message: "Error in getting meetings"
            })
        }

    } catch (error) {
        console.log(error)
    }
}


export const handleGetMeetingByStudentController = async (req, res) => {
    try {

        const token = req.headers.authorization;

        const decoded = JWT.verify(token, process.env.JWT_SECRET)
        const student_id = decoded._id;


        if (!student_id) return res.send({ error: "Student not found" })

        const meetings = await meetingModel.find({ student_id });

        if (meetings) {
            res.status(200).send({
                success: true,
                meetings
            })
        } else {

            res.status(201).send({
                success: false,
                message: "Error in getting meetings"
            })
        }

    } catch (error) {
        console.log(error)
    }
}