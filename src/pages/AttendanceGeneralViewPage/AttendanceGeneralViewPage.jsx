import React, { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";

import classes from "./AttendanceGeneralPage.module.css";
import Header from "../../Components/Header/Header";
import TableAttendanceComponent from '../../Components/TableGeneralAttendance/TableGeneralAttendanceComponent';

import { userService } from '../../Services/userService';
import { shiftService } from '../../Services/shiftService';
import { classroomService } from '../../Services/classroomService';
import { useUserContext } from '../../Context/userContext';

import { Grid } from 'react-loader-spinner';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { AiOutlineLoading } from "react-icons/ai";
import { Toaster, toast } from 'sonner';

const tableHeaders = ["", "Salón", "Turno", "Inasistencia Diaria", "Inasistencia Global"];
const tableKeys = ["grade.name", "grade.shift.name"];

const AttendanceGeneralViewPage = () => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedShift, setSelectedShift] = useState();
    const [shiftsList, setShiftsList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const { token, user } = useUserContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        setTimeout(() => {
            setLoading(false);
        }, 2500);
    }, [token]);

    useEffect(() => {
        setSelectedShift(shiftsList[0]?.id);
    }, [shiftsList, user]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            if (token && selectedYear && selectedShift) {
                const loadingToast = toast('Cargando...', {
                    icon: <AiOutlineLoading className="animate-spin" />,
                });
                try {

                    if (user && user.role && user.role.name === 'Profesor') {
                        const response = await classroomService.getClassroomsByUserYearAndShift(token, selectedYear, selectedShift);

                        setTableData(response);

                    } 
                    
                    if(user && user.role && user.role.name !== 'Profesor') {
                        const response = await classroomService.getClassroomsByShiftAndYear(token, selectedShift, selectedYear);

                        setTableData(response);

                    }

                } catch (error) {
                    if(error.message === "No classrooms assigned to the user"){
                        toast.error("No hay salones asignados al usuario", {
                            duration: 3000,
                            icon: <XCircleIcon style={{color: "red"}} />,
                        });
                    }
                    setTableData([]);
                } finally {
                    toast.dismiss(loadingToast);
                }
            } else {
                // Reiniciar datos de la tabla si no se ha seleccionado un turno y año válidos
                setTableData([]);
            }
        };

        fetchClassrooms();
    }, [token, selectedYear, selectedShift, user]);

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value, 10));
    };

    const handleShiftChange = (e) => {
        setSelectedShift(e.target.value);
    };

    // Genera un array de años desde el actual hasta el 2000
    const years = Array.from({ length: currentYear - 2022 + 1 }, (_, i) => currentYear - i);
    const handleDailyAttendance = (row) => {
        const shiftId = selectedShift;
        const classroomId = row?.id ?? null;
        if (classroomId) {
            const encodedClassroomId = encodeURIComponent(classroomId);
            const encodedShiftId = encodeURIComponent(shiftId);
            window.location.href = `/AttendanceVerificationView?id_classroom=${encodedClassroomId}&id_shift=${encodedShiftId}`;
        }
    };

    const handleGlobalAttendance = (row) => {
        const shiftId = selectedShift;
        const classroomId = row?.id ?? null;
        const year = selectedYear;
    
        if (classroomId) {
            const encodedClassroomId = encodeURIComponent(classroomId);
            const encodedShiftId = encodeURIComponent(shiftId);
            const encodedYear = encodeURIComponent(year);
            window.location.href = `/AttendanceGlobalView?id_classroom=${encodedClassroomId}&id_shift=${encodedShiftId}&year=${encodedYear}`;
        }
    };

    const handleStatus = (row) => {

    };

    return (
        loading ?
        <div className={[classes["loaderContainer"]]}>
            <Grid type="Grid" color="#170973" height={80} width={80} visible={loading} />
        </div>

        :

        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <Toaster />
                <div className={[classes["allContentContainer"]]}>
                    <div className={[classes["pageContentContainerCol"]]}>
                        <div className={[classes["TitleContainer"]]}>
                            <select
                                value={selectedYear}
                                onChange={handleYearChange}
                                className={classes["yearSelect"]}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
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
                        </div>
                        <div className={[classes["pageContentContainerRow"]]}>
                            <div className={[classes["SubtitleContainer"]]}>
                                {selectedShift === "Seleccionar turno" ? (
                                    <Typography variant="h6" color="gray">
                                        Por favor, seleccione un año y un turno validos para mostrar los datos de asistencia.
                                    </Typography>
                                ) : (
                                    <TableAttendanceComponent
                                        title="Inasistencias generales"
                                        tableHeaders={tableHeaders}
                                        tableData={tableData}
                                        tableKeys={tableKeys}
                                        handleUpdate={handleDailyAttendance}
                                        handleDelete={handleGlobalAttendance}
                                        handleStatus={handleStatus}
                                        isDownload={false}
                                        noContent={tableData.length === 0 ? true : false}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceGeneralViewPage;
