import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { toast, ToastContainer } from "react-toastify"
import { useAuth } from '../context/Auth'
import axios from 'axios'
import { Link, useParams } from "react-router-dom"
import ReactLoading from "react-loading"


const AdminStudentDetails = ({ student }) => {

    const [auth, setAuth] = useAuth()
    const [documents, setDocuments] = useState(null)
    const [studentDetails, setStudentDetails] = useState(null)
    const [documentsLoading, setDocumentsLoading] = useState(false)
    const [mentorName, setMentorName] = useState("NA")
    const [teacherQuery, setTeacherQuery] = useState(null)

    const [fetchingTeachers, setFechingTeachers] = useState(false)
    const [teachers, setTeachers] = useState(null)

    const [assigning, setAssigning] = useState(false)

    const [fetchingStudentDetails, setFetchingStudentDetails] = useState(false)


    const params = useParams()

    const handleLogout = () => {
        localStorage.clear();

        setAuth({
            user: null,
            token: null
        })

        window.location.reload()

        toast("Logged out successfully")

    }

    const baseURL = process.env.REACT_APP_API

    const getStudentDetails = async () => {

        setFetchingStudentDetails(true)
        try {

            const res = await axios.get(`${baseURL}/api/v1/students/student-details/${params.id}`)
            setStudentDetails(res.data.student)
            console.log(res)
            setFetchingStudentDetails(false)


        } catch (error) {
            setFetchingStudentDetails(false)
            console.log("error : ", error)

        }
    }
    const getStudentDocuments = async () => {
        try {
            setDocumentsLoading(true);

            const res = await axios.get(`${baseURL}/api/v1/docs/student-documents/${params.id}`)
            setDocuments(res.data.documents)
            console.log(res)

            setDocumentsLoading(false)

        } catch (error) {

            setDocumentsLoading(false)

            console.log("error : ", error)
        }
    }

    const getMentor = async () => {
        try {

            if (studentDetails) {
                const res = await axios.get(`${baseURL}/api/v1/teachers/get-mentor/${studentDetails?.assigned_teacher}`);

                if (res.data.success) {
                    setMentorName(res.data.mentor.name)
                } else {
                    setMentorName("NA")
                }
            }
            else {
                setMentorName("NA")
            }

        } catch (error) {
            console.log(error)
        }
    }

    const submitTeacherHandler = async (e) => {
        e.preventDefault();

        try {
            setFechingTeachers(true)

            const res = await axios.get(`${baseURL}/api/v1/teachers/get-any-teacher`, {
                params: {
                    field: "name",
                    query: teacherQuery,
                }
            })

            if (res.data.success) {
                setTeachers(res.data.teachers);
            }
            else {
                toast("An error occured in fetching teachers")
            }
            setFechingTeachers(false)
        } catch (error) {
            setFechingTeachers(false)
            console.log(error)
        }
    }

    const assignMentorHandler = async (e, teacher_id) => {
        e.preventDefault();
        try {

            setAssigning(true)

            const res = await axios.put(`${baseURL}/api/v1/students/assign-mentor`, {
                id: studentDetails?._id,
                assigned_teacher: teacher_id
            })

            if (res.data.success) {
                getStudentDetails();
                setMentorName(res.data.teacher);

                toast("Mentor updated!")
            }

            setAssigning(false)

        } catch (error) {

            setAssigning(false)
            toast("Error in updating mentor :(")
            console.log(error)
        }
    }

    useEffect(() => {
        getStudentDetails()
        getStudentDocuments()
    }, [])

    useEffect(() => {
        getMentor()
    }, [studentDetails])


    return (
        <div className='font-Poppins text-sm' >
            <Navbar handleLogout={handleLogout} />
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

            <div className='p-4 pt-0' >
                <h1 className=' px-4 pb-4 text-xl border-b border-zinc-400 ' > Student Details </h1>

                <div className='flex p-4 w-full' >
                    {
                        fetchingStudentDetails ? (
                            <div className='flex flex-col w-full items-center mt-10' >
                                <ReactLoading type="bubbles" color="#242424"
                                    height={70} width={70}
                                />

                                <p className='text-sm' > Fetching details...</p>

                            </div>
                        ) : (
                            studentDetails && (
                                <div className="grid  grid-cols-4 w-full gap-1" >
                                    <div className='flex p-2 border ' >Name :   {studentDetails?.name}</div>
                                    <div className='flex p-2 border ' >Enrollment :   {studentDetails?.enrollment_no}</div>
                                    <div className='flex p-2 border ' >Scholar :   {studentDetails?.scholar_no}</div>
                                    <div className='flex p-2 border ' >Mobile :   {studentDetails?.mobile}</div>
                                    <div className='flex p-2 border ' >Branch :   {studentDetails?.branch}</div>
                                    <div className='flex p-2 border ' >Program :   {studentDetails?.program}</div>
                                    <div className='flex p-2 border ' >Email :   {studentDetails?.email}</div>
                                    <div className='flex p-2 border ' >Class :   {studentDetails?.class_name}</div>
                                    <div className='flex p-2 border ' >Faculty :   {studentDetails?.faculty}</div>
                                    <div className='flex p-2 border ' >Mentor :   {mentorName}</div>
                                </div>
                            )
                        )
                    }

                </div>

                <h1 className=' px-4 pb-4 text-xl border-b mt-4' > Change/Assign Mentor </h1>

                <div className='flex p-4 w-full' >
                    <div className='flex w-full items-center justify-between' >

                        <div className='flex flex-1' >  <input value={teacherQuery} onChange={(e) => setTeacherQuery(e.target.value)} type="text" placeholder='search for mentors' className='p-2   focus:outline-none border border-black w-1/2' />
                            <button onClick={submitTeacherHandler} className=' rounded-e-sm p-2 bg-black text-white hover:bg-zinc-800 ease-in-out duration-300 ' >Search</button></div>

                        <div> Current Mentor :  {mentorName} </div>
                    </div>
                </div>

                <div className='p-4 py-0 mb-4 mt-1 max-h-48 overflow-x-auto pb-6 border-b' >
                    {
                        fetchingTeachers ? (
                            <div className='flex flex-col w-full items-center mt-10' >
                                <ReactLoading type="bubbles" color="#242424"
                                    height={70} width={70}
                                />

                            </div>
                        ) : (
                            teachers && (
                                teachers.map((teacher, index) => {
                                    return (
                                        <div key={index} className={`flex rounded-lg p-3 border mb-2 items-center justify-between`} >
                                            <div>{teacher.name}</div>
                                            <button className='p-2 rounded-lg bg-black text-white hover:scale-95 ease-in-out duration-300'

                                                onClick={(e) => assignMentorHandler(e, teacher._id)}

                                            >
                                                Assign
                                            </button>
                                        </div>
                                    )
                                })
                            )
                        )

                    }

                    {
                        teachers?.length === 0 && !fetchingTeachers && (
                            <div className='flex justify-center w-full mt-12 text-zinc-400' >
                                No Teachers found, Search for teachers
                            </div>
                        )
                    }

                </div>

                <h1 className=' px-4 pb-4 text-xl border-b mt-4 border-zinc-400' > Student Documents </h1>

                <div className='flex p-4 w-full flex-col' >
                    {
                        documentsLoading ? (<div className='flex flex-col w-full items-center mt-10' >
                            <ReactLoading type="bubbles" color="#242424"
                                height={70} width={70}
                            />

                            <p className='text-sm' > Fetching Documents... </p>
                        </div>) : (

                            documents && (
                                documents.map((document, index) => {
                                    return (
                                        <Link to={`/admin/student-documents/${document?._id}`} >
                                            <div key={index} className='flex  items-center p-2 px-4 justify-between border mb-2' > <div>{document.name}</div>  <div className={`${document.status === "approved" ? " bg-green-400 " : " bg-red-400 "} p-2 text-white rounded-sm  `} > {document.status} </div></div>
                                        </Link>
                                    )
                                })
                            )

                        )
                    }

                </div>


                {assigning && (
                    <div className='flex flex-col items-center justify-center z-50 fixed top-0 left-0 h-screen w-full bg-black bg-opacity-10 ' >
                        <ReactLoading type="bubbles" color="#242424"
                            height={70} width={70}
                        />

                        <p>Assigning Mentor..</p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default AdminStudentDetails


