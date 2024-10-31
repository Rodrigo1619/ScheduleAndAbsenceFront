import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography
} from "@material-tailwind/react";
import classes from "./AttendanceGlobalPage.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import TableAttendanceComponent from '../../Components/TableGlobalAttendance/TableGlobalAttendanceComponent';
import { shiftService } from '../../Services/shiftService';
import { useUserContext } from '../../Context/userContext';
import { classroomService } from '../../Services/classroomService';
import { absenceRecordService } from '../../Services/absenceRecordService'; // Importar el servicio de absenceRecordService

const tableHeaders = ["", "NIE", "Nombre", "Inasistencia Total", "No justificada", "Justificada"];
const tableKeys = ["student.nie", "student.name", "totalAbsences", "unjustifiedAbsences", "justifiedAbsences"];

const AttendanceGlobalPage = () => {
    const [searchParams] = useSearchParams();
    const classroomId = searchParams.get('id_classroom');
    const shiftId = searchParams.get('id_shift');
    const yearId = searchParams.get('year');
    
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(yearId || currentYear);
    const [selectedShift, setSelectedShift] = useState(shiftId || "Matutino");
    const [shiftName, setShiftName] = useState("");
    const [classroomGrade, setClassroomGrade] = useState("");
    const [tableData, setTableData] = useState([]); // Estado para almacenar los datos de los estudiantes ausentes
    const { token, user } = useUserContext();

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const classrooms = await classroomService.getClassroomsByShiftAndYear(token, selectedShift, selectedYear);
                if (classrooms && classrooms.length > 0) {
                    const classroom = classrooms.find(c => c.id === classroomId);
                    if (classroom) {
                        setClassroomGrade(classroom.grade.name);
                        setShiftName(classroom.shift.name);
                    }
                }
            } catch (error) {
                console.error("Error fetching classrooms:", error);
            }
        };

        const fetchAbsentStudents = async () => {
            try {
                const students = await absenceRecordService.getAllAbsentStudentsByYear(classroomId, token, selectedYear);
                setTableData(students || []);
            } catch (error) {
                console.error("Error fetching absent students:", error);
            }
        };

        fetchClassrooms();
        fetchAbsentStudents();
    }, [selectedYear, selectedShift, classroomId, token]);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
    };

    const handleShiftChange = (e) => {
        setSelectedShift(e.target.value);
    };

    // Genera un array de años desde el actual hasta el 2000
    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
        years.push(year);
    }

    return (
        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <div className={[classes["allContentContainer"]]}>
                    <div className={[classes["pageContentContainerCol"]]}>
                        <div className={[classes["TitleContainer"]]}>
                            <div className={classes["yearSelect"]}>
                                Año: {selectedYear}
                            </div>
                            <div className={classes["yearSelect"]}>
                                Turno: {shiftName || selectedShift}
                            </div>
                            <div className={classes["gradeDisplay"]}>
                                Grado: {classroomGrade || ""}
                            </div>
                        </div>
                        <div className={[classes["pageContentContainerRow"]]}>
                            <div className={[classes["SubtitleContainer"]]}>
                                <TableAttendanceComponent
                                    title="LISTADO TOTAL DE INASISTENCIA"
                                    tableHeaders={tableHeaders}
                                    tableData={tableData}
                                    tableKeys={tableKeys}
                                    isDownload={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceGlobalPage;