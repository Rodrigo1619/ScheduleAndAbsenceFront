import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

import { Toaster, toast } from 'sonner';
import { AiOutlineLoading } from "react-icons/ai";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Grid } from 'react-loader-spinner';

import classes from "./AttendanceRegisterPage.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import TableAttendanceComponent from '../../Components/TableRegisterAttendance/TableRegisterAttendanceComponent';

import { useUserContext } from "../../Context/userContext";

import { classroomService } from "../../Services/classroomService";
import { absenceRecordService } from "../../Services/absenceRecordService";

const tableHeaders = [
    "Nombre", "Faltó"
];

const AttendanceRegisterViewPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    const currentDate = new Date();
    const minDate = new Date();
    minDate.setDate(currentDate.getDate() - 3);

    const formatDateForInput = (date) => {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        if (newDate <= currentDate && newDate >= minDate) {
            setSelectedDate(newDate);
        }
    };

    const handlePreviousDay = () => {
        const previousDay = new Date(selectedDate);
        previousDay.setDate(previousDay.getDate() - 1);
        if (previousDay >= minDate) {
            setSelectedDate(previousDay);
        }
    };

    const handleNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        if (nextDay <= currentDate) {
            setSelectedDate(nextDay);
        }
    };

    const { token, user } = useUserContext();

    const [classroom, setClassroom] = useState();
    const [studentList, setStudentList] = useState([]);
    const [absentStudents, setAbsentStudents] = useState([]);

    const [openResume, setOpenResume] = useState(false);

    const [boysCount, setBoysCount] = useState(0);
    const [girlsCount, setGirlsCount] = useState(0);

    const handleOpenDialog = () => {
        setOpenResume(true);

        setAbsentStudents(studentList.filter(student => student.absent === "Si"));
    };

    const handleCloseDialog = () => {
        setOpenResume(false);
    };

    useEffect(() => {
        console.log("Usuario: ", user);

        const year = new Date().getFullYear();

        if(user?.role.name === "Asistencia"){
            const fetchStudentList = async () => {
                try {

                    const nie = user?.email.split('@')[0];

                    const data = await classroomService.getClassStudentsByNieAndYear(token, nie, year);

                    const formatedData = data.students.map(student => {
                        return {
                            ...student,
                            absent: "No",
                        }
                    });
    
                    console.log("Formated Data: ", formatedData);
    
                    setStudentList(formatedData);
                    setClassroom(data.classroom);
                } catch (error) {
                    console.log(`Hubo un error al obtener la lista de estudiantes: ${error}`);
                } finally{
                    setTimeout(() => {
                        setLoading(false);
                    }, 1500);
                }
            };

            fetchStudentList();
        };

        if (user?.role.name === "Profesor"){
            const fetchClassrooms = async () => {
                try {
                    const data = await classroomService.getByUserAndYear(token, year);

                    console.log("Data: ", data[0]);
                    setClassroom(data[0]);
                } catch (error) {
                    console.log(`Hubo un error al obtener los datos del salon: ${error}`);
                }
            };

            fetchClassrooms();
        };

    }, [token, user]);

    useEffect(() => {
        
        if(user?.role.name === "Profesor" && classroom){
            const fetchStudentList = async () => {
                try {
                    const data = await classroomService.getClassStudentsByClassroomID(token, classroom.id);
    
                    const formatedData = data.map(student => {
                        return {
                            ...student,
                            absent: "No",
                        }
                    });
    
                    console.log("Formated Data: ", formatedData);
    
                    setStudentList(formatedData);
    
                } catch (error) {
                    console.log(`Hubo un error al obtener la lista de estudiantes: ${error}`);
                } finally{
                    console.log("Cargando...");
                    setTimeout(() => {
                        setLoading(false);
                    }, 1500);
                }
            };
    
            fetchStudentList();
        }

    }, [classroom]);

    const handleBoyCountChange = (e) => {
        setBoysCount(e.target.value);
    };

    const handleGirlCountChange = (e) => {
        setGirlsCount(e.target.value);
    };

    const handleRegisterAbsenceRecord = async () => {

        const absenceRecordJSON = {
            date: selectedDate.toISOString().split('T')[0],
            maleAttendance: boysCount,
            femaleAttendance: girlsCount,
            absentStudents: absentStudents.map(student => ({id_student: student.id}))
        };

        console.log("Registro de inasistencia: ", absenceRecordJSON); 

        const loadingToast = toast('Cargando...', {
            icon: <AiOutlineLoading className="animate-spin" />,
        });
        
        try {
            const response = await absenceRecordService.createAbsenceRecord(token, absenceRecordJSON, classroom);

            if (response) {
                toast.success('Registro de inasistencia exitoso', { 
                    duration: 2000,
                    icon: <CheckCircleIcon style={{color: "green"}} />,
                });
                handleCloseDialog();
            }

        } catch (error) {
            console.log(`Hubo un error al registrar la inasistencia: ${error}`);
            toast.error('Ocurrio un error', {
                duration: 2000,
                icon: <XCircleIcon style={{color: "red"}} />,
            });
        }finally{
            toast.dismiss(loadingToast);
        }
        
    };

    return (
        loading ?
            <div className={[classes["loaderContainer"]]}>
                <Grid type="Grid" color="#170973" height={80} width={80} visible={loading} />
            </div>

            :

        <div className={classes["generalContainer"]}>
            <header className={classes["headerContainer"]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={classes["bodyContainer"]}>
                <div className={classes["allContentContainer"]}>
                    <div className={classes["pageContentContainerCol"]}>
                        <Toaster />
                        <div className={classes["TitleContainer"]}>
                            <div className={classes["yearSelect"]}>
                                <p>{classroom?.grade.name}</p>
                            </div>
                            {/* Contenedor para las flechas y el input de fecha */}
                            <div className={classes["dateNavigationContainer"]}>
                                <button
                                    className={classes["dateButton"]}
                                    onClick={handlePreviousDay}
                                    disabled={selectedDate <= minDate}
                                >
                                    ←
                                </button>
                                <input
                                    type="date"
                                    value={formatDateForInput(selectedDate)}
                                    onChange={handleDateChange}
                                    className={classes["dateInput"]}
                                    max={formatDateForInput(currentDate)}
                                    min={formatDateForInput(minDate)}
                                />
                                <button
                                    className={classes["dateButton"]}
                                    onClick={handleNextDay}
                                    disabled={selectedDate >= currentDate}
                                >
                                    →
                                </button>
                            </div>
                            {/* Botón Verificar */}
                            <Button className={classes["yearSelect"]} onClick={handleOpenDialog}>
                                Enviar
                            </Button>
                        </div>
                        <div className={classes["pageContentContainerRow"]}>
                        <Dialog open={openResume} handler={handleOpenDialog}>
                            <DialogHeader> Confirmar Inasistencia </DialogHeader>
                            <DialogBody> 
                                
                                <p className={classes["dialogInfo"]}>
                                    Fecha: &nbsp; <span className="font-bold">{selectedDate.toISOString().split('T')[0]}</span> <br/>
                                    Grado: &nbsp; <span className="font-bold">{classroom?.grade.name}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Turno: &nbsp; <span className="font-bold">{classroom?.shift.name}</span> <br/>
                                    Orientador: &nbsp; <span className="font-bold">{classroom?.homeroomTeacher.name}</span> <br/> <br/>
                                    Cantidad de Niños: &nbsp; <span className="font-bold">{boysCount}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Cantidad de Niñas: &nbsp; <span className="font-bold">{girlsCount}</span> 
                                </p>
                                <br/>
                                <p className={classes["dialogInfo"]}>
                                    <span>Alumnos que faltaron:</span> <br/>
                                    {
                                        absentStudents.map((student, index) => {
                                            return (
                                                <span key={index}>
                                                    <span className={classes["studentInfo"]}>
                                                        {student.nie} &nbsp; - &nbsp; {student.name}
                                                    </span> <br/>
                                                </span>
                                            );
                                            
                                        }, [absentStudents])
                                    }
                                </p>

                            </DialogBody>
                            <DialogFooter>
                                <Button color="green" className="m-4" onClick={handleRegisterAbsenceRecord}> Confirmar </Button>
                                <Button color="red" className="m-4" onClick={handleCloseDialog}> Cancelar </Button>
                            </DialogFooter>
                        </Dialog>
                            <div className={classes["SubtitleContainer"]}>
                                <TableAttendanceComponent
                                    title="LISTADO DE INASISTENCIA DIARIA"
                                    tableHeaders={tableHeaders}
                                    tableData={studentList}
                                    rowsPerPageOptions={[5, 10, 15]}  // Opciones para paginación
                                    isDownload={true}
                                />
                            </div>
                            <form onSubmit={() => (a)} className={[classes["form"]]}>
                                <div className={[classes["input-container"]]}>            
                                    <label className={[classes["label"]]}>
                                        Cantidad de Niños:
                                    </label>
                                    <input type="number" value={boysCount} onChange={handleBoyCountChange} className={[classes["input"]]} />
                                </div>
                                <div className={[classes["input-container"]]}>            
                                    <label className={[classes["label"]]}>
                                        Cantidad de Niñas:
                                    </label>
                                    <input type="number" value={girlsCount} onChange={handleGirlCountChange} className={[classes["input"]]} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceRegisterViewPage;
