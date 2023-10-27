import React, { useEffect, useState } from 'react'
import { useAuth } from "../../context/Auth"
import axios from "axios"

const StudentHome = () => {

  const [auth, setAuth] = useAuth();
  const [documents, setDocuments] = useState(null)
  const baseURL = process.env.REACT_APP_API


  const getDocsHandler = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/v1/docs/get-docs/${auth?.user?.id}`)

      if (res.data.success) setDocuments(res?.data?.documents)
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
          return (<li key={doc.id} >{doc.name}</li>)
        })
      }

    </div>
  )
}

export default StudentHome