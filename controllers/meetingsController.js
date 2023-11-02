import meetingModel from "../models/meetingModel.js"

export const handleCreateMeetingController = async (req, res) => {
    try {

        const { mentor_id, student_id, attendance, advice } = req.body

        if (!mentor_id) return res.send({ error: "Mentor id required" })
        if (!advice) return res.send({ error: "Advice required" })
        if (!student_id) return res.send({ error: "Student id required" })
        if (!attendance) return res.send({ error: "Attendance required" })

        console.log("mentor_id", mentor_id)

        const meeting = new meetingModel({
            student_id, mentor_id, attendance, advice
        }).save()

        if (meeting) {
            res.status(200).send({
                success: true,
                message: 'Successfully created a meeting',
                meeting
            })
        }


    } catch (error) {
        res.status(400).send({
            success: false,
            error
        })
    }
}