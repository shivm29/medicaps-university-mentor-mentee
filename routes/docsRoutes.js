import express from 'express'
import { docsuploadController, getDocsController } from '../controllers/docsController.js'
import ExpressFormidable from 'express-formidable';
import { isStudent, requireSignIn } from '../middlewares/authMiddleware.js';

// create a new router
const router = express.Router();

// upload documents | POST
router.post('/upload-docs', requireSignIn, isStudent, ExpressFormidable(), docsuploadController);
// get documents user's documents
// here :id is the id of student
router.get('/get-docs/:id', requireSignIn, getDocsController)

export default router