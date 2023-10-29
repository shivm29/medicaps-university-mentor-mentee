import documentModel from "../models/documentModel.js";
import fs from "fs";
import JWT from 'jsonwebtoken'


export const docsuploadController = async (req, res) => {
    try {
        const { name, type } = req.fields
        const { document } = req.files

        const token = req.headers.authorization;

        const decoded = JWT.verify(token, process.env.JWT_SECRET)
        const userId = decoded._id;

        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name @ is required' })

            case !userId:
                return res.status(500).send({ error: 'User not found' })

            case !type:
                return res.status(500).send({ error: 'Document type is required' })

            case !document || document.size > 2000000:
                return res.status(500).send({ error: 'Upload a document less than 2mb' })
        }

        const new_doc = new documentModel({ ...req.fields, userId });

        if (document) {
            new_doc.document.data = fs.readFileSync(document.path)
            new_doc.document.contentType = document.type
        }

        await new_doc.save();

        res.status(201).send({
            success: true,
            message: 'Document uploaded successfully',
            new_doc
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in uploading document",
            error,
        })
    }
}

// student retrieves his docs
export const getDocsController = async (req, res) => {
    try {

        const token = req.headers.authorization;

        const decoded = JWT.verify(token, process.env.JWT_SECRET)

        const user_id = decoded._id;

        const documents = await documentModel.find({ userId: user_id });

        if (documents.length === 0) {
            return res.status(201).send({
                success: false,
                message: "No documents found for the specified user.",
            });
        }


        res.status(200).send({
            success: "true",
            message: "Docs retrieved successfully",
            documents
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in retrieving documents",
            error
        })
    }
}
export const getDocsByTeacherController = async (req, res) => {
    try {

        const { id: user_id } = req.params

        const documents = await documentModel.find({ userId: user_id });

        if (documents.length === 0) {
            return res.status(201).send({
                success: false,
                message: "No documents found for the specified user.",
            });
        }


        res.status(200).send({
            success: "true",
            message: "Docs retrieved successfully",
            documents
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in retrieving documents",
            error
        })
    }
}
export const approveDocumentController = async (req, res) => {
    try {
        const { _id, status } = req.body;

        console.log(_id, status)

        const result = await documentModel.findByIdAndUpdate(_id, { status });

        res.status(200).send({
            success: true,
            message: "Status updated successfully",
            result
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in retrieving documents",
            error: error.message
        });
    }
};
