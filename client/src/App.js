import { Route, Routes } from "react-router-dom"
import StudentHome from "./pages/home_pages/StudentHome";
import StudentRoute from "./components/protected_routes/StudentRoute";
import Login from "./pages/auth/Login";
import AdminRoute from "./components/protected_routes/AdminRoute";
import AdminHome from "./pages/home_pages/AdminHome";
import TeacherRoute from "./components/protected_routes/TeacherRoute";
import TeacherHome from "./pages/home_pages/TeacherHome";
import StudentDetails from "./pages/StudentDetails";
import RenderDocument from "./pages/RenderDocument";
import AdminStudentDetails from "./pages/AdminStudentDetails";
import AssignationWindow from "./pages/AssignationWindow";
import AdminTeacherDetails from "./pages/AdminTeacherDetails";

function App() {
  return (
    <>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/student" element={<StudentRoute />}>
          <Route path="/student" element={<StudentHome />} />
          <Route path="/student/document/:doc_id" element={<RenderDocument />} />
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/assignation-window" element={<AssignationWindow />} />
          <Route path="/admin/student-details/:id" element={<AdminStudentDetails />} />
          <Route path="/admin/teacher-details/:id" element={<AdminTeacherDetails />} />
          <Route path="/admin/student-documents/:doc_id" element={<RenderDocument />} />
        </Route>

        <Route path="/teacher" element={<TeacherRoute />}>
          <Route path="/teacher" element={<TeacherHome />} />
          <Route path="/teacher/student-details/:id" element={<StudentDetails />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;
