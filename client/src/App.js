import { Route, Routes } from "react-router-dom"
import StudentHome from "./pages/home_pages/StudentHome";
import StudentRoute from "./components/protected_routes/StudentRoute";
import Login from "./pages/auth/Login";
import AdminRoute from "./components/protected_routes/AdminRoute";
import AdminHome from "./pages/home_pages/AdminHome";
import TeacherRoute from "./components/protected_routes/TeacherRoute";
import TeacherHome from "./pages/home_pages/TeacherHome";

function App() {
  return (
    <>
      <Routes>

        <Route path="/student" element={<StudentRoute />}>
          <Route path="/student" element={<StudentHome />} />
        </Route>

        <Route path="/admin" element={<AdminRoute />}>
          <Route path="/admin" element={<AdminHome />} />
        </Route>

        <Route path="/teacher" element={<TeacherRoute />}>
          <Route path="/teacher" element={<TeacherHome />} />
        </Route>


        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
