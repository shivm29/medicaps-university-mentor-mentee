import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify"
import ReactLoading from "react-loading"
import { useAuth } from '../context/Auth';

const AssignationWindow = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [field, setField] = useState("name");
    const [query, setQuery] = useState("");
    const [teachers, setTeachers] = useState([])
    const [teacherQuery, setTeacherQuery] = useState("")
    const [teacherField, setTeacherField] = useState("name")
    const [selectedMentor, setSelectedMentor] = useState(null)
    const [assigning, setAssigning] = useState(false)
    const [fetchingStudents, setFetchingStudents] = useState(false)
    const [fetchingMentors, setFetchingMentors] = useState(false)
    const [auth, setAuth] = useAuth()

    const baseURL = process.env.REACT_APP_API;

    const handleLogout = () => {
        localStorage.clear();

        setAuth({
            user: null,
            token: null
        })

        window.location.reload()

        toast("Logged out successfully")

    }

    const handleStudentSelection = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };

    const getAllStudents = async () => {
        try {
            setFetchingStudents(true)
            const res = await axios.get(`${baseURL}/api/v1/students/get-any-student`, {
                params: {
                    field: field,
                    query: query,
                }
            });

            if (res.data.success) {
                setStudents(res.data.students);
            }
            setFetchingStudents(false)
        } catch (error) {
            setFetchingStudents(false)
            console.log(error);
        }
    };
    const getAllTeachers = async () => {
        try {
            setFetchingMentors(true)
            const res = await axios.get(`${baseURL}/api/v1/teachers/get-any-teacher`, {
                params: {
                    field: teacherField,
                    query: teacherQuery,
                }
            });

            if (res.data.success) {
                setTeachers(res.data.teachers);
            }
            setFetchingMentors(false)
        } catch (error) {
            setFetchingMentors(false)
            console.log(error);
        }
    };

    const handleAssignation = async () => {
        try {
            setAssigning(true)
            const res = await axios.put(`${baseURL}/api/v1/students/assign-mentor-to-multiple`, {
                mentorId: selectedMentor,
                studentIds: selectedStudents
            })

            if (res.data.success) {
                toast("Mentor assigned successfully")
                setSelectedMentor(null)
                setSelectedStudents([])
            }

            setAssigning(false)

        } catch (error) {

            setAssigning(false)
            console.log(error)
        }
    }

    useEffect(() => {
        getAllStudents(); // Call the function on initial render
    }, [query]); // Call the function whenever query changes

    useEffect(() => {
        getAllTeachers();
    }, [teacherQuery])

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

            <h1 className='flex p-4 justify-center cursor-default border-b border-zinc-400 ' >Mentor - Mentee Assignation Window</h1>

            {assigning && (
                <div className='flex flex-col items-center justify-center z-50 fixed top-0 left-0 h-screen w-full bg-black bg-opacity-10 ' >
                    <ReactLoading type="bubbles" color="#242424"
                        height={70} width={70}
                    />

                    <p>Assigning Mentor..</p>
                </div>
            )}
            <div className='flex p-4 w-full flex-row-reverse'>
                <div className='flex-1 p-3 mr-2'>
                    <input
                        type="text"
                        placeholder='Search for students'
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                        }}

                        className='p-3 border border-black w-full focus:outline-none mb-5'
                    />
                    <div className='flex flex-col'>

                        <button disabled={selectedStudents.length === 0 || selectedMentor === null} className={`flex p-2 bg-black mb-5 text-white justify-center ${(selectedStudents.length === 0 || selectedMentor === null) && "bg-zinc-400"} ease-in-out duration-300 `} onClick={handleAssignation}>
                            Assign
                        </button>

                        {
                            fetchingStudents ? (
                                <div className='flex flex-col items-center justify-center w-full ' >
                                    <ReactLoading type="bubbles" color="#242424"
                                        height={70} width={70}
                                    />

                                    <p>Fetching Students..</p>
                                </div>
                            ) : (
                                <ul>
                                    {students.map((student) => (
                                        <li key={student.id} className='p-2 border mb-1' >
                                            <label  >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student._id)}
                                                    onChange={() => handleStudentSelection(student._id)}
                                                    className=''
                                                />
                                                &nbsp; {student.name}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            )
                        }

                    </div>
                </div>
                <div className='flex-1 p-3'>
                    <input
                        type="text"
                        placeholder='Search for mentors'
                        value={teacherQuery}
                        onChange={(e) => {
                            setTeacherQuery(e.target.value);
                        }}

                        className='p-3 border border-black w-full focus:outline-none mb-5'
                    />
                    <div className='flex flex-col'>

                        {
                            fetchingMentors ? (
                                <div className='flex flex-col items-center justify-center w-full ' >
                                    <ReactLoading type="bubbles" color="#242424"
                                        height={70} width={70}
                                    />

                                    <p>Fetching Mentors..</p>
                                </div>
                            ) : (
                                <ul>
                                    {teachers.map((student) => (
                                        <li key={student.id} className='p-2 border mb-1' >
                                            <label  >
                                                <input
                                                    type="radio"
                                                    checked={student._id === selectedMentor}
                                                    onChange={() => setSelectedMentor(student._id)}
                                                    className=''
                                                    name='mentor'
                                                />
                                                &nbsp; {student.name}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            )
                        }

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignationWindow;
