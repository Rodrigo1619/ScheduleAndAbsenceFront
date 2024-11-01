import React, { useState, useEffect } from "react";
import {
    Navbar,
    Button,
    Typography,
} from "@material-tailwind/react";
import classes from "./AdminPage.module.css";
import { FcPhone, FcClock, FcHome } from "react-icons/fc";
import tableIcon from "../../assets/icons/table-icon.svg";
import usersIcon from "../../assets/icons/users-icon.svg";
import clipboardListIcon from "../../assets/icons/clipboard-list-icon.svg";
import userPlusIcon from "../../assets/icons/user-plus-icon.svg";
import filePlusIcon from "../../assets/icons/file-plus-icon.svg";
import calendarIcon from "../../assets/icons/calendar-icon.svg";
import classroomIcon from "../../assets/icons/classroom-icon.svg";
import schoolIcon from "../../assets/icons/school-icon.svg";
import searchIcon from "../../assets/icons/search-icon.svg";
import clockIcon from "../../assets/icons/clock-solid.svg";
import studentTeachersClasroomIcon from "../../assets/icons/studentTeachersClassroom-icon.svg";
import enrollIcon from "../../assets/icons/enroll-student.svg";
import QuickAccessButtons from "../../Components/QuickAccessButtons/QuickAccessButtons";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";

import { useUserContext } from "../../Context/userContext"




const AdminPage = () => {

    const { token, user } = useUserContext();

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
    }, []);

    useEffect(() => {
        console.log("User: ", user);
    }
        , [user]);

    return (
        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <div className={[classes["allContentContainer"]]}>
                    <div className={[classes["pageContentContainer"]]}>
                        <div className={[classes["TitleContainer"]]}>
                            <Typography className="font-masferrer text-2xl font-light my-4
                            Mobile-390*844:text-sm
                            Mobile-280:text-sm
                            ">ADMINISTRACIÓN DE LA BASE DE DATOS</Typography>
                        </div>
                        <div className={[classes["SubtitleContainer"]]}>
                            <QuickAccessButtons title="Acciones Generales:"
                                iconsvg1={tableIcon} description1="Administrar tablas de bases de datos" link1="/DBDashboard"
                                iconsvg2={usersIcon} description2="Revisar listado de asistencias" link2="/AttendanceGeneralView"
                                iconsvg3={clipboardListIcon} description3="Reportar inasistencias" link3="/AttendanceRegisterView"/>
                        </div>
                        <div className={[classes["SubtitleContainer"]]}>
                            <QuickAccessButtons title="Acciones profesores:"
                                iconsvg1={userPlusIcon} description1="Registrar un nuevo profesor" link1="/TeacherPage"
                                iconsvg2={filePlusIcon} description2="Asignar materia a profesor" link2="/UserXSubjectPage"
                                iconsvg3={calendarIcon} description3="Asignar horario a salon de clase" link3="/AddSchedule"/>
                        </div>
                        <div className={[classes["SubtitleContainer"]]}>
                            <QuickAccessButtons title="Acciones Alumnos y Salón de clase:"
                                iconsvg1={schoolIcon} description1="Registrar un nuevo salón de clase" link1="/ClassroomPage"
                                iconsvg2={clockIcon} description2="Configuración de horas para el salón de clases" link2="/HourConfiguration"
                                iconsvg3={studentTeachersClasroomIcon} description3="Agregar alumnos a un aula" link3="/PopulateClassroom"/>
                        </div>
                        <div className={[classes["SubtitleContainer"]]}>
                            <QuickAccessButtons title="Acciones de consulta:"
                                iconsvg1={classroomIcon} description1="Ver horario de un salon de clases" link1="/ClassroomSchedule"
                                iconsvg2={searchIcon} description2="Búsqueda de maestro" link2="/SearchTeacher"
                                iconsvg3={enrollIcon} description3="Matricular estudiantes" link3="/EnrollStudents"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}



export default AdminPage;
