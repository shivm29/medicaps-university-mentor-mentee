import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/Auth'
import axios from "axios"
import { useParams } from "react-router-dom"
import Navbar from '../components/Navbar'
import ReactLoading from "react-loading"
import { toast, ToastContainer } from "react-toastify"

const StudentDetails = () => {

  const [auth, setAuth] = useAuth();
  const [documents, setDocuments] = useState(null)
  const baseURL = process.env.REACT_APP_API
  const [fetchingDocs, setFetchingDocs] = useState(false)
  const [studentDetails, setStudentDetails] = useState(null)
  const [fetchingStudentDetails, setFetchingStudentDetails] = useState(false)

  const [advice, setAdvice] = useState(null)
  const [attendance, setAttendance] = useState(null)

  const [meetings, setMeetings] = useState([])

  const handleLogout = () => {
    localStorage.clear();

    setAuth({
      user: null,
      token: null
    })

    window.location.reload()
    window.alert("You are being logged out")
  }



  const params = useParams();

  const getStudentDetails = async () => {

    setFetchingStudentDetails(true)
    try {

      const res = await axios.get(`${baseURL}/api/v1/students/student-details-by-teacher/${params.id}`)
      setStudentDetails(res.data.student)
      setFetchingStudentDetails(false)

    } catch (error) {
      setFetchingStudentDetails(false)
      console.log("error : ", error)

    }
  }

  const getDocsHandler = async () => {
    try {
      setFetchingDocs(true)

      const res = await axios.get(`${baseURL}/api/v1/docs/get-student-docs/${params.id}`)

      if (res.data.success) {
        setDocuments(res.data.documents)
        console.log("res data : ", res.data.documents)
      }
      else {
        console.log(res.data.message)
      }
      setFetchingDocs(false)

    } catch (error) {
      setFetchingDocs(false)
      console.log("error : ", error)
    }
  }

  const docStatusUpdateHandler = async (id, newstatus) => {
    console.log(id, newstatus)
    try {

      const res = await axios.put(`${baseURL}/api/v1/docs/approve-doc`, {
        _id: id,
        status: newstatus
      })

      if (res?.data?.success) {
        setDocuments(prevDocuments => {
          return prevDocuments.map(document => {
            if (document._id === id) {
              // Clone the document and update its status
              return { ...document, status: newstatus };
            }
            return document;
          });
        });

        toast("Status Updated successfully")
      }
      else {
        window.alert(res?.data?.error)
      }

    } catch (error) {
      console.log(error)
    }
  }



  const handleCreateMeetingHandler = async (e) => {
    e.preventDefault()
    try {
      console.log(studentDetails.assigned_teacher)
      const res = await axios.post(`${baseURL}/api/v1/meetings/create-meeting`, {
        attendance,
        advice,
        student_id: studentDetails?._id,
        mentor_id: studentDetails?.assigned_teacher
      })

      if (res.data.success) {
        const newMeeting = res.data.meeting
        console.log("new meeting", res.data.meeting)
        toast("Meeting added")
        setMeetings([...meetings, newMeeting])
        console.log("meetings : ", meetings)
      } else {
        toast("Error, Try again")
      }

      setAdvice("");
      setAttendance("")

    } catch (error) {
      console.log(error)
    }
  }

  const getMeetingsHandler = async () => {
    try {

      console.log("sadjad", studentDetails?._id)

      const res = await axios.get(`${baseURL}/api/v1/meetings/get-meetings`, {
        params: {
          student_id: studentDetails?._id
        }
      })

      if (res.data.success) {
        setMeetings(res.data.meetings)
      }

    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {
    getStudentDetails()
    getDocsHandler();
  }, [])

  useEffect(() => {
    getMeetingsHandler();
  }, [studentDetails])




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
      <div className='flex flex-col w-full p-4' >


        <div className='flex w-full mb-4 flex-col' >

          <h1 className='p-4 pl-0 text-lg mb-4 border-b border-zinc-400' ><i class="fa-solid fa-circle-info"></i> &nbsp; Student Details</h1>

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

                </div>
              )
            )
          }

        </div>
        <h1 className='p-4 pl-0 text-lg mb-4 border-b border-zinc-400' ><i class="fa-regular fa-folder-open"></i> &nbsp; Student Documents</h1>
        {
          fetchingDocs ? (
            <div className='flex flex-col w-full items-center mt-10' >
              <ReactLoading type="bubbles" color="#242424"
                height={70} width={70}
              />

              <p className='text-sm' > Fetching Documents... </p>
            </div>
          ) : (

            documents ? (
              documents.map((document, index) => {
                return (
                  <div className='flex p-2 border mb-1 justify-between pr-6' key={index} > <div className='flex p-2  '><i class="fa-regular fa-file"></i> &nbsp; &nbsp; {document.name}</div>

                    <div className='flex items-center justify-center' >

                      {
                        document.status === "pending" && (
                          <>
                            <button
                              className=' text-xs flex justify-center items-center p-2 bg-black text-white  hover:scale-95 ease-in-out duration-300 '
                              onClick={() => docStatusUpdateHandler(document._id, "approved")} > Approve <i class="fa-solid fa-check ml-2"></i></button>
                            <button
                              className='text-xs flex justify-center items-center p-2 bg-black text-white  hover:scale-95 ease-in-out duration-300 ml-2'
                              onClick={() => docStatusUpdateHandler(document._id, "upapproved")} > Unapprove
                              <i class="fa-solid fa-xmark ml-2"></i>
                            </button>


                          </>
                        )
                      }

                      <div className={`text-xs cursor-default ml-2 flex justify-center items-center p-2 text-white  hover:scale-95 ease-in-out duration-300 
                  ${document?.status === "approved" ? "bg-green-400" : "bg-red-400"}
                  `} >{document.status}</div>


                    </div>

                  </div>
                )
              })
            ) : (<div className='flex w-full justify-center items-center text-zinc-500 pt-20' >No documents uploaded</div>)

          )}

        <h1 className='p-4 pl-0 text-lg mb-4 border-b border-zinc-400' ><i class="fa-regular fa-handshake"></i> &nbsp; Mentor-Mentee Meetings</h1>

        <div className='flex flex-col w-full' >

          <form className='flex w-full justify-between' >

            <div className='flex flex-1' > <input value={attendance} onChange={(e) => setAttendance(e.target.value)} type="number" placeholder='Current attendance' className='focus:outline-none p-2 border border-zinc-400' />


              <input value={advice} onChange={(e) => setAdvice(e.target.value)} type="text" placeholder='Your advice..' className='w-1/2 mx-4 focus:outline-none p-2 border border-zinc-400 ' /></div>


            <button onClick={handleCreateMeetingHandler} className='bg-black text-white p-2 text-xs rounded-sm' >Create New Meeting</button>


          </form>


          <div className='flex flex-col mt-4 mb-10' >
            <div className='flex justify-between p-2 border-b border-zinc-400 mb-4' >
              <div className='flex' >
                <h3 className='p-2' ><i class="fa-regular fa-calendar"></i> &nbsp; Date / &nbsp;<i class="fa-regular fa-hand"></i> &nbsp; Attendance</h3>
              </div>

              <h3 className='mr-5' ><i class="fa-regular fa-comment"></i> &nbsp; Advice</h3>
            </div>
            {
              meetings ? (
                meetings.map((meeting, index) => {
                  return (
                    <div className='flex p-2 mb-1 border justify-between' >
                      <div className='flex' >
                        <h3 className='p-2 ' ><i class="fa-regular fa-calendar"></i> &nbsp;{meeting?.createdAt?.split("T")[0]}</h3>
                        <h3 className='p-2 mr-10' ><i class="fa-regular fa-hand"></i> &nbsp;{meeting?.attendance}%</h3>
                      </div>
                      <h3 className='p-2' ><i class="fa-regular fa-comment"></i> &nbsp; {meeting?.advice}</h3>
                    </div>
                  )
                })
              ) : ("")
            }
          </div>

        </div>

      </div>
    </div>
  )
}

export default StudentDetails