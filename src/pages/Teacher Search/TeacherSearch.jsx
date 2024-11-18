import React, { useState, useRef, useEffect } from "react";
import SelectSearch from "react-select";
import { Toaster, toast } from "sonner";

import { 

    Typography,
    Select,
    Option,

} from "@material-tailwind/react";

import { IoSearchSharp } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";
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
                } catch (error) {
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
                    
                    const teachers = data.filter((user) => user.role.name === "Profesor");

                    setTeachersList(teachers);
                }
            } catch (error) {
            }
        };

        const fetchClassPeriod = async () => {
            try {
                const data = await classPeriodService.getClassPeriods(token);

                const formattedData = data.splice(0,8);

                setClassPeriod(formattedData);
            } catch (error) {
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
            };
        }

        fetchTeachers();
        fetchClassPeriod();
        fetchDayList();

    }, [token]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const data = await classroomService.getClassroomsByShiftAndYear(token, shift.id, year);

                setClassroomsList(data);
            } catch (error) {
            }
        };

        fetchClassrooms();
    }, [shift, year, token]);

    const toastNotify = () => {
        const loadingToast = toast('Cargando...', {
            icon: <AiOutlineLoading className="animate-spin" />,
        });

        if (classroomsList) {
            toast.dismiss(loadingToast);
        }
    }

    const handleSelectHourChange = (e) => {
        const selectedHour = classPeriod.find(hour => hour.id === e);
        selectedHourRef.current = selectedHour;
        setHour(selectedHour);

    };

    const handleSelectDayChange = (e) => {
        const selectedDay = DayList.find(day => day.value === e);
        selectedDayRef.current = selectedDay;
        setDay(selectedDay);

    };

    const handleSelectTeacherChange = (e) => {

        if(e === null){
            setTeacher(null);
            return;
        }

        const selectedTeacher = teachersList.find((teacher) => teacher.id === e.value);

        
        if(selectedTeacher){
            setTeacher(e);

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

        }
    };

    const handleSelectShiftChange = (e) => {
        const selectedShift = shiftList.find((shift) => shift.id === e);

        setShift(selectedShift);
    };

    const handleRefresh = async () => {


        if(day && hour && teacher && shift){

            try {
                const data = await scheduleService.getScheduleBySearchParameters(token, hour.id, shift.id, day.value, year, teacher.value, "");
                
                if(data){

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

                notification.info({ 
                    message: 'Oh vaya!', 
                    description: "Parece que el profesor no tiene clases asignadas en este horario", 
                    placement: 'bottomRight',
                    duration: 3,})
            }

        }else if(day && hour && classroom && shift){
                    
            try {

                const classroomFound = await classroomService.getByParameters(token, year, classroom.value, shift.id);
    
                const data = await scheduleService.getScheduleBySearchParameters(token, hour.id, shift.id, day.value, year, "", classroomFound.id);
    
                if(data){
    
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
            <Toaster />
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
                                        onFocus={toastNotify}
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