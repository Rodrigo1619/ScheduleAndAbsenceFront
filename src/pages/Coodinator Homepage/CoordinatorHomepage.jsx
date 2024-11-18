import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import classes from "./CoordinatorHomepage.module.css";

import usersIcon from "../../assets/icons/users-icon.svg";
import searchIcon from "../../assets/icons/search-icon.svg";
import teacherChalkboardIcon from "../../assets/icons/teacherchalkb.svg"
import classroomIcon from "../../assets/icons/classroom-icon.svg";

import Header from "../../Components/Header/Header";
import QuickAccessButtons from "../../Components/QuickAccessButtons/QuickAccessButtons";
import StudentAbsencesCard from "../../Components/StudentAbsencesCard/StudentAbsencesCard";
import AbsenceRecordReminderCard from "../../Components/AbsenceRecordReminderCard/AbsenceRecordReminderCard";
import Calendar from "../../Components/Calendar/Calendar";

import { absenceRecordService } from "../../Services/absenceRecordService";
import { useUserContext } from "../../Context/userContext";


const CoordinatorHomepage = () => {

    const { user, token } = useUserContext();

    const currentDate = dayjs(new Date()).format("YYYY-MM-DD");
    const [remainingAbsenceRecords, setRemainingAbsenceRecords] = useState(0);

    const [name1, setName1] = useState("");
    const [name2, setName2] = useState("");
    const [absences1, setAbsences1] = useState(0);
    const [absences2, setAbsences2] = useState(0);
    const [classroomName1, setClassroomName1] = useState("");
    const [classroomName2, setClassroomName2] = useState("");
    const [gradeShift1, setGradeShift1] = useState("");
    const [gradeShift2, setGradeShift2] = useState("");

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
    }, []);

    useEffect(() => {
        const fetchRemainingAbsenceRecords = async () => {
            try {
                const response = await absenceRecordService.getRecordsWithoutCoodinationValidation(token, currentDate);
                setRemainingAbsenceRecords(response);
            } catch (error) {
                setRemainingAbsenceRecords(0);
            }
        };

        const fetchTop2Absences = async () => {
            const response = await absenceRecordService.getTopAbsentStudentByMonthBothShifts(token, currentDate);

            if (response.morningShiftTopStudent) {
                setName1(response.morningShiftTopStudent.student.name);
                setAbsences1(response.morningShiftTopStudent.totalAbsences);
                setClassroomName1(response.morningShiftTopStudent.classroom.grade.name);
                setGradeShift1(response.morningShiftTopStudent.classroom.grade.shift.name);
            }

            if (response.afternoonShiftTopStudent) {
                setName2(response.afternoonShiftTopStudent.student.name);
                setAbsences2(response.afternoonShiftTopStudent.totalAbsences);
                setClassroomName2(response.afternoonShiftTopStudent.classroom.grade.name);
                setGradeShift2(response.afternoonShiftTopStudent.classroom.grade.shift.name);
            }

        };

        fetchRemainingAbsenceRecords();
        fetchTop2Absences();
    }, [user, token]);

    return (
        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <div className={[classes["allContentContainer"]]}>
                    <div className={[classes["pageContentContainer"]]}>

                        <div className={[classes["SubtitleContainer"]]}>
                            <QuickAccessButtons title="Acciones Generales:"
                                iconsvg2={usersIcon} description2="Revisar asistencia general" link2="/AttendanceGeneralView"
                                iconsvg3={searchIcon} description3="Búsqueda de maestro" link3="/SearchTeacher"
                                />

                        </div>

                        <div className={[classes["SubtitleContainer"]]}>
                            <QuickAccessButtons title="Acciones de Consulta:"
                                    iconsvg2={classroomIcon} description2="Ver horario de un aula" link2="/ClassroomSchedule"
                                    iconsvg3={teacherChalkboardIcon} description3="Ver horario de un profesor" link3="/TeacherSchedule"
                                    />

                        </div>

                        <div className={[classes["dashboardContainer"]]}>
                            
                            <StudentAbsencesCard 
                            name1={name1 || "No hay estudiantes con inasistencias"} 
                            classroom1={`${classroomName1} - ${gradeShift1}` || "No hay estudiantes con inasistencias"}
                            absences1={absences1 + " inasistencias"} 
                            name2={name2 || "No hay estudiantes con inasistencias"}
                            classroom2={`${classroomName2} - ${gradeShift2}` || "No hay estudiantes con inasistencias"}
                            absences2={absences2 + " inasistencias"}
                            fromCoordination={true}
                            />

                            <AbsenceRecordReminderCard
                                fromCoordination={true}
                                totalAbsenceList={remainingAbsenceRecords}
                                />
                                <Calendar />
                        </div>
                    </div>
                   
                </div>
                
            </div>
        </div>

    );
}



export default CoordinatorHomepage;
