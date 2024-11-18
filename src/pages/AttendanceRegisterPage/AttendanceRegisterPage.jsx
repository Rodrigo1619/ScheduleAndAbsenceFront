import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter} from "@material-tailwind/react";
import dayjs from 'dayjs'

import { Toaster, toast } from 'sonner';
import { AiOutlineLoading } from "react-icons/ai";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Grid } from 'react-loader-spinner';

import classes from "./AttendanceRegisterPage.module.css";
import Header from "../../Components/Header/Header";
import TableAttendanceComponent from '../../Components/TableRegisterAttendance/TableRegisterAttendanceComponent';

import { useUserContext } from "../../Context/userContext";

import { classroomService } from "../../Services/classroomService";
import { absenceRecordService } from "../../Services/absenceRecordService";
import { shiftService } from "../../Services/shiftService";
import { userService } from "../../Services/userService";

const tableHeaders = [
    "Nombre", "Faltó"
];

const AttendanceRegisterViewPage = () => {

    const [loading, setLoading] = useState(true);

    const currentDate = dayjs(new Date()).format('YYYY-MM-DD');
    const minDate = dayjs(currentDate).subtract(2, 'day').format('YYYY-MM-DD');

    const [selectedDate, setSelectedDate] = useState(currentDate);

    const handleDateChange = (e) => {
        const newDate = dayjs(e.target.value).format('YYYY-MM-DD');
        if (newDate <= currentDate) {
            setSelectedDate(newDate);
        } 
    };

    const handlePreviousDay = () => {
        const previousDay = dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD');
        if (previousDay >= minDate) {
            setSelectedDate(previousDay);
        }
    };

    const handleNextDay = () => {
        const nextDay = dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD');
        if (nextDay <= currentDate) {
            setSelectedDate(nextDay);
        }
    };

    const { token } = useUserContext();
    const [user, setUser] = useState();

    const [classroom, setClassroom] = useState();
    const [selectedClassroom, setSelectedClassroom] = useState();
    const [classroomsList, setClassroomsList] = useState([]);
    const [selectedShift, setSelectedShift] = useState();
    const [shiftsList, setShiftsList] = useState([]);

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
        const fetchUser = async () => {
            try {
                const response = await userService.verifyToken(token);
                setUser(response);
            } catch (error) {
                setUser(null);
            }
        };

        fetchUser();
    },[token]);

    useEffect(() => {
        if(user?.role.name === "Profesor"){
            const fetchShifts = async () => {
                if (token) {
                    try {
                        const shifts = await shiftService.getAllShifts(token);
                        setShiftsList(shifts || []);
                    } catch (error) {
                        setShiftsList([]);
                    }
                }
            };
    
            fetchShifts();
        }
    }, [user]);

    useEffect(() => {
        setSelectedShift(shiftsList[0]?.id);
    }, [shiftsList, user]);

    useEffect(() => {
        const year = new Date().getFullYear();

        if(user?.role.name === "Asistencia"){
            const fetchStudentList = async () => {
                try {

                    const nie = user?.email.split('@')[0];

                    const data = await classroomService.getClassStudentsByNieAndYear(token, nie, year);

                    if(data.students.length === 0){
                        return;
                    }

                    const formatedData = data.students.map(student => {
                        return {
                            ...student,
                            absent: "No",
                        }
                    });
        
                    setStudentList(formatedData);
                    setClassroom(data.classroom);
                } catch (error) {
                }
            };

            fetchStudentList();
        };

        if (user?.role.name === "Profesor"){
            if(selectedShift){
                const fetchClassrooms = async () => {
                    try {
                        const data = await classroomService.getClassroomsByUserYearAndShift(token, year, selectedShift);
    
                        setClassroomsList(data);
                        setClassroom(data[0]);
                        setSelectedClassroom(data[0].id);
                    } catch (error) {
                        if(error.message === "No classrooms assigned to the user"){
                            toast.error("No tiene salon asignado en este horario", {
                                duration: 3000,
                                icon: <XCircleIcon style={{color: "red"}} />,
                            });
                        }
                        setClassroom(null);
                        setClassroomsList([]);
                        setStudentList([]);
                    }
                };

                fetchClassrooms();
            }

        };

        setTimeout(() => {
            setLoading(false);
        }, 1500);

    }, [token, user, selectedShift, shiftsList]);

    useEffect(() => {
        if(user?.role.name === "Profesor" && classroom){
            const fetchStudentList = async () => {
                try {
                    const data = await classroomService.getClassStudentsByClassroomID(token, classroom.id);
    
                    if(data.length === 0){
                        setStudentList([]);
                        return;
                    }
            
                    const formatedData = data.map(student => {
                        return {
                            ...student,
                            absent: "No",
                        }
                    });
        
                    setStudentList(formatedData);
    
                } catch (error) {
                }
            };
    
            fetchStudentList();

            setTimeout(() => {
                setLoading(false);
            }, 1500);
        }
    }, [classroom]);

    const handleShiftChange = (e) => {
        setSelectedShift(e.target.value);
    };

    const handleClassroomChange = (e) => {
        const selectedClassroom = classroomsList.find(classroom => classroom.id === e.target.value);

        if(selectedClassroom){
            setClassroom(selectedClassroom);
            setSelectedClassroom(e.target.value);
        }
    }

    const handleBoyCountChange = (e) => {
        setBoysCount(e.target.value);
    };

    const handleGirlCountChange = (e) => {
        setGirlsCount(e.target.value);
    };

    const handleRegisterAbsenceRecord = async () => {

        const absenceRecordJSON = {
            date: selectedDate,
            maleAttendance: boysCount,
            femaleAttendance: girlsCount,
            absentStudents: absentStudents.map(student => ({id_student: student.id}))
        };

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

                setBoysCount(0);
                setGirlsCount(0);
            }

        } catch (error) {
            if (error.message === "Absence record already exists") {
                toast.error('Error, asistencia ya registrada', {
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });

                return;
            }

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
                            {
                                user?.role.name === "Profesor" ? (
                                    <select
                                        value={selectedShift}
                                        onChange={handleShiftChange}
                                        className={classes["yearSelect"]}
                                    >
                                        {shiftsList.map((shift) => (
                                            <option key={shift.id} value={shift.id}>
                                                {shift.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <>
                                    </>
                                )
                            }
                            {
                                classroomsList.length > 1 ? (
                                    <select
                                        value={selectedClassroom}
                                        onChange={handleClassroomChange}
                                        className={classes["yearSelect"]}>
                                        {classroomsList.map((classroom) => (
                                            <option key={classroom.id} value={classroom.id}>
                                                {classroom.grade.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className={classes["yearSelect"]}>
                                        <p>{classroom ? classroom.grade.name : "Salon de clase"}</p>
                                    </div>
                                )
                            }
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
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className={classes["dateInput"]}
                                    max={currentDate}
                                    min={minDate}/>
                                <button
                                    className={classes["dateButton"]}
                                    onClick={handleNextDay}
                                    disabled={selectedDate >= currentDate}
                                >
                                    →
                                </button>
                            </div>
                            <Button className={classes["yearSelect"]} onClick={handleOpenDialog}>
                                Enviar
                            </Button>
                        </div>
                        <div className={classes["pageContentContainerRow"]}>
                        <Dialog open={openResume} handler={handleOpenDialog} className="overflow-y-scroll h-5/6">
                            <DialogHeader> Confirmar Inasistencia </DialogHeader>
                            <DialogBody> 
                                
                                <p className={classes["dialogInfo"]}>
                                    Fecha: &nbsp; <span className="font-bold">{selectedDate}</span> <br/>
                                    Grado: &nbsp; <span className="font-bold">{classroom?.grade?.name}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Turno: &nbsp; <span className="font-bold">{classroom?.grade?.shift?.name}</span> <br/>
                                    Orientador: &nbsp; <span className="font-bold">{classroom?.homeroomTeacher?.name}</span> <br/> <br/>
                                    # de Niños presentes: &nbsp; <span className="font-bold">{boysCount}</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; # de Niñas presentes: &nbsp; <span className="font-bold">{girlsCount}</span> <br/>
                                    Total de estudiantes presentes: &nbsp; <span className="font-bold">{Number(boysCount) + Number(girlsCount)}</span>
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
                            <div className="flex flex-row justify-center items-center sticky top-0 z-auto ml-7 pt-14 Mobile-390*844:mx-auto Mobile-390*844:py-2 Mobile-280:py  -2">
                                <form onSubmit={() => (a)} className={[classes["form"]]}>
                                    <div className={[classes["input-container"]]}>            
                                        <label className={[classes["label"]]}>
                                            # de Niños presentes:
                                        </label>
                                        <input type="number" value={boysCount} onChange={handleBoyCountChange} className={[classes["input"]]} />
                                    </div>
                                    <div className={[classes["input-container"]]}>            
                                        <label className={[classes["label"]]}>
                                            # de Niñas presentes:
                                        </label>
                                        <input type="number" value={girlsCount} onChange={handleGirlCountChange} className={[classes["input"]]} />
                                    </div>
                                    <div className="flex flex-col justify-center">            
                                        <label className="text-black text-wrap text-center">
                                            {`Total de estudiantes presentes: ${Number(boysCount) + Number(girlsCount)}`}
                                        </label>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceRegisterViewPage;
