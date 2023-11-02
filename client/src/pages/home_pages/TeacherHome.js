import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/Auth'
import axios from 'axios';
import { Link } from "react-router-dom"
import Navbar from '../../components/Navbar';
import ReactLoading from "react-loading"
import { toast, ToastContainer } from "react-toastify"
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

        toast("Logged out successfully")

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
        <div className='font-Poppins text-sm' >
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="light"
            />
            <Navbar handleLogout={handleLogout} />
            <div className='p-4' >
                {
                    auth?.user && (
                        <h1 className='text-xl mb-4 pb-6 border-b border-zinc-400' > <i class="fa-solid fa-hands-praying"></i> &nbsp; Welcome  {auth?.user?.name}</h1>
                    )
                }

                <p className='flex w-full items-center justify-start pb-6 pt-2 ' > <i class="fa-solid fa-list-check"></i> &nbsp; These are your assigned students</p>


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
                                            className='flex p-2 border mb-1'
                                            key={student._id} ><i class="fa-regular fa-user"></i> &nbsp; {student.enrollment_no} &nbsp; - &nbsp; {student.name} </div>
                                    </Link>
                                )
                            })
                        ) : (
                            <div className='flex justify-center p-4 mt-16 items-center text-zinc-500 cursor-default border-b pb-20' >
                                No assigned Students :(
                            </div>
                        )
                    )
                }

                <br /><br />
            </div>
        </div>
    )
}

export default TeacherHome