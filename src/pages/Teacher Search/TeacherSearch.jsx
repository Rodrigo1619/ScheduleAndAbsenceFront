import React, { useState, useRef, useEffect } from "react";
import SelectSearch from "react-select";

import { 

    Typography,
    Select,
    Option,
    Button,

} from "@material-tailwind/react";

import { IoSearchSharp } from "react-icons/io5";
import { notification } from 'antd';

import classes from "./TeacherSearch.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import NextSubjectCard from "../../Components/NextClassCard/NextSubjectCard";
import AsyncSelect from '../../Components/AsyncSelect/AsyncSelect';

import { useUserContext } from "../../Context/userContext";
import { userService } from "../../Services/userService";
import { classroomService } from "../../Services/classroomService";
import { scheduleService } from "../../Services/scheduleService";
import { shiftService } from "../../Services/shiftService";
import { classPeriodService } from "../../Services/classPeriodService";
import { set } from "lodash";

const HoursListDemo = [
    { start: "07:00:00", name: "1er Hora"},
    { start: "07:40:00", name: "2da Hora"},
    { start: "08:50:00", name: "3ra Hora"},
    { start: "09:30:00", name: "4ta Hora"},
    { start: "10:10:00", name: "5ta Hora"},
    { start: "11:05:00", name: "6ta Hora"},
    { start: "11:45:00", name: "7ma Hora"},
];

const DayList = [
    { name: "Lunes"},
    { name: "Martes"},
    { name: "Miercoles"},
    { name: "Jueves"},
    { name: "Viernes"},
];

const teachersListDemo = [
    { id: 1, name: "Brandon Moisa" },
    { id: 2, name: "Wilmer Pacuso" },
    { id: 3, name: "Kevin Zepeda" },
]; 

const gradesListDemo = [
    { id: 1, name: "1° General A" },
    { id: 2, name: "2° General A" },
    { id: 3, name: "3° General A" },
]; 

const TeacherSearch = () => {

    const { token } = useUserContext();

    const [teacher, setTeacher] = useState(null);
    const [teachersList, setTeachersList] = useState([]);
    const [classroomsList, setClassroomsList] = useState([]);
    const [classroom, setClassroom] = useState();
    const [shiftList, setShiftList] = useState([]);
    const [shift, setShift] = useState(null);
    const [classPeriod, setClassPeriod] = useState([]);
    const [year, setYear] = useState(null);
    
    const selectedHourRef = useRef({id: "", name: ""});
    const selectedDayRef = useRef(null);
    const selectedShiftRef = useRef({id: "", name: ""});

    const [cardTeacher, setCardTeacher] = useState(null);
    const [cardSubject, setCardSubject] = useState(null);
    const [cardClassroom, setCardClassroom] = useState(null);
    const [cardHour, setCardHour] = useState(null);

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
        setYear(new Date().getFullYear());

        const fetchShifts = async () => {
            if(token){
                try {
                    const data = await shiftService.getAllShifts(token);
                    setShiftList(data || []);
                    console.log("Turnos", data);
                } catch (error) {
                    console.log("Hubo un error al obtener los turnos" + error);
                }
            }
        };

        fetchShifts();
    }, [token]);

    useEffect(() => {
        
        const fetchTeachers = async () => {
            try {
                const data = await userService.getAllTeachersAdmin(token);
                if(data){
                    
                    console.log(data);
                    const teachers = data.filter((user) => user.role.name === "Profesor");

                    setTeachersList(teachers);
                    console.log(teachers);
                }
            } catch (error) {
                console.log("Hubo un error al obtener los profesores " + error);
            }
        };

        const fetchClassPeriod = async () => {
            try {
                const data = await classPeriodService.getClassPeriods(token);
                console.log("Horas ", data);
                setClassPeriod(data.splice(0, 8));
            } catch (error) {
                console.log("Hubo un error al obtener los periodos de clases" + error);
            }
        };

        fetchTeachers();
        fetchClassPeriod();

    }, [token]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {

                console.log("Year ", year);
                const data = await classroomService.getClassroomsByShiftAndYear(token, shift.id, year);

                setClassroomsList(data);

                console.log("salones", data);
                console.log("Turno", shift);
            } catch (error) {
                console.log("Hubo un error al obtener los salones " + error);
            }
        };

        fetchClassrooms();
    }, [shift, year, token]);

    const handleSelectChange = (e) => {
        const selectedHour = classPeriod.find(hour => hour.id === e);
        selectedHourRef.current = selectedHour;

        console.log("La hora de clase cambio a: " + selectedHourRef.current.name);
    };

    const handleSelectDayChange = (e) => {
        const selectedDay = DayList.find(day => day.name === e);
        selectedDayRef.current = selectedDay;

        console.log("El dia de clase cambio a: " + selectedDayRef.current.name);
    };

    const handleSelectTeacherChange = (e) => {
        const selectedTeacher = teachersList.find((teacher) => teacher.id === e.value);

        
        if(selectedTeacher){
            setTeacher(e);

            console.log(`El profesor seleccionado es: ${e.label}`);
        }
        
    };

    const handleSelectClassroomChange = (e) => {
        const selectedClassroom = classroomsList.find((classroom) => classroom.grade.id === e.value);
        
        if(selectedClassroom){
            setClassroom(e);

            console.log(`El salon de clases seleccionado es: ${e.value} ${e.label}` );
        }
    };

    const handleSelectShiftChange = (e) => {
        const selectedShift = shiftList.find((shift) => shift.id === e);

        setShift(selectedShift);
    };

    const handleRefresh = async () => {

        console.log("Buscando horario de clase...");

       // console.log(selectedDayRef.current.name + " " + selectedHourRef.current.name + " " + teacher ? teacher.label : "N/A" + " " + grade ? grade.label : "N/A" + " " + year)



        if(selectedDayRef.current && selectedHourRef.current && teacher && shift){

            console.log("Buscando horario de clase por profesor...")
            console.log(`Turno: ${shift.id} <-> ${shift.name} Profesor: ${teacher.label}, Año: ${year}, Hora: ${selectedHourRef.current.name}`)

            try {
                const data = await scheduleService.getScheduleByUserId(token, teacher.value, year);
            
                const cardinfo = data[0].schedules.find((schedule) => 
                    schedule.weekday.day === selectedDayRef.current.name &&
                    schedule.classroomConfiguration.classPeriod.id === selectedHourRef.current.id &&
                    data[0].classroom.shift.id === shift.id);

                if(cardinfo){

                    console.log("Horario de clase encontrado")
                    console.log(cardinfo)

                    setCardTeacher(cardinfo.user_x_subject.teacher.name);
                    setCardSubject(cardinfo.user_x_subject.subject.name);
                    setCardClassroom(data[0].classroom.grade.name);
                    setCardHour(`${cardinfo.classroomConfiguration.classPeriod.name} ${cardinfo.classroomConfiguration.hourStart.substring(0,5)} - ${cardinfo.classroomConfiguration.hourEnd.substring(0,5)}`);

                    selectedHourRef.current = null;
                    selectedDayRef.current = null;
                    setTeacher(null);
                    setClassroom(null);
                    setShift(null);
                }
            } catch (error) {
                console.log(`Hubo un error al obtener los horarios: ${error}`);

                setCardTeacher(teacher.label);
                setCardSubject("Libre");
                setCardClassroom("Sala de Profesores");
                setCardHour(selectedHourRef.current.name);

                selectedHourRef.current = null;
                selectedDayRef.current = null;
                setTeacher(null);
                setClassroom(null);
                setShift(null);

                console.log("No se encontro horario de clase")
                notification.info({ 
                    message: 'Oh vaya!', 
                    description: "Parece que el profesor no tiene clases asignadas en este horario", 
                    placement: 'bottomRight',
                    duration: 3,})
            }

        }else if(selectedDayRef.current && selectedHourRef.current && classroom && shift){
            

            console.log("Buscando horario de clase por salon de clases...", classroom.value);
            console.log("turno", shift);
        
            try {

                const classroomFound = await classroomService.getByParameters(token, year, classroom.value, shift.id);
                console.log(`Turno: ${shift.id}<->${shift.name} Salon: ${classroomFound.id} ${classroomFound.grade.name}, Año: ${year}`)
    
                const data = await scheduleService.getScheduleByClassroomId(token, classroomFound.id, year);
    
                const cardinfo = data[0].schedules.find((schedule) => 
                    schedule.weekday.day === selectedDayRef.current.name &&
                    schedule.classroomConfiguration.classPeriod.id === selectedHourRef.current.id &&
                    data[0].classroom.shift.id === shift.id);
    
                if(cardinfo){
    
                    console.log("Horario de clase encontrado")
                    console.log(cardinfo)
    
                    setCardTeacher(cardinfo.user_x_subject.teacher.name);
                    setCardSubject(cardinfo.user_x_subject.subject.name);
                    setCardClassroom(data[0].classroom.grade.name);
                    setCardHour(`${cardinfo.classroomConfiguration.classPeriod.name} ${cardinfo.classroomConfiguration.hourStart.substring(0,5)} - ${cardinfo.classroomConfiguration.hourEnd.substring(0,5)}`);
                    selectedHourRef.current = null;
                    selectedDayRef.current = null;
                    setTeacher(null);
                    setClassroom(null);
                    setShift(null);
                }
            } catch (error) {
                console.log(`Hubo un error al obtener los horarios: ${error}`);

                setCardTeacher("Nombre Profesor");
                setCardSubject("Libre");
                setCardClassroom(classroom.label);
                setCardHour(selectedHourRef.current.name);

                selectedHourRef.current = null;
                selectedDayRef.current = null;
                setTeacher(null);
                setClassroom(null);
                setShift(null);

                console.log("No se encontro horario de clase")
                notification.info({ 
                    message: 'Oh vaya!', 
                    description: "Parece que no hay registrado un profesor en el salón a esa hora", 
                    placement: 'bottomRight',
                    duration: 3,})
            }

        }else{

            selectedHourRef.current = null;
            selectedDayRef.current = null;
            setTeacher(null);
            setClassroom(null);
            setShift(null);

            notification.error({ 
                message: 'Oh no!', 
                description: "Por favor llene los campos minimos para la busqueda", 
                placement: 'bottomRight',
                duration: 3,})

        }

    };

    return(
        <div className={[classes["generalContainer"]]}>
            <header className={classes["headerContainer"]}>
                <Header name="Luis Morales" role="Administrador" />
            </header>

            <div className={classes["bodyContainer"]}>
                <div className={classes["allContentContainer"]}>
                    <SideBarNav />
                    <div className={classes["pageContentContainerCol"]}>
                        <div className={[classes["TitleContainer"]]}>
                            <Typography className="font-masferrer text-2xl font-light my-4
                                Mobile-390*844:text-sm
                                Mobile-280:text-sm
                                ">BUSQUEDA DE PROFESOR
                            </Typography>
                        </div>
                        <div className={classes["searchFormContainer"]}>
                            <div className={classes["pageContentContainerRow"]}>
                                <div className={classes["input-container"]}>
                                    {/* <label className={classes["label"]}> Hora:</label>
                                    <Select
                                        value={selectedHourRef.current ? selectedHourRef.current.name : ''}
                                        onChange={handleSelectChange}
                                        className="bg-white Mobile-280:w-full">
                                        {classPeriod.map((hour) => (
                                            <Option key={hour.id} value={hour.id}>
                                                {hour.name}
                                            </Option>
                                        ))}
                                    </Select> */}
                                    <label className={classes["label"]}> Turno:</label>
                                    <AsyncSelect
                                        value={shift ? shift.id : ''}
                                        onChange={handleSelectShiftChange}
                                        className="bg-white Mobile-280:w-full">
                                        {shiftList?.map((shift) => (
                                            <Option key={shift.id} value={shift.id}>
                                                {shift.name}
                                            </Option>
                                        ))}
                                    </AsyncSelect> 
                                </div>
                                <div className={classes["input-container"]}>
                                    {/* <label className={classes["label"]}> Dia:</label>
                                    <Select
                                        value={selectedDayRef.current ? selectedDayRef.current.name : ''}
                                        onChange={handleSelectDayChange}
                                        className="bg-white Mobile-280:w-full">
                                        {DayList.map((day) => (
                                            <Option key={day.name} value={day.name}>
                                                {day.name}
                                            </Option>
                                        ))}
                                    </Select> */}
                                    <label className={classes["label"]}> Profesor:</label>
                                    <SelectSearch
                                        value={teacher}
                                        options={teachersList.map((teacher) => ({
                                            value: teacher.id,
                                            label: teacher.name,
                                        }))}
                                        onChange={handleSelectTeacherChange}
                                        placeholder="Seleccione un maestro"
                                        className=" Mobile-280:w-full text-black"
                                    />
                                </div>
                            </div>
                            <div className={classes["pageContentContainerRow"]}>
                                <div className={classes["input-container"]}>
                                    {/* <label className={classes["label"]}> Profesor:</label>
                                    <SelectSearch
                                        value={teacher}
                                        options={teachersList.map((teacher) => ({
                                            value: teacher.id,
                                            label: teacher.name,
                                        }))}
                                        onChange={handleSelectTeacherChange}
                                        placeholder="Seleccione un maestro"
                                        className=" Mobile-280:w-full text-black"
                                    /> */}
                                    <label className={classes["label"]}> Hora:</label>
                                    <Select
                                        value={selectedHourRef.current ? selectedHourRef.current.name : ''}
                                        onChange={handleSelectChange}
                                        className="bg-white Mobile-280:w-full">
                                        {classPeriod.map((hour) => (
                                            <Option key={hour.id} value={hour.id}>
                                                {hour.name}
                                            </Option>
                                        ))}
                                    </Select> 
                                </div>
                                <div className={classes["input-container"]}>
                                    {/* <label className={classes["label"]}> Salon de Clases:</label>
                                    <SelectSearch
                                        value={classroom}
                                        options={classroomsList.map((classroom) => ({
                                            value: classroom.grade.id,
                                            label: classroom.grade.name,
                                        }))}
                                        onChange={handleSelectClassroomChange}
                                        placeholder="Seleccione un salon de clases"
                                        className=" Mobile-280:w-full text-black"
                                    /> */}
                                    <label className={classes["label"]}> Dia:</label>
                                    <Select
                                        value={selectedDayRef.current ? selectedDayRef.current.name : ''}
                                        onChange={handleSelectDayChange}
                                        className="bg-white Mobile-280:w-full">
                                        {DayList.map((day) => (
                                            <Option key={day.name} value={day.name}>
                                                {day.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>

                                <div className={classes["input-container"]}>
                                    {/* <label className={classes["label"]}> Turno:</label>
                                    <AsyncSelect
                                        value={shift ? shift.id : ''}
                                        onChange={handleSelectShiftChange}
                                        className="bg-white Mobile-280:w-full">
                                        {shiftList?.map((shift) => (
                                            <Option key={shift.id} value={shift.id}>
                                                {shift.name}
                                            </Option>
                                        ))}
                                    </AsyncSelect> */}
                                    <label className={classes["label"]}> Salon de Clases:</label>
                                    <SelectSearch
                                        value={classroom}
                                        options={classroomsList.map((classroom) => ({
                                            value: classroom.grade.id,
                                            label: classroom.grade.name,
                                        }))}
                                        onChange={handleSelectClassroomChange}
                                        placeholder="Seleccione un salon de clases"
                                        className=" Mobile-280:w-full text-black"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={classes["cardContainer"]}>
                            <NextSubjectCard 
                                fromSearch={false}
                                teacherName={cardTeacher ? cardTeacher : "Nombre Profesor"} 
                                subject={cardSubject ? cardSubject : "Nombre Materia"} 
                                classroom={cardClassroom ? cardClassroom :"Salon de Clases"} 
                                hour={cardHour ? cardHour : "Hora"}/>
                            
                            <button className='text-sm justify-center my-auto
                                font-masferrerTitle font-normal PC-1280*720:text-xs 
                                PC-800*600:text-xs
                                PC-640*480:text-xs
                                Mobile-390*844:text-xs
                                Mobile-280:text-xs
                                IpadAir:text-xs'
                                onClick={handleRefresh}>
                                    <IoSearchSharp size={24}/>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherSearch;