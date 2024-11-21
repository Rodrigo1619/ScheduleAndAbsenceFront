import React, { useEffect } from "react";
import { Typography } from "@material-tailwind/react";

import studentTeachersClasroomIcon from "../../assets/icons/studentTeachersClassroom-icon.svg";
import enrollIcon from "../../assets/icons/enroll-student.svg";
import clockIcon from "../../assets/icons/clock-solid.svg";
import schoolIcon from "../../assets/icons/school-icon.svg";
import userPlusIcon from "../../assets/icons/user-plus-icon.svg";
import filePlusIcon from "../../assets/icons/file-plus-icon.svg";
import teacherIcon from "../../assets/icons/teacherchalkb.svg";
import calendarIcon from "../../assets/icons/calendar-icon.svg";

import Header from "../../Components/Header/Header";
import QuickAccessButtons from "../../Components/QuickAccessButtons/QuickAccessButtons";
import classes from "./ModeratorPage.module.css";
import { useUserContext } from "../../Context/userContext";

const ModeratorPage = () => {

    const { user } = useUserContext();

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
    }, []);

    return (
        <div className={classes.generalContainer}>
            <header className={classes.headerContainer}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={classes.bodyContainer}>
                <div className={classes.allContentContainer}>
                    <div className={classes.pageContentContainer}>
                        <div className={classes.TitleContainer}>
                            <Typography className="font-masferrer text-2xl font-light my-4">
                                ADMINISTRACIÓN DE INFORMACIÓN
                            </Typography>
                        </div>
                        <div className={classes.SubtitleContainer}>
                            <QuickAccessButtons 
                                title="Acciones Profesores:"
                                iconsvg1={userPlusIcon} description1="Registrar un nuevo usuario" link1="/TeacherPage"
                                iconsvg2={teacherIcon} description2={"Ver horario de profesor"} link2="/TeacherSchedule"
                                iconsvg3={filePlusIcon} description3="Asignar materia a un profesor" link3="/UserxSubjectPage"
                            />
                        </div>
                        <div className={classes.SubtitleContainer}>
                            <QuickAccessButtons 
                                title="Acciones Alumnos y Salón de Clase:"
                                iconsvg1={schoolIcon} description1="Registrar un nuevo salón de clase" link1="/ClassroomPage"
                                iconsvg2={userPlusIcon} description2="Registrar un nuevo alumno" link2="/StudentPage"
                                iconsvg3={studentTeachersClasroomIcon} description3="Asignar alumnos a un aula" link3="/PopulateClassroom"
                            />
                        </div>
                        <div className={classes.SubtitleContainer}>
                            <QuickAccessButtons 
                                title="Acciones de Consulta:"
                                iconsvg1={clockIcon} description1="Configuración de horas para el salón de clases" link1="/HourConfiguration"
                                iconsvg2={enrollIcon} description2="Matricular estudiantes" link2="/EnrollStudents"
                                iconsvg3={calendarIcon} description3="Asignar horario a salon de clase" link3="/AddSchedule"/>
                        </div>   
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModeratorPage;

