import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/Auth';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import ReactLoading from "react-loading"
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminHome = () => {

    const [auth, setAuth] = useAuth()
    const [students, setStudents] = useState(null)
    const [teachers, setTeachers] = useState(null)

    const [fetchingStudents, setFetchingStudents] = useState(false)
    const [fetchingTeachers, setFechingTeachers] = useState(false)

    const handleLogout = () => {
        localStorage.clear();

        setAuth({
            user: null,
            token: null
        })

        window.location.reload()
        toast("Logged out successfully")
    }

    const baseUrl = process.env.REACT_APP_API

    const [field, setField] = useState("enrollment_no");
    const [query, setQuery] = useState("");

    const [teacherField, setTeacherField] = useState("name")
    const [teacherQuery, setTeacherQuery] = useState("")

    const submitStudentHandler = async (e) => {
        e.preventDefault()
        try {
            setFetchingStudents(true)
            const res = await axios.get(`${baseUrl}/api/v1/students/get-any-student`, {
                params: {
                    field: field,
                    query: query,
                }
            })

            if (res.data.success) {
                setStudents(res.data.students)
            }
            setFetchingStudents(false)

        } catch (error) {
            setFetchingStudents(false)
            console.log(error)
        }
    }

    const submitTeacherHandler = async (e) => {
        e.preventDefault();

        try {
            setFechingTeachers(true)

            const res = await axios.get(`${baseUrl}/api/v1/teachers/get-any-teacher`, {
                params: {
                    field: teacherField,
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

    return (
        <div className='font-Poppins text-sm' >

            <Navbar handleLogout={handleLogout} />

            <div className='p-4' >
                <h1 className='text-xl border-b border-zinc-400 mb-5 pb-3' ><i class="fa-solid fa-hands-praying"></i> &nbsp; Welcome {auth?.user?.name} </h1>


                <div className='flex min-w-full border-b border-zinc-400 pb-24' >
                    <div className='flex-1 flex flex-col' >
                        <h3 className='mb-10 text-base' ><i class="fa-solid fa-user-group"></i> &nbsp; Search for Students</h3>
                        <form action="" className='flex flex-col mr-3' onSubmit={submitStudentHandler} >

                            <div className='flex justify-between' > <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className=' outline outline-1  p-3 flex-1  ' placeholder='Search here...' />
                                <button type='submit' className='bg-black text-white w-48 p-3 place-self-end  hover:bg-zinc-700  ease-in-out duration-300  ' ><i class="fa-solid fa-magnifying-glass"></i> &nbsp;Search</button>
                            </div>

                            <div className='flex w-full flex-col bg-slate-200 mt-4 pl-4 rounded-lg' >
                                <h3 className='my-3 flex p-2' >Search by</h3>

                                <div className='flex mb-4' >
                                    <label for="enrollment_no" className='mr-3' >
                                        <input id='enrollment_no' type='radio' name="field" value="enrollment_no"
                                            onChange={(e) => setField(e.target.value)}
                                            defaultChecked>
                                        </input>
                                        &nbsp; Enrollment Number
                                    </label>

                                    <label for="name" className='mr-3' >
                                        <input type='radio' id='name' name="field" value="name"
                                            onChange={(e) => setField(e.target.value)}
                                        >
                                        </input>
                                        &nbsp; Name
                                    </label>
                                    <label for="scholar_no" className='mr-2' >
                                        <input type='radio' id='scholar_no' name="field" value="scholar_no"
                                            onChange={(e) => setField(e.target.value)}
                                        >
                                        </input>
                                        &nbsp; Scholar Number
                                    </label>
                                </div>
                            </div>



                        </form>

                        <div className='pr-2 mt-3 ' >
                            {
                                fetchingStudents ? (
                                    <div className='flex flex-col w-full items-center mt-10' >
                                        <ReactLoading type="bubbles" color="#242424"
                                            height={70} width={70}
                                        />

                                    </div>
                                ) : (
                                    students ? (
                                        students.map((student, index) => {
                                            return (
                                                <Link to={`/admin/student-details/${student._id}`} >
                                                    <div key={index} className={`flex rounded-lg p-3 border mb-2`} > {student.name} </div>
                                                </Link>
                                            )
                                        })
                                    ) : (
                                        <div className='flex justify-center w-full mt-12 text-zinc-400' >
                                            No students found, Search for students
                                        </div>
                                    )
                                )
                            }

                            {
                                students?.length === 0 && (
                                    <div className='flex justify-center w-full mt-12 text-zinc-400' >
                                        No students found, Search for students
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className='flex-1 flex flex-col' >


                        <h3 className='mb-10 text-base' ><i class="fa-solid fa-user-group"></i> &nbsp; Search for Teachers</h3>
                        <form action="" className='flex flex-col mr-3' onSubmit={submitTeacherHandler} >

                            <div className='flex justify-between' > <input type="text" value={teacherQuery} onChange={(e) => setTeacherQuery(e.target.value)} className=' outline outline-1  p-3 flex-1' placeholder='Search here...' />
                                <button type='submit' className='bg-black text-white w-48 p-3 place-self-end hover:bg-zinc-700  ease-in-out duration-300  ' ><i class="fa-solid fa-magnifying-glass"></i> &nbsp;Search</button>
                            </div>

                            <div className='flex w-full flex-col bg-slate-200 mt-4 pl-4 rounded-lg' >
                                <h3 className='my-3 flex p-2' >Search by</h3>

                                <div className='flex mb-4' >


                                    <label for="name" className='mr-3' >
                                        <input type='radio' id='name' name="field" value="name"
                                            onChange={(e) => setTeacherField(e.target.value)}
                                            defaultChecked
                                        >
                                        </input>
                                        &nbsp; Name
                                    </label>

                                </div>
                            </div>

                        </form>

                        <div className='pr-2 mt-3' >
                            {
                                fetchingTeachers ? (
                                    <div className='flex flex-col w-full items-center mt-10' >
                                        <ReactLoading type="bubbles" color="#242424"
                                            height={70} width={70}
                                        />

                                    </div>
                                ) : (
                                    teachers ? (
                                        teachers.map((teacher, index) => {
                                            return (
                                                <Link to={`/admin/teacher-details/${teacher._id}`} >
                                                    <div key={index} className={`flex rounded-lg p-3 border mb-2`} > {teacher.name} </div></Link>
                                            )
                                        })
                                    ) : (
                                        <div className='flex justify-center w-full mt-12 text-zinc-400' >
                                            No Teachers found, Search for Teachers
                                        </div>
                                    )
                                )
                            }

                            {
                                teachers?.length === 0 && (
                                    <div className='flex justify-center w-full mt-12 text-zinc-400' >
                                        No Teachers found, Search for teachers
                                    </div>
                                )
                            }
                        </div>

                    </div>
                </div>

                <div className='flex p-4 justify-center mt-10'>
                    <Link to={"/admin/assignation-window"} >
                        <button className='p-2 bg-black rounded-sm text-white hover:bg-zinc-700 ease-in-out duration-300' >Go to the Mentor-Mentee Assignation Window</button>
                    </Link>
                </div>

            </div>



        </div>

    )
}

export default AdminHome