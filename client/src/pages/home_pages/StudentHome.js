import React, { useEffect, useState } from 'react'
import { useAuth } from "../../context/Auth"
import axios from "axios"
import Navbar from '../../components/Navbar';
import ReactLoading from "react-loading"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-dropdown-select";
import { Link } from 'react-router-dom';


const StudentHome = () => {

  const [auth, setAuth] = useAuth();
  const [documents, setDocuments] = useState(null)
  const baseURL = process.env.REACT_APP_API
  const [uploadName, setUploadName] = useState("")
  const [uploadType, setUploadType] = useState("")
  const [uploadDocument, setUploadDocument] = useState("")
  const [uploading, setUploading] = useState(false)
  const [fetchingMeetings, setFetchingMeetings] = useState(false)

  const [meetings, setMeetings] = useState([])

  const [fetchingDocs, setFetchingDocs] = useState(false)

  const handleLogout = () => {
    localStorage.clear();

    setAuth({
      user: null,
      token: null
    })

    window.location.reload()

    toast("Logged out successfully")

  }


  const getDocsHandler = async () => {

    try {
      setFetchingDocs(true)
      const res = await axios.get(`${baseURL}/api/v1/docs/get-docs`)

      if (res.data.success) setDocuments(res?.data?.documents)
      else {
        console.log(res.data.message)
      }

      setFetchingDocs(false)

    } catch (error) {
      setFetchingDocs(false)
      console.log("error : ", error)
    }
  }


  const uploadDocumentHandler = async (e) => {
    e.preventDefault();
    try {

      setUploading(true)
      const documentData = new FormData();
      documentData.append("name", uploadName)
      documentData.append("type", uploadType[0].value)
      documentData.append("document", uploadDocument)

      const res = await axios.post(`${baseURL}/api/v1/docs/upload-docs`, documentData)

      if (res.data.success) {
        setDocuments((prevDocuments) => [...(prevDocuments || []), res.data.new_doc]);
        toast("Upload Successful");
      }

      else {
        toast(`Error in uploading: ${res.data.error}`, { type: "error" });
      }
      setUploadName("")
      setUploadType("")
      setUploadDocument(null)
      setUploading(false)


    } catch (error) {

      setUploading(false)
      toast("Error in uploading Document")
    }
  }


  useEffect(() => {
    getDocsHandler();


  }, [])

  const options = [
    { label: "Academic", value: "academic" },
    { label: "Non-Academic", value: "nonacademic" }
  ];


  const getMeetingsHandler = async () => {
    try {
      setFetchingMeetings(true)
      const res = await axios.get(`${baseURL}/api/v1/meetings/get-meetings-by-students`)

      if (res.data.success) {
        setMeetings(res.data.meetings)
      }
      setFetchingMeetings(false)

    } catch (error) {
      setFetchingMeetings(false)
      console.log(error)
    }
  }


  useEffect(() => {
    getMeetingsHandler();
  }, [])



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
            <>
              <h1 className='text-xl mb-4 flex pl-2 pb-4 border-b' > <i class="fa-solid fa-hands-praying"></i> &nbsp; Welcome  {auth?.user?.name}</h1>
            </>
          )
        }


        <p className='flex w-full items-center justify-start p-4 pl-2 text-xl ' ><i class="fa-regular fa-folder-open"></i> &nbsp; Here are your docs</p>

        <div className='flex p-2  mb-3 justify-between border-b border-zinc-400 px-2'  > <div className='flex' ><i class="fa-regular fa-folder"></i> &nbsp; Documents</div>  <div ><i class="fa-regular fa-clock" /> &nbsp;Status</div> </div>

        {
          fetchingDocs ? (
            <div className='flex flex-col w-full items-center mt-10' >
              <ReactLoading type="bubbles" color="#242424"
                height={70} width={70}
              />

              <p className='text-sm'>Fetching Documents... </p>
            </div>
          ) : (
            documents ? (documents?.map((doc, index) => {
              return (
                <Link to={`/student/document/${doc._id}`} key={index} >
                  <div className='flex p-2 border mb-1 justify-between' ><div className='flex p-2 rounded-lg ' ><i class="fa-regular fa-file"></i> &nbsp; {doc.name} </div>  <div className={` text-xs rounded-sm ml-2 flex justify-center items-center p-2 text-white  hover:scale-95 ease-in-out duration-300 
              ${doc?.status === "approved" ? "bg-green-400" : "bg-red-400"}
              `}   ><p> {doc.status === "pending" ? <i class="fa-regular fa-clock"></i> : <i className='fa-regular fa-thumbs-up' ></i>} &nbsp; {doc.status} </p></div></div></Link>
              )
            })) : (
              <div className='flex py-10 justify-center items-center' > No Documents Uploaded : ( </div>
            )
          )
        }


        <br />
        <p className='flex w-full items-center justify-start p-4 pl-2 text-xl ' ><i class="fa-regular fa-clock"></i> &nbsp; Meetings with Mentor</p>
        <div className='flex flex-col mb-10' >

          <div className='flex justify-between p-2 border-b border-zinc-400 mb-4' >
            <div className='flex' >
              <h3 className='p-2' > <i class="fa-regular fa-calendar"></i> &nbsp; Date / &nbsp;<i class="fa-regular fa-hand"></i> &nbsp; Attendance</h3>
            </div>

            <h3 className='mr-5' ><i class="fa-regular fa-comment"></i> &nbsp; Advice</h3>
          </div>
          {
            fetchingMeetings ? (<div className='flex flex-col w-full items-center mt-10' >
              <ReactLoading type="bubbles" color="#242424"
                height={70} width={70}
              />

              <p className='text-sm'>Fetching Meetings... </p>
            </div>) : (
              meetings ? (
                meetings.map((meeting, index) => {
                  return (
                    <div className='flex p-2 mb-1 border justify-between' >
                      <div className='flex' >
                        <h3 className='p-2 ' ><i class="fa-regular fa-calendar"></i> &nbsp;{meeting?.createdAt?.split("T")[0]}</h3>
                        <h3 className='p-2 mr-10' ><i class="fa-regular fa-hand"></i> &nbsp; {meeting?.attendance}%</h3>
                      </div>
                      <h3 className='p-2' > <i class="fa-regular fa-comment"></i> &nbsp; {meeting?.advice}</h3>
                    </div>
                  )
                })
              ) : ("")
            )
          }
        </div>

        <p className='flex w-full items-center justify-start p-4 text-xl border-b px-2 border-zinc-400' ><i class="fa-solid fa-upload"></i> &nbsp; Upload your Docs</p>

        <form className='flex flex-col' onSubmit={uploadDocumentHandler}>

          <div className='flex justify-around ' >

            <div className='flex-1 p-2'>
              <input placeholder='Enter Document name..' className=' w-full focus:outline-none p-2 border my-3 mr-3 placeholder:text-sm ' type="text" value={uploadName} onChange={(e) => setUploadName(e.target.value)} />
            </div>

            <br />

            <div className='flex-1 my-3 font-Poppins text-md p-2' >
              <Select
                placeholder='Select Category'
                className='text-lg h-full' options={options}
                onChange={setUploadType}
                defaultValue={uploadType}
                multi={false}
              />
            </div>

          </div>

          <br />


          <div className="flex items-center justify-center w-full ">
            <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400"> PNG, JPG, PDF, JPEG (MAX : 2MB)</p>
              </div>
              <input id="dropzone-file" onChange={(e) => setUploadDocument(e.target.files[0])} type="file" className="hidden" />
            </label>
          </div>




          <button className='flex justify-center items-center p-3 bg-black text-white  hover:scale-95 ease-in-out duration-300 ' disabled={uploading} type='submit' >Submit</button>
        </form>

        {uploading && (
          <div className='flex items-center justify-center z-50 fixed top-0 left-0 h-screen w-full bg-black bg-opacity-10 ' >
            <ReactLoading type="bubbles" color="#242424"
              height={70} width={70}
            />
          </div>
        )}

        <br />
        <br />



      </div>
    </div>
  )
}

export default StudentHome