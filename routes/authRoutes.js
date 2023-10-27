// This file contains the routes related to authentication e.g. /register & /login 
import express from 'express'
import { loginController, registerController } from '../controllers/authController.js';
import { isAdmin, isStudent, isTeacher, requireSignIn } from '../middlewares/authMiddleware.js';

// create a new router
const router = express.Router();


// routing 
// REGISTER | METHOD : POST
router.post('/register', registerController)

// LOGIN | METHOD : POST
router.post('/login', loginController)

// protected auth routes
router.get('/student-auth', requireSignIn, isStudent, (req, res) => {
    res.status(200).send({
        ok: true
    })
})
// protected auth routes
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({
        ok: true
    })
})

router.get('/teacher-auth', requireSignIn, isTeacher, (req, res) => {
    res.status(200).send({
        ok: true
    })
})

export default router