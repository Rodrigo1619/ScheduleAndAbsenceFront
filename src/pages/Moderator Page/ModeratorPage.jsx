import React, { useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { HiUserAdd } from "react-icons/hi";
import { AiOutlinePlusSquare, AiOutlineSchedule } from "react-icons/ai";
import { FaChalkboardTeacher, FaChalkboard } from "react-icons/fa";
import tableIcon from "../../assets/icons/table-icon.svg";
import usersIcon from "../../assets/icons/users-icon.svg";
import userPlusIcon from "../../assets/icons/user-plus-icon.svg";
import filePlusIcon from "../../assets/icons/file-plus-icon.svg";
import fileIcon from "../../assets/icons/file-icon.png";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import QuickAccessButtons from "../../Components/QuickAccessButtons/QuickAccessButtons";
import classes from "./ModeratorPage.module.css";

const ModeratorPage = () => {

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
    }, []);

    return (
        <div className={classes.generalContainer}>
            <header className={classes.headerContainer}>
                <Header name="Rodrigo Z." role="Moderator" />
            </header>

            <div className={classes.bodyContainer}>
                <div className={classes.allContentContainer}>
                    <SideBarNav role="Moderator" />
                    <div className={classes.pageContentContainer}>
                        <div className={classes.TitleContainer}>
                            <Typography className="font-masferrer text-2xl font-light my-4">
                                ADMINISTRACIÓN DE INFORMACIÓN
                            </Typography>
                        </div>
                        <div className={classes.SubtitleContainer}>
                            <QuickAccessButtons 
                                title="Acciones Profesores:"
                                iconsvg1={userPlusIcon} description1="Registrar un nuevo profesor" link1="/TeacherPage"
                                iconsvg2={filePlusIcon} description2="Asignar materia a un profesor" link2="/UserxSubjectPage"
                                iconsvg3={fileIcon} description3="Asignar horario a salon de clase" link3="/AddSchedule"
                            />
                        </div>
                        <div className={classes.SubtitleContainer}>
                            <QuickAccessButtons 
                                title="Acciones Alumnos y Salón de Clase:"
                                iconsvg1={filePlusIcon} description1="Asignar orientador a salón de clase" link1=""
                                iconsvg2={userPlusIcon} description2="Registrar un nuevo alumno" link2=""
                                iconsvg3={usersIcon} description3="Asignar alumnos a un aula" link3=""
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModeratorPage;

