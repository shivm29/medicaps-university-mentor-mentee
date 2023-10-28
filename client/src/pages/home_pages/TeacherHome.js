import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/Auth'
import axios from 'axios';
import { Link } from "react-router-dom"

const TeacherHome = () => {

    const [auth] = useAuth();
    const [students, setStudents] = useState(null)
    const [studentID, setStudentID] = useState(null)

    const baseURL = process.env.REACT_APP_API

    const getAssignedStudentsHandler = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/v1/students/get-assigned-students/${auth?.user?.id}`)

            console.log("res", res)
            setStudents(res.data.students)

        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        getAssignedStudentsHandler();
    }, [])

    console.log(studentID)

    return (
        <div>
            TeacherHome
            {
                auth?.user && (
                    <h1> Hi  {auth?.user?.name} ! These are your assigned students</h1>
                )
            }
            {
                students ? (
                    students?.map((student) => {
                        return (
                            <Link to={`/teacher/student-details/${student._id}`} >
                                <li key={student._id} > {student.name} </li>
                            </Link>
                        )
                    })
                ) : ("No assigned Students")
            }

        </div>
    )
}

export default TeacherHome