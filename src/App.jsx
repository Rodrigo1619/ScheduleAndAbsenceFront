import React from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AdminPage from './pages/Admin Page/AdminPage';
import DBDashboard from './pages/DB Dashboard/DB-Dashboard';
import StudentPage from './pages/Student Page/StudentPage';
import TeacherPage from './pages/Teacher Page/TeacherPage';
import CodePage from './pages/Code Page/CodePage';
import ClassroomPage from './pages/Classroom Page/ClassroomPage';
import GradePage from './pages/Grade Page/GradePage';
import RolPage from './pages/Rol Page/RolPage';
import ShiftPage from './pages/Shift Page/ShiftPage';
import SubjectPage from './pages/Subject Page/SubjectPage';
import Login from './pages/Login/Login';
import CheckMail from './pages/ForgotPassword/CheckMail Page/CheckMailPage';
import ResetPassword from './pages/ForgotPassword/ResetPassword Page/ResetPasswordPage';
import HomePage from './pages/Home Page/HomePage';
import CoordinatorHomepage from './pages/Coodinator Homepage/CoordinatorHomepage';
import UserxSubjectPage from './pages/UserxSubject Page/UserxSubjectPage';
import Shedule from './pages/Schedule Page/SchedulePage';
import ModeratorPage from './pages/Moderator Page/ModeratorPage';
import AddSchedulePage from './pages/Add Schedule Page/AddSchedulePage';
import TeacherSearch from './pages/Teacher Search/TeacherSearch';
import PopulateClassroom from './pages/PopulateClassroom/PopulateClassroom';
import ClassroomSchedulePage from './pages/Classroom Schedule Page/ClassroomSchedulePage';
import PrivateElement from './Components/Private/PrivateElement';
import Error404Page from './pages/Error404/Error404Page';
import TeacherSchedulePage from './pages/Teacher Schedule Page/TeacherSchedulePage';
import AddHourConfigurationPage from './pages/Add Hour Configuration Page/AddHourConfigurationPage';
import AttendanceGeneralViewPage from './pages/AttendanceGeneralViewPage/AttendanceGeneralViewPage';
import AttendanceGlobalPage from './pages/AttendanceGlobalPage/AttendanceGlobalPage';
import AttendanceVerification from './pages/AttendanceVerificationPage/AttendanceVerificationPage';
import AttendanceRegisterPage from './pages/AttendanceRegisterPage/AttendanceRegisterPage';
import EnrollStudentsPage from './pages/Enroll Students Page/EnrollStudentsPage';
import TeacherScheduleView from './pages/Teacher Schedule View/TeacherScheduleView';


function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/ForgotPassword" element={<CheckMail />} />
            <Route path='/ResetPassword' element={<ResetPassword/>}/>
            <Route path="/AdminPage" element={<PrivateElement admittedRoles={["Administrador"]}> <AdminPage /> </PrivateElement>} />
            <Route path="/ModeratorPage" element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <ModeratorPage /> </PrivateElement>} />
            <Route path='/StudentPage' element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <StudentPage/> </PrivateElement>}/>
            <Route path='/TeacherPage' element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <TeacherPage/> </PrivateElement>}/>
            <Route path='/ClassroomPage' element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <ClassroomPage/> </PrivateElement>}/>
            <Route path='/GradePage' element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <GradePage/> </PrivateElement>}/>
            <Route path='/RolPage' element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <RolPage/> </PrivateElement>}/>
            <Route path='/ShiftPage' element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <ShiftPage/> </PrivateElement>}/>
            <Route path='/SubjectPage' element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <SubjectPage/> </PrivateElement>}/>
            <Route path="/CodePage" element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <CodePage /> </PrivateElement>} />
            <Route path="/HomePage" element={<PrivateElement admittedRoles={["Administrador", "Moderador", "Profesor"]}> <HomePage /> </PrivateElement>} />
            <Route path="/UserxSubjectPage" element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <UserxSubjectPage /> </PrivateElement>} />
            <Route path="/CoordinatorHomepage" element={<PrivateElement admittedRoles={["Administrador", "Coordinador"]}> <CoordinatorHomepage /> </PrivateElement>} />
            <Route path="/SchedulePage" element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <Shedule /> </PrivateElement>} />
            <Route path="/DBDashboard" element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <DBDashboard /> </PrivateElement>} />
            <Route path="/AddSchedule" element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <AddSchedulePage /> </PrivateElement>} />
            <Route path='/SearchTeacher' element={<PrivateElement admittedRoles={["Administrador" , "Moderador", "Profesor", "Coordinador", "Asistencia"]}> <TeacherSearch/> </PrivateElement>}/>
            <Route path='/PopulateClassroom' element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <PopulateClassroom/> </PrivateElement>}/>
            <Route path='/ClassroomSchedule' element={<PrivateElement admittedRoles={["Administrador", "Moderador", "Coordinador"]}> <ClassroomSchedulePage/> </PrivateElement>}/>
            <Route path='/TeacherSchedule' element={<PrivateElement admittedRoles={["Administrador", "Moderador", "Profesor", "Coordinador"]}> <TeacherScheduleView/> </PrivateElement>}/>
            <Route path='/HourConfiguration' element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <AddHourConfigurationPage/> </PrivateElement>}/>
            <Route path='/AttendanceGeneralView' element={<PrivateElement admittedRoles={["Administrador", "Moderador", "Profesor", "Coordinador"]}> <AttendanceGeneralViewPage/> </PrivateElement>}/>
            <Route path='/AttendanceGlobalView' element={<PrivateElement admittedRoles={["Administrador", "Moderador", "Profesor", "Coordinador"]}> <AttendanceGlobalPage/> </PrivateElement>}/>
            <Route path='/AttendanceVerificationView' element={<PrivateElement admittedRoles={["Administrador", "Moderador", "Profesor", "Coordinador"]}> <AttendanceVerification/> </PrivateElement>}/>
            <Route path='/AttendanceRegisterView' element={<PrivateElement admittedRoles={["Profesor", "Asistencia"]}> <AttendanceRegisterPage/> </PrivateElement>}/> 
            <Route path='/EnrollStudents' element={<PrivateElement admittedRoles={["Administrador", "Moderador"]}> <EnrollStudentsPage/> </PrivateElement>}/>
            <Route path="*" element={<Error404Page/>} />
        </Routes>
    </Router>
  );
}

export default App;
