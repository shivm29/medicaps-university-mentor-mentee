import React, { useEffect, useState } from 'react'
import { useAuth } from "../../context/Auth"
import axios from "axios"

const StudentHome = () => {

  const [auth] = useAuth();
  const [documents, setDocuments] = useState(null)
  const baseURL = process.env.REACT_APP_API
  const [uploadName, setUploadName] = useState("")
  const [uploadType, setUploadType] = useState("")
  const [uploadDocument, setUploadDocument] = useState("")
  const [uploading, setUploading] = useState(false)


  const getDocsHandler = async () => {

    try {

      const res = await axios.get(`${baseURL}/api/v1/docs/get-docs`)

      if (res.data.success) setDocuments(res?.data?.documents)
      else {
        console.log(res.data.message)
      }

    } catch (error) {
      console.log("error : ", error)
    }
  }


  const uploadDocumentHandler = async (e) => {
    e.preventDefault();
    try {
      const documentData = new FormData();
      documentData.append("name", uploadName)
      documentData.append("type", uploadType)
      documentData.append("document", uploadDocument)

      const res = await axios.post(`${baseURL}/api/v1/docs/upload-docs`, documentData)

      if (res.data.success) {
        window.alert("Upload successful")
        setDocuments([...documents, res?.data?.new_doc])

      }
      else {
        window.alert(`Error in uploading : ${res.data.error}`)
      }

    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getDocsHandler();


  }, [])


  return (
    <div>StudentHome
      {
        auth?.user && (
          <>
            <h1>Welcome {auth?.user?.name}</h1>
          </>
        )
      }

      <p>Here are your docs :</p>


      {
        documents?.map((doc) => {
          return (<li key={doc.id} >{doc.name} - {doc.status} </li>)
        })
      }

      <br />
      <br />

      <form onSubmit={uploadDocumentHandler}>
        <input placeholder='document name..' type="text" value={uploadName} onChange={(e) => setUploadName(e.target.value)} />
        <br />
        <input placeholder='document type..' type="text" value={uploadType} onChange={(e) => setUploadType(e.target.value)} />

        <br />
        <input type="file" onChange={(e) => setUploadDocument(e.target.files[0])} />

        <button disabled={uploading} type='submit' >Submit</button>
      </form>

      {uploading && ("uploading ... ")}

    </div>
  )
}

export default StudentHome