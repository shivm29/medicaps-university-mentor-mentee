import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/Auth'
import axios from "axios"
import { useParams } from "react-router-dom"

const StudentDetails = () => {

  const [auth, setAuth] = useAuth();
  const [documents, setDocuments] = useState(null)
  const baseURL = process.env.REACT_APP_API

  const params = useParams();

  const getDocsHandler = async () => {
    try {

      const res = await axios.get(`${baseURL}/api/v1/docs/get-student-docs/${params.id}`)

      if (res.data.success) {
        setDocuments(res.data.documents)
        console.log("res data : ", res.data.documents)
      }
      else {
        console.log(res.data.message)
      }

    } catch (error) {
      console.log("error : ", error)
    }
  }

  useEffect(() => {
    getDocsHandler();
  }, [])

  return (
    <div>
      StudentDetails
      {
        documents ? (
          documents.map((document, index) => {
            return (
              <li key={index} > {document.name} </li>
            )
          })
        ) : ("No documents uploaded")
      }
    </div>
  )
}

export default StudentDetails