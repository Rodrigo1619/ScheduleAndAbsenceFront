import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useSearchParams } from "react-router-dom";
import { Grid } from 'react-loader-spinner';
import { Toaster, toast } from 'sonner';
import dayjs from 'dayjs'

import classes from "./AttendanceVerificationPage.module.css";
import { AiOutlineLoading } from "react-icons/ai";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";


import Header from "../../Components/Header/Header";
import TableAttendanceComponent from '../../Components/TableVerificationAttendance/TableVerificationAttendanceComponent';

import { useUserContext } from "../../Context/userContext";
import { absenceRecordService } from "../../Services/absenceRecordService"
import { classroomService } from "../../Services/classroomService";

const tableHeaders = [
    "", "Código", "ID Sección", "Fecha", "NIE", "Nombre", "Faltó", "Justificación", "Observación"
];

const tableData = [
    {
        codigo: "001", //del objeto code
        fecha: "2024-09-26", //del objeto general
        nie: "123456", //student object
        nombre: "Juan Pérez", //student object
        falto: "No", //ya no va
        justificacion: "Otro, No justificado", // del objeto code
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
    const [noContent, setNoContent] = useState(false);

    const [teacherValidation, setTeacherValidation] = useState();
    const [coordinationValidation, setCoordinationValidation] = useState();
    
    const classroomID = searchParams.get('id_classroom');
    const [classroom, setClassroom] = useState();

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const currentDate = dayjs(new Date()).format('YYYY-MM-DD');
    const minDate = dayjs(currentDate).subtract(4, 'day').format('YYYY-MM-DD');

    const [selectedDate, setSelectedDate] = useState(currentDate);


    useEffect(() => {
        const fetchClassroom = async () => {
            try {
                const data = await classroomService.getById(classroomID, token);

                setClassroom(data);
            } catch (error) {
            }
        };

        fetchClassroom();
    }, [token]);

    useEffect(() => {

        const fetchAbscentStudentList = async () => {
            try {
                const data = await absenceRecordService.getByClassroomAndDate(classroomID, token, selectedDate);
                
                if (data.length === 0) {
                    toast.warning('Aún no se ha registrado la asistencia de este día', {
                        duration: 2000,
                        icon: <ExclamationTriangleIcon style={{color: "#fb8500"}}/>,
                        
                    });

                    setAbsenceRecord(null);
                    setAbscentStudentList([]);
                    setTeacherValidation(false);
                    setCoordinationValidation(false);
                    setNoContent(true);
                    return;
                }

                let absentStudents = data.absentStudents.map(student => ({
                    ...student,
                    absent: student.code ? "Si" : "No",
                }));

                setAbsenceRecord(data);
                setAbscentStudentList(absentStudents);

                setTeacherValidation(data.teacherValidation);
                setCoordinationValidation(data.coordinationValidation);
                setNoContent(false);

            } catch (error) {
            }
        };

        fetchAbscentStudentList();

        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, [selectedDate]);

    const handleRole = () => {
        if ( user?.role.name === "Profesor" || user?.role.name === "Coordinador" ){
            return true;
        }else {
            return false;
        }
    };



    const handleDateChange = (e) => {
        const newDate = dayjs(e.target.value).format('YYYY-MM-DD');
        if (newDate <= currentDate) {
            setSelectedDate(newDate);
        } 
    };

    const handlePreviousDay = () => {
        const previousDay = dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD');
        setSelectedDate(previousDay);
    };

    const handleNextDay = () => {
        const nextDay = dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD');
        if (nextDay <= currentDate) {
            setSelectedDate(nextDay);
        }
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleOpenDialog2 = () => {
        setOpen2(true);
    };


    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleCloseDialog2 = () => {
        setOpen2(false);
    };

    const handleValidation = async () => {
        const loadingToast = toast('Cargando...', {
            icon: <AiOutlineLoading className="animate-spin" />,
        });

        if ( user.role.name === "Profesor"){

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
                            <div className="w-auto h-auto text-sm justify-center my-auto font-masferrerTitle font-normal
                                    PC-1280*720:text-xs PC-800*600:text-xs PC-640*480:text-xs
                                    Mobile-390*844:text-xs Mobile-280:text-xs IpadAir:text-xs
                                    bg-blue-gray-200 border border-gray-300 rounded-lg px-6 py-2 hover:shadow-2xl hover:pointer-events-auto">
                                <button
                                    onClick={handleOpenDialog2}
                                    disabled={noContent}>
                                        Detalle Estudiantes
                                </button>
                            </div>
                            <div className={classes["yearSelect"]}>
                                <p>{classroom.grade.name}</p>
                            </div>
                            {/* Contenedor para las flechas y el input de fecha */}
                            <div className={classes["dateNavigationContainer"]}>
                                <button
                                    className={classes["dateButton"]}
                                    onClick={handlePreviousDay}
                                >
                                    ←
                                </button>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className={classes["dateInput"]}
                                    max={currentDate}/>
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
                                        className={classes["yearSelect"]}
                                        disabled={noContent ||
                                            (teacherValidation == true && coordinationValidation == true) ||
                                            (user?.role.name === "Profesor" && teacherValidation == true && coordinationValidation == false) ||
                                            (user?.role.name === "Coordinador" && teacherValidation == false && coordinationValidation == true)
                                        }>
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
                                    localDate={dayjs(selectedDate).format('DD/MM/YY')}
                                    tableDate={selectedDate}
                                    noContent={noContent}
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

                        <Dialog open={open2} handler={handleOpenDialog2}>
                                <DialogHeader> Detalle Estudiantes </DialogHeader>
                                <DialogBody> 
                                    <p>
                                        # de Niños presentes: &nbsp; <span className="font-bold">{absenceRecord?.maleAttendance}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # de Niñas presentes: &nbsp; <span className="font-bold">{absenceRecord?.femaleAttendance}</span> <br/>
                                        Total de estudiantes presentes: &nbsp; <span className="font-bold">{Number(absenceRecord ? absenceRecord?.maleAttendance : 0) + Number(absenceRecord ? absenceRecord?.femaleAttendance : 0)} </span>
                                    </p> 
                                    </DialogBody>
                                <DialogFooter>
                                    <Button color="red" className="m-4" onClick={handleCloseDialog2}> Cerrar </Button>
                                </DialogFooter>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceVerificationViewPage;