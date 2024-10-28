import React, { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography
} from "@material-tailwind/react";
import classes from "./AttendanceGeneralPage.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import TableAttendanceComponent from '../../Components/TableGeneralAttendance/TableGeneralAttendanceComponent';
import { shiftService } from '../../Services/shiftService';
import { classroomService } from '../../Services/classroomService';
import { useUserContext } from '../../Context/userContext';

const tableHeaders = ["", "ID", "Salón", "Turno", "Inasistencia Diaria", "Inasistencia Global"];
const tableKeys = ["id", "grade.name", "shift.name"];

const AttendanceGeneralViewPage = () => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedShift, setSelectedShift] = useState("Seleccionar turno");
    const [shiftsList, setShiftsList] = useState([]);
    const [tableData, setTableData] = useState([]);
    const { token, user } = useUserContext();

    useEffect(() => {
        const fetchShifts = async () => {
            if (token) {
                try {
                    const shifts = await shiftService.getAllShifts(token);
                    setShiftsList(shifts || []);
                } catch (error) {
                    console.error("Error fetching shifts:", error);
                    setShiftsList([]);
                }
            }
        };

        fetchShifts();
    }, [token]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            if (token && selectedYear && selectedShift !== "Seleccionar turno") {
                try {
                    let classrooms;
                    if (user && user.role && user.role.name !== 'Profesor') {
                        classrooms = await classroomService.getClassrooms(token, selectedYear, selectedShift);
                    } else {
                        classrooms = await classroomService.getClassroomsByUserYearAndShift(token, selectedYear, selectedShift);
                    }
                    setTableData(classrooms || []);
                } catch (error) {
                    console.error("Error fetching classrooms:", error);
                    setTableData([]);
                }
            }
        };

        fetchClassrooms();
    }, [token, selectedYear, selectedShift]);

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value, 10));
    };

    const handleShiftChange = (e) => {
        setSelectedShift(e.target.value);
    };

    // Genera un array de años desde el actual hasta el 2000
    const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => currentYear - i);
    const handleDailyAttendance = (row) => {
        const shiftId = selectedShift;
        const classroomId = row?.id ?? null;
        if (classroomId) {
            // Codificar los parámetros de la URL
            const encodedClassroomId = encodeURIComponent(classroomId);
            const encodedShiftId = encodeURIComponent(shiftId);
            
            // Redirigir usando href con los parámetros codificados en formato ?id_classroom=&id_shift=
            window.location.href = `/AttendanceVerificationView?id_classroom=${encodedClassroomId}&id_shift=${encodedShiftId}`;
        } else {
            console.log("Salón no seleccionado");
        }
    };

    const handleGlobalAttendance = (row) => {
        const shiftId = selectedShift;
        const classroomId = row?.id ?? null;
        const year = selectedYear;
    
        if (classroomId) {
            // Codificar los parámetros de la URL
            const encodedClassroomId = encodeURIComponent(classroomId);
            const encodedShiftId = encodeURIComponent(shiftId);
            const encodedYear = encodeURIComponent(year);
    
            // Redirigir usando href con los parámetros codificados en formato ?id_classroom=&id_shift=&year=
            window.location.href = `/AttendanceGlobalView?id_classroom=${encodedClassroomId}&id_shift=${encodedShiftId}&year=${encodedYear}`;
        } else {
            console.log("Salón no seleccionado");
        }
    };

    const handleStatus = (row) => {
        console.log("Change status:", row);
    };

    return (
        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name="Luis Morales" role="Administrador" />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <div className={[classes["allContentContainer"]]}>
                    <SideBarNav />
                    <div className={[classes["pageContentContainerCol"]]}>
                        <div className={[classes["TitleContainer"]]}>
                            {/* Selector de año con estilos personalizados */}
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
                            {/* Selector de turno con estilos personalizados */}
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
                                <TableAttendanceComponent
                                    title="Inasistencias generales"
                                    tableHeaders={tableHeaders}
                                    tableData={tableData}
                                    tableKeys={tableKeys}
                                    handleUpdate={handleDailyAttendance}
                                    handleDelete={handleGlobalAttendance}
                                    handleStatus={handleStatus}
                                    isDownload={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceGeneralViewPage;