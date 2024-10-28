import classes from "./DB-Dashboard.module.css";

import React, { useState, useEffect } from "react";
import { Typography, Card, Button } from "@material-tailwind/react";

import { useUserContext } from '../../Context/userContext';
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import TableCard from "../../Components/TableCard/TableCard";

import { userService } from "../../Services/userService";
import { roleService } from "../../Services/roleService";
import { studentService } from "../../Services/studentService";
import { classroomService } from "../../Services/classroomService";
import { gradeService } from "../../Services/gradeService";
import { scheduleService } from "../../Services/scheduleService";
import { subjectService } from "../../Services/subjectService";
import { userxSubjectService } from "../../Services/userxSubjectService";

import { Grid } from 'react-loader-spinner';

const HEAD_TEACHERS = ["Nombre Completo", "Correo", "Rol Asignado", "Correo de Verificación"];

const HEAD_STUDENTS = ["NIE", "Nombre Completo"];

const HEAD_ROLES = ["Rol"];

const HEAD_CLASSROOMS = ["Año", "Grado", "Turno", "Maestro",  "Sección"];

const HEAD_GRADES = ["Grado", "ID Gubernamental", "Sección"];

const TABLE_SCH = ["ID", "Hora Inicio", "Hora Final"];

const HEAD_SCHEDULE = ["ID", "Inicia", "Finaliza", "Profesor", "Materia", "Clase", "Año", "Grado", "Día"];

const HEAD_SUBJECTS = ["Materia"];

const USERXSUBJECTS = ["Profesor", "Materia"];

const SCH = [
    {
        id: "1234566",
        startTime: "07:00",
        endTime: "08:00",
    },
    {
        id: "1234566",
        startTime: "07:00",
        endTime: "08:00",
    },
    {
        id: "1234566",
        startTime: "07:00",
        endTime: "08:00",
    },
    {
        id: "1234566",
        startTime: "07:00",
        endTime: "08:00",
    },
    {
        id: "1234566",
        startTime: "07:00",
        endTime: "08:00",
    },
    {
        id: "1234566",
        startTime: "07:00",
        endTime: "08:00",
    },
];

const DBDashboard = () => {

    const { token } = useUserContext();

    const [loading, setLoading] = useState(true);

    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [grades, setGrades] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [userxsubjects, setUserxSubjects] = useState([]);

    const fetchTeachers = async () => {
        try {
            const data = await userService.getAllPaginated(token, 5, 0);
            setTeachers(data.content);
            console.log(data);
        }
        catch (error) {
            console.log("Hubo un error al obtener los profesores" + error);
        }
    }

    const fetchStudents = async () => {
        try {
            const data = await studentService.getPagedStudents(token, 5, 0);
            setStudents(data.content);
        }
        catch (error) {
            console.log("Hubo un error al obtener los estudiantes" + error);
        }
    }


    const fetchClassrooms = async () => {
        try {
            const data = await classroomService.getPagedClassrooms(token, 5, 0);

            const formattedData = data.content.map(classroom => {
                return {
                    ...classroom,
                    grade: classroom.grade.name.split(" ").slice(0, -1).join(" "),
                    section: classroom.grade.name.split(" ").pop(),
                }
            });

            console.log("salones: ", formattedData);
            setClassrooms(formattedData);
        }
        catch (error) {
            console.log("Hubo un error al obtener los salones de clase" + error);
        }
    }

    const fetchGrades = async () => {
        try {
            const data = await gradeService.getAllPaginated(token, 5, 0);

            const formattedData = data.content.map(grade => {
                return {
                    ...grade,
                    name: grade.name.split("").slice(0, -1).join(""),
                }
            });
            setGrades(formattedData);
        }
        catch (error) {
            console.log("Hubo un error al obtener los grados " + error);
        }

    }

    const fetchSubjects = async () => {
        try {
            const data = await subjectService.getAllSubjects(token);
            setSubjects(data.splice(0, 5));
        }
        catch (error) {
            console.log("Hubo un error al obtener las materias" + error);
        }
    };

    const fetchUserxSubjects = async () => {
        try {
            const data = await userxSubjectService.getUserxSubjects(token);
            setUserxSubjects(data.splice(0, 5));
        }
        catch (error) {
            console.log("Hubo un error al obtener las asignaciones de profesor a materia" + error);
        }
    };


    useEffect(() => {
        if (token) {
            fetchTeachers();
            fetchStudents();
            fetchClassrooms();
            fetchGrades();
            fetchSubjects();
            fetchUserxSubjects();

            setTimeout(() => {
                setLoading(false);
            }, 1500);
        }
    }, [token]);


    return (
        loading ?
            <div className={[classes["loaderContainer"]]}>
                <Grid type="Grid" color="#170973" height={80} width={80} visible={loading} />
            </div>

            :

            <div className={[classes["generalContainer"]]}>
                <header className={[classes["headerContainer"]]}>
                    <Header name="Luis Morales" role="Administrador" />
                </header>

                <div className={[classes["bodyContainer"]]}>
                    <div className={[classes["allContentContainer"]]}>
                        <SideBarNav />
                        <div className={[classes["pageContentContainer"]]}>
                            <Typography className="font-masferrer text-2xl font-light my-4 text-darkblueMasferrer
                                Mobile-390*844:text-sm
                                Mobile-280:text-sm">
                            ADMINISTRACIÓN DE TABLAS
                        </Typography>
                        <div className={classes["tablesContainer"]}>

                            <div className={classes["tableCardContainer"]}>
                                <TableCard
                                    title="Lista de Usuarios"
                                    TABLE_HEAD={HEAD_TEACHERS}
                                    USERS={teachers} />

                                <button type="button" className={classes["quickAddButton"]}>
                                    <Typography
                                        className="font-masferrer text-xl font-medium text-white self-center"
                                        as="a"
                                        href="/TeacherPage">
                                        Administrar Listado de Usuarios
                                    </Typography>
                                </button>
                            </div>

                            <div className={classes["tableCardContainer"]}>
                                <TableCard
                                    title="Lista de Estudiantes"
                                    TABLE_HEAD={HEAD_STUDENTS}
                                    USERS={students} />

                                <button type="button" className={classes["quickAddButton"]}>
                                    <Typography
                                        className="font-masferrer text-xl font-medium text-white self-center"
                                        as="a"
                                        href="/StudentPage">
                                        Administrar Listado de Estudiantes
                                    </Typography>
                                </button>
                            </div>

                            <div className={classes["tableCardContainer"]}>
                                <TableCard
                                    title="Asignación de Profesor a Materia"
                                    TABLE_HEAD={USERXSUBJECTS}
                                    USERS={userxsubjects} />

                                <button type="button" className={classes["quickAddButton"]}>
                                    <Typography
                                        className="font-masferrer text-xl font-medium text-white self-center"
                                        as="a"
                                        href="/UserxSubjectPage">
                                        Administrar Asignación de Materia a Profesor
                                    </Typography>
                                </button>
                            </div>

                            <div className={classes["tableCardContainer"]}>
                                <TableCard
                                    title="Lista de Materias"
                                    TABLE_HEAD={HEAD_SUBJECTS}
                                    USERS={subjects} />

                                <button type="button" className={classes["quickAddButton"]}>
                                    <Typography
                                        className="font-masferrer text-xl font-medium text-white self-center"
                                        as="a"
                                        href="/SubjectPage">
                                        Administrar Listado de Materias
                                    </Typography>
                                </button>
                            </div>

                            <div className={classes["tableCardContainer"]}>
                                <TableCard
                                    title="Lista de Grados"
                                    TABLE_HEAD={HEAD_GRADES}
                                    USERS={grades}
                                    isFromGrade={true} />

                                <button type="button" className={classes["quickAddButton"]}>
                                    <Typography
                                        className="font-masferrer text-xl font-medium text-white self-center"
                                        as="a"
                                        href="/GradePage">
                                        Administrar Grados
                                    </Typography>
                                </button>
                            </div>

                            <div className={classes["tableCardContainer"]}>
                                <TableCard
                                    title="Salones de Clase"
                                    TABLE_HEAD={HEAD_CLASSROOMS}
                                    USERS={classrooms} />

                                <button type="button" className={classes["quickAddButton"]}>
                                    <Typography
                                        className="font-masferrer text-xl font-medium text-white self-center"
                                        as="a"
                                        href="/ClassroomPage">
                                        Administrar Salones de Clase
                                    </Typography>
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default DBDashboard;