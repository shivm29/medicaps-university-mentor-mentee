import userModel from "../models/userModel.js"
import JWT from 'jsonwebtoken'

export const getAnyTeacherController = async (req, res) => {
    try {

        const { query, field } = req.query;

        let queryOptions = {};

        if (field === 'name') {
            queryOptions = {
                name: new RegExp(query, 'i'),
                role: "teacher"
            };
        }

        const teachers = await userModel.find(queryOptions).select("-password");

        res.status(200).json({
            success: true,
            teachers: teachers,
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


export const getMentorController = async (req, res) => {
    try {

        const { id: mentor_id } = req.params


        const mentor = await userModel.findById(mentor_id).select("-password");

        res.status(200).json({
            success: true,
            mentor: mentor,
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

