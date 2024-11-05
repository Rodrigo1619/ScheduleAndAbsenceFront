import React, { useState, useEffect } from "react";
import {
    Navbar,
    Button,
    Typography,
} from "@material-tailwind/react";
import classes from "./HomePage.module.css";
import { FcPhone, FcClock, FcHome } from "react-icons/fc";
import usersIcon from "../../assets/icons/users-icon.svg";
import searchIcon from "../../assets/icons/search-icon.svg";
import clipboardListIcon from "../../assets/icons/clipboard-list-icon.svg";
import Header from "../../Components/Header/Header";
import QuickAccessButtons from "../../Components/QuickAccessButtons/QuickAccessButtons";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import StudentAbsencesCard from "../../Components/StudentAbsencesCard/StudentAbsencesCard";
import NextSubjectCard from "../../Components/NextClassCard/NextSubjectCard";
import Calendar from "../../Components/Calendar/Calendar";
import { shiftService } from "../../Services/shiftService";
import TeacherScheduleTable from "../../Components/TeacherScheduleTable/TeacherScheduleTable";
import { useUserContext } from "../../Context/userContext";
import { absenceRecordService } from "../../Services/absenceRecordService";
import { classroomService } from "../../Services/classroomService";
import AbsenceRecordReminderCard from "../../Components/AbsenceRecordReminderCard/AbsenceRecordReminderCard";



const HomePage = () => {

    const [shifts, setShifts] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [top2AbsencesStudents, setTop2AbsencesStudents] = useState([]);
    const [name1, setName1] = useState("");
    const [name2, setName2] = useState("");
    const [absences1, setAbsences1] = useState(0);
    const [absences2, setAbsences2] = useState(0);
    const [classroom, setClassroom] = useState([]);
    const [classroomName, setClassroomName] = useState("");
    const [gradeSection, setGradeSection] = useState("");
    const [shift, setShift] = useState([]);
    const [absenceRecord, setAbsenceRecord] = useState([]);
    const [todayAbsences, setTodayAbsences] = useState([]);
    const { token, user } = useUserContext();
    let date = new Date();

    // Callback function to get the shift selected on the ScheduleTable
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
        if(shift.name === "Matutino") {
            if(classroom[0].grade.shift.name === "Matutino") {
                const response = await absenceRecordService.getByClassroomAndShift(classroom[0].id, token, shift.id);
                setAbsenceRecord(response);
            }else if(classroom[1]?.grade.shift.name === "Matutino") {
                const response = await absenceRecordService.getByClassroomAndShift(classroom[1]?.id, token, shift.id);
                setAbsenceRecord(response);
            }
        } else if(shift.name === "Vespertino") {
            if(classroom[0].grade.shift.name === "Vespertino") {
                const response = await absenceRecordService.getByClassroomAndShift(classroom[0].id, token, shift.id);
                setAbsenceRecord(response);
            }else if(classroom[1]?.grade.shift.name === "Vespertino") {
                const response = await absenceRecordService.getByClassroomAndShift(classroom[1]?.id, token, shift.id);
                setAbsenceRecord(response);
            }
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
                if(classroom[0].grade.shift.name === "Matutino") {
                    setName1(top2AbsencesStudents[0].student.name);
                    setAbsences1(top2AbsencesStudents[0].unjustifiedAbsences);
                    setName2(top2AbsencesStudents[1]?.student.name);
                    setAbsences2(top2AbsencesStudents[1]?.unjustifiedAbsences);
                    setClassroomName(classroom[0].grade.name.slice(0, -1));
                    setGradeSection(classroom[0].grade.section);
                }else if(classroom[1]?.grade.shift.name === "Matutino") {
                    setName1(top2AbsencesStudents[0].student.name);
                    setAbsences1(top2AbsencesStudents[0].unjustifiedAbsences);
                    setName2(top2AbsencesStudents[1]?.student.name);
                    setAbsences2(top2AbsencesStudents[1]?.unjustifiedAbsences);
                    setClassroomName(classroom[1].grade.name.slice(0, -1));
                    setGradeSection(classroom[1].grade.section);
                }
            } else if(shift.name === "Vespertino") {
                if(classroom[0].grade.shift.name === "Vespertino") {
                    setName1(top2AbsencesStudents[0].student.name);
                    setAbsences1(top2AbsencesStudents[0].unjustifiedAbsences);
                    setName2(top2AbsencesStudents[1]?.student.name);
                    setAbsences2(top2AbsencesStudents[1]?.unjustifiedAbsences);
                    setClassroomName(classroom[0].grade.name.slice(0, -1));
                    setGradeSection(classroom[0].grade.section);
                }else if(classroom[1]?.grade.shift.name === "Vespertino") {
                    setName1(top2AbsencesStudents[0].student.name);
                    setAbsences1(top2AbsencesStudents[0].unjustifiedAbsences);
                    setName2(top2AbsencesStudents[1]?.student.name);
                    setAbsences2(top2AbsencesStudents[1]?.unjustifiedAbsences);
                    setClassroomName(classroom[1].grade.name.slice(0, -1));
                    setGradeSection(classroom[1].grade.section);
                }
            }
        } else if (absenceRecord.length === 0 && classroom.length > 0){
            
            if(classroom[0].grade.shift.name === "Matutino") {
                setClassroomName(classroom[0].grade.name.slice(0, -1));
                setGradeSection(classroom[0].grade.section);
            }else if(classroom[1]?.grade.shift.name === "Matutino") {
                setClassroomName(classroom[1]?.grade.name.slice(0, -1));
                setGradeSection(classroom[1]?.grade.section);
            }
        } else if(shift.name === "Vespertino") {
            if(classroom[0].grade.shift.name === "Vespertino") {
                setClassroomName(classroom[0].grade.name.slice(0, -1));
                setGradeSection(classroom[0].grade.section);
            }else if(classroom[1]?.grade.shift.name === "Vespertino") {
                setClassroomName(classroom[1]?.grade.name.slice(0, -1));
                setGradeSection(classroom[1]?.grade.section);
            }
        }

    }
, [top2AbsencesStudents]);

    useEffect(() => {
        if(classroom?.length > 0 && shift) {
            const selectedClassroom = classroom.find(classroom => classroom.grade.shift.id === shift.id);

            setClassroomName(selectedClassroom ? selectedClassroom.grade.name.slice(0, -1) : "");
            setGradeSection(selectedClassroom ? selectedClassroom.grade.section : "");
        }
    }, [classroom, shift]);

    useEffect(() => {
        console.log("Shift:");
        console.log(shift);
        console.log("Top 2 Absences:");
        console.log(top2AbsencesStudents);
        console.log("Classroom:");
        console.log(classroom);
    }, [top2AbsencesStudents]);

    useEffect(() => {
        console.log("Inasistencia: ", absenceRecord);
        console.log(`Salon: ${classroomName} Seccion: ${gradeSection}`);

        setTodayAbsences(absenceRecord.filter(absence => absence.date === date.toISOString().split('T')[0]));

    }, [absenceRecord, gradeSection, classroomName]);

    useEffect(() => {
        console.log("Inasistencia de hoy: ", todayAbsences);

    }, [todayAbsences]);

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
    }, []);
    

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
                                iconsvg1={clipboardListIcon} description1="Reportar inasistencias" link1="/AttendanceRegisterView"
                                iconsvg2={searchIcon} description2="Búsqueda de maestro" link2="/SearchTeacher"
                                iconsvg3={usersIcon} description3="Revisar listado de asistencias" link3="/AttendanceGeneralView"/>
                        </div>

                        <div className={[classes["dashboardContainer"]]}>
                        
                        <StudentAbsencesCard 
                        name1={name1 || "No hay estudiantes con inasistencias"} 
                        classroom1={`${classroomName} ${gradeSection}` || "No hay estudiantes con inasistencias"}
                        absences1={absences1 + " inasistencias"} 
                        name2={name2 || "No hay estudiantes con inasistencias"}
                        classroom2={`${classroomName} ${gradeSection}` || "No hay estudiantes con inasistencias"}
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
