import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useSearchParams } from "react-router-dom";
import { Grid } from 'react-loader-spinner';
import { Toaster, toast } from 'sonner';

import classes from "./AttendanceVerificationPage.module.css";
import { AiOutlineLoading } from "react-icons/ai";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

import Header from "../../Components/Header/Header";
import TableAttendanceComponent from '../../Components/TableVerificationAttendance/TableVerificationAttendanceComponent';

import { useUserContext } from "../../Context/userContext";
import { absenceRecordService } from "../../Services/absenceRecordService"
import { classroomService } from "../../Services/classroomService";

const tableHeaders = [
    "", "Código", "ID Sección", "Fecha", "NIE", "Nombre", "Justificación", "Observación"
];

const tableData = [
    {
        codigo: "001", //del objeto code
        fecha: "2024-09-26", //del objeto general
        nie: "123456", //student object
        nombre: "Juan Pérez", //student object
        falto: "No", //ya no va
        justificacion: "Injustificado", // del objeto code
        observacion: "Llegó tarde" // del objeto general
    },
    {
        codigo: "002",
        fecha: "2024-09-26",
        nie: "654321",
        nombre: "Ana López",
        falto: "Si",
        justificacion: "Cita Médica",
        observacion: ""
    },
    {
        codigo: "003",
        fecha: "2024-09-26",
        nie: "789456",
        nombre: "Carlos Gómez",
        falto: "No",
        justificacion: "Otro",
        observacion: "Permiso especial"
    }
];

const tableKeys = ["code", "idGoverment",  "date", "student.nie",  "absent", "code.description", "comments"];

const AttendanceVerificationViewPage = () => {
    
    const { token, user } = useUserContext();
    const [ searchParams ] = useSearchParams();
    const [absenceRecord, setAbsenceRecord] = useState();
    const [abscentStudentList, setAbscentStudentList] = useState([]);

    const [teacherValidation, setTeacherValidation] = useState();
    const [coordinationValidation, setCoordinationValidation] = useState();
    
    const classroomID = searchParams.get('id_classroom');
    const [classroom, setClassroom] = useState();
    const shiftID = searchParams.get('id_shift');

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [selectedDate, setSelectedDate] = useState(new Date());

    const currentDate = new Date();
    const minDate = new Date(currentDate);
         minDate.setDate(currentDate.getDate() - 2)

    useEffect(() => {
        console.log("Usuario: ", user);
        const fetchClassroom = async () => {
            try {
                const data = await classroomService.getById(classroomID, token);

                setClassroom(data);
            } catch (error) {
                console.log("Hubo un error al obtener el salón" + error);
            }
        };

        const fetchAbscentStudentList = async () => {
            try {
                const data = await absenceRecordService.getByClassroomAndShift(classroomID, token, shiftID);
                
                if (data.length === 0) {
                    return;
                }

                const formatedDate = selectedDate.toISOString().split('T')[0];
                const filteredList = data.filter(record => record.date === formatedDate);

                console.log(`Lista filtrada del dia ${formatedDate}: `, filteredList[0].absentStudents);
                setAbsenceRecord(filteredList[0]);
                setAbscentStudentList(filteredList[0].absentStudents);

                setTeacherValidation(filteredList[0].teacherValidation);
                setCoordinationValidation(filteredList[0].coordinationValidation);

            } catch (error) {
                console.log("Hubo un error al obtener la lista de estudiantes ausentes" + error);
            }
        };

        fetchAbscentStudentList();
        fetchClassroom();

        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, [selectedDate, token, user]);

    const handleRole = () => {
        if ( user?.role.name === "Profesor" || user?.role.name === "Coordinador" ){
            return true;
        }else {
            return false;
        }
    };

    const formatDateForInput = (date) => {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        if (newDate <= currentDate) {
            setSelectedDate(newDate);
        }
    };

    const handlePreviousDay = () => {
        const previousDay = new Date(selectedDate);
        previousDay.setDate(previousDay.getDate() - 1);
        setSelectedDate(previousDay);
    };

    const handleNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        if (nextDay <= currentDate) {
            setSelectedDate(nextDay);
        }
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleValidation = async () => {
        const loadingToast = toast('Cargando...', {
            icon: <AiOutlineLoading className="animate-spin" />,
        });

        if ( user.role.name === "Profesor"){

            console.log("Validando como Profesor...");


            try {
                const response = await absenceRecordService.teacherValidation(token, absenceRecord.id);
    
                if (response) {
                    toast.success('Se ha verificado la asistencia correctamente', {
                        duration: 2000,
                        icon: <CheckCircleIcon style={{color: "green"}} />,
                    });
    
                    setTeacherValidation(true);
    
                    handleCloseDialog();
                }
    
            } catch (error) {
                toast.error('Ocurrio un error', {
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            } finally {
                // Ocultar el toast de carga cuando termine la búsqueda
                toast.dismiss(loadingToast);
            }
        } else if ( user.role.name === "Coordinador" ){

            console.log("Validando como coordinador...");

            try {
                const response = await absenceRecordService.coordinatorValidation(token, absenceRecord.id);
    
                if (response) {
                    toast.success('Se ha verificado la asistencia correctamente', {
                        duration: 2000,
                        icon: <CheckCircleIcon style={{color: "green"}} />,
                    });
    
                    setCoordinationValidation(true);
    
                    handleCloseDialog();
                }
    
            } catch (error) {
                toast.error('Ocurrio un error', {
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            } finally {
                // Ocultar el toast de carga cuando termine la búsqueda
                toast.dismiss(loadingToast);
            }
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
                                <p>{classroom.grade.name}</p>
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
                            <div className={classes["yearSelect"]}>
                                <p>Profesor: {teacherValidation ? "Verificado" : "Sin Verificar"}</p>
                                <p>Coordinador: {coordinationValidation ? "Verificado" : "Sin Verificar"}</p>
                            </div>
                            {
                                handleRole() ? (
                                    <Button 
                                        onClick={handleOpenDialog} 
                                        className={classes["yearSelect"]}>
                                        Verificar
                                    </Button>
                                ) : (
                                    <Button className={classes["yearSelect"]} disabled>
                                        Verificar
                                    </Button>
                                )
                            }
                        </div>
                        <div className={classes["pageContentContainerRow"]}>
                            <div className={classes["SubtitleContainer"]}>
                                <TableAttendanceComponent
                                    title="LISTADO DE INASISTENCIA DIARIA"
                                    tableHeaders={tableHeaders}
                                    generalData={absenceRecord}
                                    tableData={abscentStudentList}
                                    tableKeys={tableKeys}
                                    absenceRecordDetails={absenceRecord}
                                    rowsPerPageOptions={[5, 10, 15]} 
                                    isDownload={true}
                                />
                            </div>
                        </div>
                        <Dialog open={open} handler={handleOpenDialog}>
                                <DialogHeader> Verificar Asistencia </DialogHeader>
                                <DialogBody> ¿Estás seguro que deseas verificar la inasistencia de { classroom.grade.name }? </DialogBody>
                                <DialogFooter>
                                    <Button color="green" className="m-4" onClick={handleValidation}> Aceptar </Button>
                                    <Button color="red" className="m-4" onClick={handleCloseDialog}> Cancelar </Button>
                                </DialogFooter>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceVerificationViewPage;