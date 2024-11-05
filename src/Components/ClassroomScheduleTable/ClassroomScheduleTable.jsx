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

    // Generador de colores (puedes modificar la paleta)
    const generateRandomColor = () => {
        const colors = [
            'bg-blue-400', 'bg-yellow-400', 'bg-green-400', 'bg-red-400',
            'bg-purple-400', 'bg-pink-400', 'bg-gray-400', 'bg-indigo-400',
            'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-500',
            'bg-purple-500', 'bg-pink-500', 'bg-gray-500', 'bg-indigo-500',
            'bg-blue-600', 'bg-yellow-600', 'bg-green-600', 'bg-red-600',
            'bg-purple-600', 'bg-pink-600', 'bg-gray-600', 'bg-indigo-600',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };


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

     // Diccionario para almacenar los colores asignados a cada materia
     const subjectColorMap = {};

     // Función para obtener el color de una materia
     const getSubjectColor = (subject) => {
         if (!subjectColorMap[subject]) {
             subjectColorMap[subject] = generateRandomColor();
         }
         return subjectColorMap[subject];
     };


    useEffect(() => {

        if (grade?.id && token) {
            const fetchHourConfiguration = async () => {
                try {
                    const response = await classroomConfigurationService.getClassroomConfigurationById(token, grade.id);
                    if(response){
                        console.log("Hour configuration: ", response[0].classroomConfigurations);
                        setHourConfiguration(response[0].classroomConfigurations);
                    } else if ( response === null) {
                        console.log("No hour configuration found for the classroom");
                        notification.warning({ message: "No se ha configurado las horas para el aula seleccionada" });
                        setHourConfiguration([]);
                        setSchedule([]);
                    }
                } catch (error) {
                    console.log("Error fetching hour configuration: ", error);
                    notification.warning({ message: "Error al obtener configuracion de horas del salon seleccionado" });
                    setHourConfiguration([]);
                    setSchedule([]);
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
                    notification.success({ message: "Horario de clases encontrado"
                        , placement: 'top', duration: 2
                     });
                    updateSchedule(response, initialSchedule);
                } else {
                    console.log("No schedule found for the teacher");
                    notification.info({ message: "No se encontró el horario de clases", 
                    placement: 'top', duration: 2
                     });
                    setSchedule(initialSchedule);
                }
            } catch (error) {
                console.log("Error getting teacher schedule: ", error);
                notification.error({
                    message: 'Error',
                    description: 'Hubo un error al obtener el horario del profesor',
                    placement: 'top',
                    duration: 2,
                });
                setSchedule(initialSchedule);       
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
        if (hourConfiguration.length > 0) {
        getClassroomSchedule();
        }
        else {
            setSchedule([]);
            updateSchedule([], schedule);
        }
        console.log(grade);
    };

    useEffect(() => {
        console.log("Schedule: ", schedule);
    }, [schedule]);

    const TABLE_HEAD = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    return (
        <div className={classes["generalCardContainer"]}>
            <CardBody className="flex flex-col bg-white border-2 border-black border-opacity-75 px-2 py-1">
                <Typography className='font-masferrerTitle font-bold text-lg'>
                {grade?.grade ? `Horario de ${grade?.grade.name} - ${grade?.grade.shift.name}` : 
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
                            {schedule.length === 0 && (
                                <tr>
                                    <td colSpan={TABLE_HEAD.length} className="p-4 bg-transparent">
                                        <div className="font-masferrer text-2xl font-bold border-2
                                    px-14 py-2 text-center border-black">
                                            <Typography
                                                className="font-masferrerTitle text-lg font-bold uppercase"
                                            >
                                                No hay horario
                                            </Typography>
                                        </div>
                                    </td>
                                </tr>
                            )}
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
                                                <td key={idx} className="p-4 bg-transparent">
                                                    <div className={`font-masferrer text-lg font-regular border-2 px-6 py-3 border-black ${getSubjectColor(subject[day].subject)}`}>
                                                        <Typography className="font-masferrerTitle text-center text-lg font-bold">
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
