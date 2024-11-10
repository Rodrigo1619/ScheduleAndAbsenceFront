import React, { useState, useRef, useEffect } from "react";
import SelectSearch from "react-select";

import { 

    Typography,
    Select,
    Option,

} from "@material-tailwind/react";

import { IoSearchSharp } from "react-icons/io5";
import { notification } from 'antd';

import classes from "./TeacherSearch.module.css";
import Header from "../../Components/Header/Header";
import NextSubjectCard from "../../Components/NextClassCard/NextSubjectCard";
import AsyncSelect from '../../Components/AsyncSelect/AsyncSelect';

import { useUserContext } from "../../Context/userContext";
import { userService } from "../../Services/userService";
import { classroomService } from "../../Services/classroomService";
import { scheduleService } from "../../Services/scheduleService";
import { shiftService } from "../../Services/shiftService";
import { classPeriodService } from "../../Services/classPeriodService";
import { weekdayService } from "../../Services/weekdayService";

const DayList = [
    { label: "Lunes", value: "Lunes"},
    { label: "Martes", value: "Martes"},
    { label: "Miercoles", value: "Miercoles"},
    { label: "Jueves", value: "Jueves"},
    { label: "Viernes", value: "Viernes"},
];

const TeacherSearch = () => {

    const { token, user } = useUserContext();

    const [teacher, setTeacher] = useState(null);
    const [teachersList, setTeachersList] = useState([]);
    const [classroomsList, setClassroomsList] = useState([]);
    const [classroom, setClassroom] = useState();
    const [shiftList, setShiftList] = useState([]);
    const [shift, setShift] = useState(null);
    const [classPeriod, setClassPeriod] = useState([]);
    const [year, setYear] = useState(null);
    
    const selectedHourRef = useRef({id: "", name: ""});
    const [hour, setHour] = useState(null);
    const selectedDayRef = useRef({value: "", label: ""});
    const [day, setDay] = useState(null);
    const [DayList, setDayList] = useState([]);


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

                const formattedData = data.splice(0,8);

                setClassPeriod(formattedData);
            } catch (error) {
                console.log("Hubo un error al obtener los periodos de clases" + error);
            }
        };

        const fetchDayList = async () => {
            try {
                
                const data = await weekdayService.getWeekdays(token);

                const formattedData = data.map((day) => ({
                    label: day.day,
                    value: day.id,
                }));

                setDayList(formattedData);
            } catch (error) {
                console.log("Hubo un error al obtener los dias de la semana" + error);
            };
        }

        fetchTeachers();
        fetchClassPeriod();
        fetchDayList();

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

    const handleSelectHourChange = (e) => {
        const selectedHour = classPeriod.find(hour => hour.id === e);
        selectedHourRef.current = selectedHour;
        setHour(selectedHour);

        console.log("La hora de clase seleccionada es: ", selectedHour.id, selectedHour.name);
    };

    const handleSelectDayChange = (e) => {
        const selectedDay = DayList.find(day => day.value === e);
        selectedDayRef.current = selectedDay;
        setDay(selectedDay);

        console.log("El dia de clase cambio a: ", selectedDay.value, selectedDay.label);
    };

    const handleSelectTeacherChange = (e) => {

        if(e === null){
            setTeacher(null);
            return;
        }

        const selectedTeacher = teachersList.find((teacher) => teacher.id === e.value);

        
        if(selectedTeacher){
            setTeacher(e);

            console.log(`El profesor seleccionado es: ${e.value}<->${e.label}`);
        }
        
    };

    const handleSelectClassroomChange = (e) => {

        if(e === null){
            setClassroom(null);
            return;
        }

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

        if(day && hour && teacher && shift){

            console.log("Buscando horario de clase por profesor...")
            console.log(`Turno: ${shift.id} <-> ${shift.name} Profesor: ${teacher.label}<->${teacher.value}, Año: ${year}, Hora: ${hour.id}<->${hour.name}`)
            try {
                const data = await scheduleService.getScheduleBySearchParameters(token, hour.id, shift.id, day.value, year, teacher.value, "");
                
                if(data){

                    console.log("Horario de clase encontrado", data);

                    notification.success({
                        message: 'Exito!',
                        description: "Busqueda realizada exitosamente",
                        placement: 'bottomRight',
                        duration: 2,
                    });

                    setCardTeacher(data.user_x_subject.teacher.name);
                    setCardSubject(data.user_x_subject.subject.name);
                    setCardClassroom(data.classroomConfiguration.classroom.grade.name);
                    setCardHour(`${data.classroomConfiguration.classPeriod.name} ${data.classroomConfiguration.hourStart.substring(0,5)} - ${data.classroomConfiguration.hourEnd.substring(0,5)}`);

                    selectedHourRef.current = null;
                    setHour(null);
                    setDay(null);
                    setTeacher(null);
                    setClassroom(null);
                    setShift(null);
                }else{
                    throw new Error("No se encontro horario de clase");
                }
            } catch (error) {
                console.log(`Hubo un error al obtener los horarios: ${error}`);

                setCardTeacher(teacher.label);
                setCardSubject("Libre");
                setCardClassroom("Sala de Profesores");
                setCardHour(selectedHourRef.current.name);

                selectedHourRef.current = null;
                setHour(null);
                setDay(null);
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

        }else if(day && hour && classroom && shift){
            

            console.log("Buscando horario de clase por salon de clases...", classroom.value);
            console.log("turno", shift);
        
            try {

                const classroomFound = await classroomService.getByParameters(token, year, classroom.value, shift.id);
                console.log(`Turno: ${shift.id}<->${shift.name} Salon: ${classroomFound.id} ${classroomFound.grade.name}, Año: ${year}, Hora: ${hour.id} <-> ${hour.name}, Dia: ${day.value} <-> ${day.label}`);
    
                const data = await scheduleService.getScheduleBySearchParameters(token, hour.id, shift.id, day.value, year, "", classroomFound.id);
    
                if(data){
    
                    console.log("Horario de clase encontrado", data);

                    notification.success({
                        message: 'Exito!',
                        description: "Busqueda realizada exitosamente",
                        placement: 'bottomRight',
                        duration: 2,
                    });
    
                    setCardTeacher(data.user_x_subject.teacher.name);
                    setCardSubject(data.user_x_subject.subject.name);
                    setCardClassroom(data.classroomConfiguration.classroom.grade.name);
                    setCardHour(`${data.classroomConfiguration.classPeriod.name} ${data.classroomConfiguration.hourStart.substring(0,5)} - ${data.classroomConfiguration.hourEnd.substring(0,5)}`);
                    
                    selectedHourRef.current = null;
                    setHour(null);
                    setDay(null);
                    setTeacher(null);
                    setClassroom(null);
                    setShift(null);
                }else{
                    throw new Error("No se encontro horario de clase");
                }
            } catch (error) {
                console.log(`Hubo un error al obtener los horarios: ${error}`);

                setCardTeacher("Nombre Profesor");
                setCardSubject("Libre");
                setCardClassroom(classroom.label);
                setCardHour(selectedHourRef.current.name);

                selectedHourRef.current = null;
                setHour(null);
                setDay(null);
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
            setHour(null);
            setDay(null);
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
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={classes["bodyContainer"]}>
                <div className={classes["allContentContainer"]}>
                    <div className={classes["pageContentContainerCol"]}>
                        <div className={[classes["TitleContainer"]]}>
                            <Typography className="font-masferrer text-2xl font-semibold my-4
                                Mobile-390*844:text-sm
                                Mobile-280:text-sm
                                ">BUSQUEDA DE PROFESOR
                            </Typography>
                        </div>
                        <div className={classes["searchFormContainer"]}>
                            <div className={classes["pageContentContainerCol"]}>
                                <div className={classes["input-container"]}>
                                    <label className={classes["label"]}> Hora:</label>
                                    <AsyncSelect
                                        onChange={handleSelectHourChange}
                                        className="bg-white Mobile-280:w-full"
                                        value={hour ? hour.id : ""}>
                                        {classPeriod.map((hour, index) => (
                                            <Option key={index} value={hour.id}>
                                                {hour.name}
                                            </Option>
                                        ))}
                                    </AsyncSelect> 
                                </div>
                                <div className={classes["input-container"]}>
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
                                    <label className={classes["label"]}> Dia:</label>
                                    <AsyncSelect 
                                        onChange={handleSelectDayChange} 
                                        className="bg-white Mobile-280:w-full" 
                                        value={day ? day.value : ""}>
                                        {DayList.map((day, index) => (
                                            <Option key={index} value={day.value}>{day.label}</Option>
                                        ))}
                                    </AsyncSelect>
                                </div>
                            </div>
                            <div className={classes["pageContentContainerCol"]}>
                                
                                <Typography className="font-masferrer font-normal text-black -mt-4">
                                    Seleccionar una opción:
                                </Typography>

                                <div className={classes["input-container"]}>
                                    <label className={classes["label"]}> Profesor:</label>
                                    <SelectSearch
                                        value={teacher}
                                        isClearable={true}
                                        options={teachersList.map((teacher) => ({
                                            value: teacher.id,
                                            label: teacher.name,
                                        }))}
                                        onChange={handleSelectTeacherChange}
                                        placeholder="Seleccione un maestro"
                                        className=" Mobile-280:w-full text-black min-w-full border-2 border-black border-opacity-20 overflow-visible"
                                    />
                                </div>
                                <div className={classes["input-container"]}>
                                    <label className={classes["label"]}> Salon de Clases:</label>
                                    <SelectSearch
                                        value={classroom}
                                        isClearable={true}
                                        options={classroomsList.map((classroom) => ({
                                            value: classroom.grade.id,
                                            label: classroom.grade.name,
                                        }))}
                                        onChange={handleSelectClassroomChange}
                                        placeholder="Seleccione un salon de clases"
                                        className=" Mobile-280:w-full text-black min-w-full border-2 border-black border-opacity-20 overflow-visible"
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
                            
                            <button className="bg-indigo-900 text-white rounded-lg py-2 px-7 self-center Mobile-390*844:mb-4"
                                onClick={handleRefresh}>
                                <IoSearchSharp className="inline-block text-white text-xl" /> Buscar
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherSearch;