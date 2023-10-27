// This file contains the routes related to authentication e.g. /register & /login 
import express from 'express'
import { loginController, registerController } from '../controllers/authController.js';

// create a new router
const router = express.Router();


// routing 
// REGISTER | METHOD : POST
router.post('/register', registerController)

// LOGIN | METHOD : POST
router.post('/login', loginController)

export default router