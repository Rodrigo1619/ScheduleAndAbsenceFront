import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import classes from "./HomePage.module.css";

import { Grid } from 'react-loader-spinner';

import usersIcon from "../../assets/icons/users-icon.svg";
import searchIcon from "../../assets/icons/search-icon.svg";
import clipboardListIcon from "../../assets/icons/clipboard-list-icon.svg";

import Header from "../../Components/Header/Header";
import QuickAccessButtons from "../../Components/QuickAccessButtons/QuickAccessButtons";
import StudentAbsencesCard from "../../Components/StudentAbsencesCard/StudentAbsencesCard";
import Calendar from "../../Components/Calendar/Calendar";
import TeacherScheduleTable from "../../Components/TeacherScheduleTable/TeacherScheduleTable";
import AbsenceRecordReminderCard from "../../Components/AbsenceRecordReminderCard/AbsenceRecordReminderCard";

import { shiftService } from "../../Services/shiftService";
import { useUserContext } from "../../Context/userContext";
import { absenceRecordService } from "../../Services/absenceRecordService";
import { classroomService } from "../../Services/classroomService";


const HomePage = () => {

    const [shifts, setShifts] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [top2AbsencesStudents, setTop2AbsencesStudents] = useState([]);
    const [name1, setName1] = useState("");
    const [name2, setName2] = useState("");
    const [absences1, setAbsences1] = useState(0);
    const [absences2, setAbsences2] = useState(0);
    const [studentClassroom1, setStudentClassroom1] = useState();
    const [studentClassroom2, setStudentClassroom2] = useState();
    const [classroom, setClassroom] = useState([]);
    const [classroomName, setClassroomName] = useState("");
    const [gradeSection, setGradeSection] = useState("");
    const [shift, setShift] = useState([]);
    const [absenceRecord, setAbsenceRecord] = useState([]);
    const [todayAbsences, setTodayAbsences] = useState([]);
    const { token, user } = useUserContext();
    let date = new Date();
    const [loading, setLoading] = useState(true);

    const getShift = (shift) => {
        setShift(shift);   
    }

    const fetchTop2Absences = async () => {
        const response = await absenceRecordService.getTop2ByTokenAndShiftAndYear(token, shift.id, year);
        setTop2AbsencesStudents(response);
    }

    const fetchShift = async () => {
        const response = await shiftService.getAllShifts(token);
        setShifts(response);
    }
    
    const fetchClassroom = async () => {
        const response = await classroomService.getByUserAndYear(token, date.getFullYear());
        setClassroom(response);
    }

    const fetchAbsenceRecord = async () => {
        let foundClassroom;
        if(shift.name === "Matutino") {
            foundClassroom = classroom.find((classroom) => {
                if(classroom.grade.shift.name === "Matutino") {
                    return classroom;
                }
            })
            const response = await absenceRecordService.getByClassroomAndShift(foundClassroom.id, token, shift.id);
            setAbsenceRecord(response);

        } else if(shift.name === "Vespertino") {
            foundClassroom = classroom.find((classroom) => {
                if(classroom.grade.shift.name === "Vespertino") {
                    return classroom;
                }
            })

            const response = await absenceRecordService.getByClassroomAndShift(foundClassroom.id, token, shift.id);
            setAbsenceRecord(response);
        }
    };

    useEffect(() => {
        fetchShift();
        fetchClassroom();
    }, [token]);

    useEffect(() => {
        if (shift) {
            fetchTop2Absences();
            fetchAbsenceRecord();
        }
    }, [shift]);

    useEffect(() => {
        if (top2AbsencesStudents.length > 0) {
            if(shift.name === "Matutino") {
        
                classroom.forEach((classroom) => {
                    if(classroom.grade.shift.name === "Matutino") {
                        setName1(top2AbsencesStudents[0].student.name);
                        setAbsences1(top2AbsencesStudents[0].unjustifiedAbsences);
                        setStudentClassroom1(top2AbsencesStudents[0].classroom);
                        setName2(top2AbsencesStudents[1]?.student.name);
                        setAbsences2(top2AbsencesStudents[1]?.unjustifiedAbsences);
                        setStudentClassroom2(top2AbsencesStudents[1]?.classroom);
                    }
                });

            } else if(shift.name === "Vespertino") {
                
                classroom.forEach((classroom) => {
                    if(classroom.grade.shift.name === "Vespertino") {
                        setName1(top2AbsencesStudents[0].student.name);
                        setAbsences1(top2AbsencesStudents[0].unjustifiedAbsences);
                        setStudentClassroom1(top2AbsencesStudents[0].classroom);
                        setName2(top2AbsencesStudents[1]?.student.name);
                        setAbsences2(top2AbsencesStudents[1]?.unjustifiedAbsences);
                        setStudentClassroom2(top2AbsencesStudents[1]?.classroom);
                    }
                });

            }
        } 

    }
, [top2AbsencesStudents]);

    useEffect(() => {
        if(classroom?.length > 0 && shift ) {
            const selectedClassroom = classroom.find(classroom => classroom.grade.shift.id === shift.id);

            setName1("No hay estudiantes con inasistencias");
            setName2("No hay estudiantes con inasistencias");
            setAbsences1(0);
            setAbsences2(0);
            setStudentClassroom1(null);
            setStudentClassroom2(null);

            setClassroomName(selectedClassroom ? selectedClassroom.grade.name.slice(0, -1) : "");
            setGradeSection(selectedClassroom ? selectedClassroom.grade.section : "");
        }
    }, [classroom, shift]);


    useEffect(() => {
        setTodayAbsences(absenceRecord.filter(absence => absence.date === dayjs(date).format("YYYY-MM-DD")));

    }, [absenceRecord, gradeSection, classroomName]);

    useEffect(() => {
        
        setTimeout(() => {
            setLoading(false);
        }, 2500);

    }, [studentClassroom1, studentClassroom2, name1, name2, absences1, absences2]);

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
    }, []);
    

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
                    <div className={[classes["pageContentContainer"]]}>
                        <div className={[classes["SubtitleContainer"]]}>
                            <QuickAccessButtons title="Acciones Generales:"
                                iconsvg1={clipboardListIcon} description1="Reportar inasistencias" link1="/AttendanceRegisterView"
                                iconsvg2={searchIcon} description2="Búsqueda de maestro" link2="/SearchTeacher"
                                iconsvg3={usersIcon} description3="Revisar listado de asistencias" link3="/AttendanceGeneralView"/>
                        </div>

                        <div className={[classes["dashboardContainer"]]}>
                        
                        <StudentAbsencesCard 
                        name1={name1 || "No hay estudiantes con inasistencias"} 
                        classroom1={studentClassroom1?.grade.name}
                        absences1={absences1 + " inasistencias"} 
                        name2={name2 || "No hay estudiantes con inasistencias"}
                        classroom2={studentClassroom2?.grade.name}
                        absences2={absences2 + " inasistencias"}
                        />

                        <AbsenceRecordReminderCard
                            classroomName={classroomName} 
                            classroomSection={gradeSection}
                            todayAbsence={todayAbsences}/>
                            <Calendar />
                    </div>
                    
                    </div>
                   
                </div>
                <div className={[classes["scheduleContainer"]]}>
                        <TeacherScheduleTable shiftList={shifts} year={year} updateShift={getShift}/>
                </div>
            </div>
        </div>

    );
}



export default HomePage;
