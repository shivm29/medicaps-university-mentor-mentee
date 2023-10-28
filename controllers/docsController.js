import documentModel from "../models/documentModel.js";
import fs from "fs";

export const docsuploadController = async (req, res) => {
    try {
        const { name, userId, type } = req.fields
        const { document } = req.files


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

        const new_doc = new documentModel({ ...req.fields });

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
        console.log(error)
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

        const { id: userID } = req.params
        const documents = await documentModel.find({ userId: userID });

        if (documents.length === 0) {
            return res.status(404).send({
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

