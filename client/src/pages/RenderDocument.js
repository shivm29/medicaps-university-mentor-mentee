import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactLoading from "react-loading"
import { Document, Page } from 'react-pdf';
import { useAuth } from '../context/Auth';


const RenderDocument = () => {

  const params = useParams()
  const baseurl = process.env.REACT_APP_API
  const [auth, setAuth] = useAuth();
  const [document, setDocument] = useState(null)
  const [documentType, setDocumentType] = useState(null)
  const [loadingDoc, setLoadingDoc] = useState(false)

  const getDocument = async () => {
    try {
      setLoadingDoc(true)
      const res = await axios.get(`${baseurl}/api/v1/docs/get-doc/${params.doc_id}`)

      if (res.data.success) {
        const base64Data = res.data.document.document.data.data
        console.log('base64Data', base64Data);

        const binaryString = String.fromCharCode.apply(null, base64Data)

        const dataURL = `data:${res.data.document.document.contentType};base64,${btoa(binaryString)}`

        console.log('dataURL', res.data.document.document.data.data);
        setDocument({
          dataURL,
          contentType: res.data.document.document.contentType
        });
        console.log(dataURL)
      }
      else {
        toast("Error in retrieving doc")
      }

      setLoadingDoc(false)

    } catch (error) {

      setLoadingDoc(false)
      console.log('Error:', error);
      toast("An error occured")
    }
  }

  const handleLogout = () => {
    localStorage.clear();

    setAuth({
      user: null,
      token: null
    })

    window.location.reload()

    toast("Logged out successfully")

  }


  useEffect(() => {
    getDocument()
  }, [])

  return (
    <div>

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

      <div className='flex p-4 justify-center ' >

        {loadingDoc ? (
          <div className="flex flex-col w-full items-center mt-10">
            <ReactLoading
              type="bubbles"
              color="#242424"
              height={70}
              width={70}
            />
            <p className="text-sm">Fetching Document...</p>
          </div>
        ) : (
          document && (
            <div>
              {document.contentType.split('/')[0] === 'image' ? (
                <img src={document.dataURL} alt="" />
              ) : document.contentType === 'application/pdf' ? (
                <Document file={document.dataURL}>
                  <Page pageNumber={1} />
                </Document>
              ) : (
                'Unsupported document type'
              )}
            </div>
          )
        )}


      </div>

    </div>
  )
}

export default RenderDocument

