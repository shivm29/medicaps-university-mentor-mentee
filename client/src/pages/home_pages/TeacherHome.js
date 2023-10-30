import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/Auth'
import axios from 'axios';
import { Link } from "react-router-dom"
import Navbar from '../../components/Navbar';
import ReactLoading from "react-loading"
const TeacherHome = () => {

    const [auth, setAuth] = useAuth();
    const [students, setStudents] = useState(null)
    const [studentID, setStudentID] = useState(null)

    const [fetchingStudents, setFetchingStudents] = useState(false)

    const baseURL = process.env.REACT_APP_API

    const handleLogout = () => {
        localStorage.clear();

        setAuth({
            user: null,
            token: null
        })

        window.location.reload()

        window.alert("You are being logged out")


    }
    
    const getAssignedStudentsHandler = async () => {
        try {
            setFetchingStudents(true)
            const res = await axios.get(`${baseURL}/api/v1/students/get-assigned-students`)

            console.log("res", res)
            setStudents(res.data.students)

            setFetchingStudents(false)

        } catch (error) {
            setFetchingStudents(false)
            console.log("error", error)
        }
    }

    useEffect(() => {
        getAssignedStudentsHandler();
    }, [])

    console.log(studentID)

    return (
        <div className='font-Poppins' >
            <Navbar handleLogout={handleLogout} />
            <div className='p-4' >
                {
                    auth?.user && (
                        <h1 className='text-xl mb-2' > Hi  {auth?.user?.name}! Welcome to Dashboard</h1>
                    )
                }

                <p className='flex w-full items-center justify-center p-4' > These are your assigned students</p>


                {
                    fetchingStudents ? (
                        <div className='flex flex-col w-full items-center mt-10' >
                            <ReactLoading type="bubbles" color="#242424"
                                height={70} width={70}
                            />

                            <p>Fetching Students... </p>
                        </div>
                    ) : (
                        students ? (
                            students?.map((student) => {
                                return (
                                    <Link to={`/teacher/student-details/${student._id}`} >
                                        <div
                                            className='flex p-2 border mb-1 rounded-md justify-between'
                                            key={student._id} > {student.name} </div>
                                    </Link>
                                )
                            })
                        ) : ("No assigned Students")
                    )
                }

                <br /><br />
            </div>
        </div>
    )
}

export default TeacherHome