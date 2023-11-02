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
  const [mentorName, setMentorName] = useState("NA")

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
      console.log(res)
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


  useEffect(() => {
    getStudentDetails()
    getDocsHandler();
  }, [])


  useEffect(() => {
    getMentor()
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

          <h1 className='p-4 pl-0 text-lg mb-4 border-b border-zinc-400' >Student Details</h1>

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
        <h1 className='p-4 pl-0 text-lg mb-4 border-b border-zinc-400' > Student Documents</h1>
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
                  <div className='flex p-2 border mb-1 justify-between px-6' key={index} > <div className='flex p-2  '> {document.name}</div>

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

      </div>
    </div >
  )
}

export default StudentDetails