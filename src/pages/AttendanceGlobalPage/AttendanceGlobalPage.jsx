import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import classes from "./AttendanceGlobalPage.module.css";
import Header from "../../Components/Header/Header";
import TableAttendanceComponent from '../../Components/TableGlobalAttendance/TableGlobalAttendanceComponent';
import { useUserContext } from '../../Context/userContext';
import { classroomService } from '../../Services/classroomService';
import { absenceRecordService } from '../../Services/absenceRecordService'; 

import { Grid } from "react-loader-spinner";

const tableHeaders = ["", "NIE", "Nombre", "Inasistencia Total", "No justificada", "Justificada"];
const tableKeys = ["student.nie", "student.name", "totalAbsences", "unjustifiedAbsences", "justifiedAbsences"];

const AttendanceGlobalPage = () => {
    const [searchParams] = useSearchParams();
    const classroomId = searchParams.get('id_classroom');
    const shiftId = searchParams.get('id_shift');
    const yearId = searchParams.get('year');
    const [noContent, setNoContent] = useState(false);
    
    const currentYear = new Date().getFullYear();
    const [shiftName, setShiftName] = useState("");
    const [classroomGrade, setClassroomGrade] = useState("");
    const [tableData, setTableData] = useState([]); 
    const [loading, setLoading] = useState(true);
    const { token, user } = useUserContext();

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const classroom = await classroomService.getOneById(token, classroomId);

                setClassroomGrade(classroom.grade.name);
                setShiftName(classroom.grade.shift.name);
            } catch (error) {
            }
        };

        const fetchAbsentStudents = async () => {
            try {
                const students = await absenceRecordService.getAllAbsentStudentsByYear(classroomId, token, yearId);

                if (students.length === 0) {
                    setTableData([]);
                    setNoContent(true);
                    return;
                }
                setTableData(students);
                setNoContent(false);
            } catch (error) {
            }
        };

        fetchClassrooms();
        fetchAbsentStudents();

        setTimeout(() => {
            setLoading(false);
        }, 1500);

    }, [yearId, shiftId, classroomId, token]);

    const years = [];
    for (let year = currentYear; year >= 2020; year--) {
        years.push(year);
    }

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
                <div className={[classes["allContentContainer"]]}>
                    <div className={[classes["pageContentContainerCol"]]}>
                        <div className={[classes["TitleContainer"]]}>
                            <div className={classes["yearSelect"]}>
                                Año: {yearId}
                            </div>
                            <div className={classes["yearSelect"]}>
                                Turno: {shiftName}
                            </div>
                            <div className={classes["gradeDisplay"]}>
                                Grado: {classroomGrade}
                            </div>
                        </div>
                        <div className={[classes["pageContentContainerRow"]]}>
                            <div className={[classes["SubtitleContainer"]]}>
                                <TableAttendanceComponent
                                    title="Listado total de Inasistencias"
                                    tableHeaders={tableHeaders}
                                    tableData={tableData}
                                    tableKeys={tableKeys}
                                    isDownload={true}
                                    noContent={noContent}
                                    classroomInfo={{ classroomGrade, shiftName, yearId }}
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