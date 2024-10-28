import React, { useEffect, useState } from 'react';
import classes from './ClassroomScheduleTable.module.css';
import { Button, CardBody, Typography } from '@material-tailwind/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import HoursTable from '../Hours Table/HoursTable';
import { useUserContext } from '../../Context/userContext';
import { scheduleService } from '../../Services/scheduleService';
import { weekdayService } from '../../Services/weekdayService';
import { classroomService } from '../../Services/classroomService';
import { classroomConfigurationService } from '../../Services/classroomConfigurationService';
import { notification } from 'antd';
import { classPeriodService } from '../../Services/classPeriodService';
import HourDynamicTable from '../HourDynamicTable/HourDynamicTable';

const ClassroomScheduleTable = ({ grade, shift, year }) => {
    const [gradeSelected, setGradeSelected] = useState("");
    const [shiftSelected, setShiftSelected] = useState("");
    const [yearSelected, setYearSelected] = useState("");
    const [schedule, setSchedule] = useState([]);
    const [classroom, setClassroom] = useState([]);
    const [weekdays, setWeekdays] = useState([]);
    const [hourConfiguration, setHourConfiguration] = useState([]);
    const [classPeriod, setClassPeriod] = useState([]);
    const { token } = useUserContext();

    const defaultSubject = {
        teacher: "",
        subject: "",
        grade: "",
        shift: "",
        year: "",
    };

    const subjectColors = {
        "Matemáticas": "bg-blue-400",
        "Lenguaje y Literatura": "bg-yellow-400",
        "Ciencias Naturales": "bg-green-400",
        "Estudios Sociales": "bg-red-400",
        "Educación Física": "bg-purple-400",
        "Educación Artística": "bg-pink-400",
        "Educación Religiosa": "bg-gray-400",
        "Informática": "bg-indigo-400",
        "Inglés": "bg-blue-400",
        "Formación Cívica": "bg-yellow-400",
        "Orientación": "bg-green-400",
        "Tutoría": "bg-red-400",
        "Laboratorio": "bg-purple-400",
        "Biblioteca": "bg-pink-400",
        // Añade más materias y colores aquí
    };

    useEffect(() => {

        if (grade?.id && token) {
        const fetchHourConfiguration = async () => {
            try {
                const response = await classroomConfigurationService.getClassroomConfigurationById(token, grade.id);
                console.log("Hour configuration: ", response[0].classroomConfigurations);
                setHourConfiguration(response[0].classroomConfigurations);
            } catch (error) {
                console.log("Error fetching hour configuration: ", error);
            }
        };

        fetchHourConfiguration();
    }
    
    }, [token, grade]);

    useEffect(() => {

        const fetchClassPeriod = async () => {
            try {
                const response = await classPeriodService.getClassPeriods(token);
                console.log("Class periods: ", response);
                setClassPeriod(response);
            } catch (error) {
                console.log("Error fetching class periods: ", error);
            }
        };

        fetchClassPeriod();

    }, [token]);

    useEffect(() => {
        const fetchWeekdays = async () => {
            try {
                const response = await weekdayService.getWeekdays(token);
                setWeekdays(response);
            } catch (error) {
                console.log("Error fetching weekdays: ", error);
            }
        };
    
        fetchWeekdays();
    }, [token]);


    useEffect(() => {
        if (grade && shift && year) {
            setGradeSelected(grade);
            setShiftSelected(shift);
            setYearSelected(year);
        }
    }, [grade, shift, year]);

    useEffect(() => {
        if (gradeSelected && shiftSelected && yearSelected) {
            
            const getClassroom = async () => {
                try {
                    const response = await classroomService.getByParameters(token, yearSelected, gradeSelected.id, shiftSelected.id);
                    console.log("Classroom: ", response);
                    setClassroom(response);
                } catch (error) {
                    if (error.message === "Error: 404") {
                        notification.error({ message: "No se encontró el salón de clases" });
                        // Reiniciar el horario si no se encuentra el salón de clases
                        setSchedule([]);
                        setClassroom([]);

                    } else {
                    console.log("Error fetching classroom: ", error);
                    notification.error({ message: "Error al obtener el salón de clases" });

                }
            }
            };
        
            getClassroom();
        }
    }, [gradeSelected, shiftSelected, yearSelected]);

    useEffect(() => {
    
        if (hourConfiguration.length > 0 && classPeriod.length > 0) {
            initializeSchedule(token, hourConfiguration, classPeriod);
        } else {
            console.log("classPeriod: ", classPeriod);
            console.log("Condition not met");
        }
    }, [grade, hourConfiguration, classPeriod]);


    const initializeSchedule = (token, hourConfiguration, classPeriod) => {
        const createDefaultEntry = (hourStart, hourEnd, weekday, classroomConfigurationId) => ({
            ...defaultSubject,
            hourStart,
            hourEnd,
            weekday,
            classroomConfigurationId,
        });

        const recreoId = classPeriod.find(period => period.name === "RECREO").id;
    
        console.log("Recreo id: ", recreoId);
    
        // Sort hourConfiguration by hourStart to ensure correct order
        const sortedHourConfiguration = [...hourConfiguration].sort((a, b) => a.hourStart.localeCompare(b.hourStart));
    
        const initialSchedule = sortedHourConfiguration.map(block => {
            if (block.classPeriod.id === recreoId) {
                return { Recreo: "Recreo" };
            } else {
                return {
                    Lunes: { ...createDefaultEntry(block.hourStart, block.hourEnd, weekdays[0].id, block.id) },
                    Martes: { ...createDefaultEntry(block.hourStart, block.hourEnd, weekdays[1].id, block.id) },
                    Miércoles: { ...createDefaultEntry(block.hourStart, block.hourEnd, weekdays[2].id, block.id) },
                    Jueves: { ...createDefaultEntry(block.hourStart, block.hourEnd, weekdays[3].id, block.id) },
                    Viernes: { ...createDefaultEntry(block.hourStart, block.hourEnd, weekdays[4].id, block.id) }
                };
            }
        });

        setSchedule(initialSchedule); // Asegúrate de actualizar el estado de `schedule`
    
        const scheduleMapping = sortedHourConfiguration.reduce((acc, block, index) => {
            if (block.classPeriod.id !== recreoId) {
                acc[`${block.hourStart?.slice(0, 5)}-${block.hourEnd?.slice(0, 5)}`] = index;
            }
            return acc;
        }, {});

        console.log("Schedule mapping: ", scheduleMapping);


        const getClassroomSchedule = async () => {
            try {
                console.log("Getting classroom schedule...");
                const response = await scheduleService.getScheduleByClassroomId(token, grade.id);
                if (response) {
                    console.log("Teacher schedule: ", response);
                    notification.success({ message: "Horario de clases encontrado" });
                    updateSchedule(response, initialSchedule);
                } else {
                    console.log("No schedule found for the teacher");
                    notification.info({ message: "No se encontró el horario de clases para el profesor" });
                    setSchedule(initialSchedule);
                }
            } catch (error) {
                if (error.message === "Error: 404") {
                    notification.info({ message: "No se encontró el horario de clases para el profesor" });
                    setSchedule(initialSchedule);
                } else {
                console.log("Error getting teacher schedule: ", error);
                notification.error({
                    message: 'Error',
                    description: 'Hubo un error al obtener el horario del profesor',
                    placement: 'top',
                    duration: 4,
                });
                setSchedule(initialSchedule);
            }              
            }
        };
    
        const updateSchedule = (classroomSchedule, initialSchedule) => {
            classroomSchedule.forEach(entry => {
                // Verificar que entry y entry.schedules existan
                if (entry && entry.schedules) {
                    entry.schedules.forEach(schedule => {
                        const day = schedule.weekday.day; // "Lunes", "Martes", etc.
                        console.log("Day: ", day);
                        const timeSlot = `${schedule.classroomConfiguration.hourStart?.slice(0, 5)}-${schedule.classroomConfiguration.hourEnd?.slice(0, 5)}`;
                        console.log("Time slot: ", timeSlot);
                        const slotIndex = scheduleMapping[timeSlot];
                        console.log("Slot index: ", slotIndex);
                        if (slotIndex !== undefined) {
                            initialSchedule[slotIndex][day] = {
                                ...initialSchedule[slotIndex][day],
                                teacher: schedule?.user_x_subject?.teacher.name,
                                subject: schedule?.user_x_subject?.subject.name,
                                grade: entry?.classroom.grade?.name,
                                shift: entry?.classroom.shift?.name,
                                year: entry?.classroom?.year,
                                hourStart: schedule?.hourStart,
                                hourEnd: schedule?.hourEnd,
                                id: schedule.id,
                                classroomConfigurationId: schedule.classroomConfigurationId
                            };
                        }
                    });
                } else {
                    console.error("Invalid entry structure: ", entry);
                }
            });
            console.log("Initial schedule: ", initialSchedule);
            setSchedule([...initialSchedule]);
        };
    
        getClassroomSchedule();
    };


    const TABLE_HEAD = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    return (
        <div className={classes["generalCardContainer"]}>
            <CardBody className="flex flex-col bg-white border-2 border-black border-opacity-75 px-2 py-1">
                <Typography className='font-masferrerTitle font-bold text-lg'>
                {classroom.grade ? `Horario de ${classroom.grade.name} - ${classroom.shift.name}` : 
                "Horario del salón de clases"
                }
            </Typography>
                <div className="flex flex-row justify-center items-center mx-auto">
                    <table className="table-auto text-left w-max">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head, index) => (
                                    <th key={index} className="p-4 bg-transparent">
                                        <div className="font-masferrer text-xl font-regular border-2 
                                    px-14 py-2 border-black">
                                            <Typography
                                                className="font-masferrerTitle text-center text-xl font-bold"
                                            >
                                                {head}
                                            </Typography>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((subject, index) => (
                                subject.Recreo ? (
                                    <tr key={`recreo-${index}`}>
                                        <td colSpan={TABLE_HEAD.length} className="p-4 bg-transparent">
                                            <div className="font-masferrer text-2xl font-bold border-2 
                                        px-14 py-2 text-center border-black">
                                                <Typography
                                                    className="font-masferrerTitle text-lg font-bold uppercase"
                                                >
                                                    {subject.Recreo}
                                                </Typography>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={index}>
                                        {TABLE_HEAD.map((day, idx) => (
                                            subject[day].grade ? (
                                                // Different color for any subject that is not free
                                                <td key={idx} className="p-4 bg-transparent">
                                                    <div className={`font-masferrer text-lg font-regular border-2
                                                px-6 py-3 border-black ${subjectColors[subject[day].subject]}`}>
                                                        <Typography
                                                            className="font-masferrerTitle text-center text-lg font-bold"
                                                        >
                                                            {subject[day].subject}
                                                        </Typography>
                                                    </div>
                                                </td>
                                            ) : (
                                                <td key={idx} className="p-4 bg-transparent">
                                                    <div className="font-masferrer text-lg font-regular border-2 
                                                px-4 py-3 border-black bg-orange-400">
                                                        <div className="
                                                    flex justify-center items-center mx-auto">
                                                            <Typography
                                                                className="font-masferrerTitle text-center text-lg font-bold"
                                                            >
                                                                LIBRE
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                            )
                                        ))}
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                    <HourDynamicTable hourConfiguration={hourConfiguration} />
                </div>
            </CardBody>
        </div>
    );
};

export default ClassroomScheduleTable;
