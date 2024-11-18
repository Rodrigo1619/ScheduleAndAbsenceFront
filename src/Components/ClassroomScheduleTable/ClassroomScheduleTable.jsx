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
    const [scheduleEmpty, setScheduleEmpty] = useState(true);
    const { token } = useUserContext();

        // Generador de colores (puedes modificar la paleta)
        const generateRandomColor = () => {
            const colors = [
                "bg-pastelPink", "bg-pastelOrange", "bg-pastelYellow", "bg-pastelGreen", "bg-pastelBlue",
                "bg-pastelMint", "bg-pastelPurple", "bg-pastelLavender", "bg-pastelPeach",
                "bg-pastelSky", "bg-pastelCoral", "bg-pastelLemon", "bg-pastelLilac", "bg-pastelAqua",
                "bg-pastelRose", "bg-pastelLime", "bg-pastelCream"
            ];
            let color;
            do {
                color = colors[Math.floor(Math.random() * colors.length)];
            } while (Object.values(subjectColorMap).includes(color));
            return color;
        };
    

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
                        setHourConfiguration(response[0].classroomConfigurations);
                        setScheduleEmpty(false);
                    } else if ( response === null) {
                        notification.warning({ message: "No se ha configurado las horas para el aula seleccionada" });
                        setHourConfiguration([]);
                        setSchedule([]);
                        setScheduleEmpty(true);
                    }
                } catch (error) {
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
                setClassPeriod(response);
            } catch (error) {
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

        const getClassroomSchedule = async () => {
            try {
                const response = await scheduleService.getScheduleByClassroomId(token, grade.id);
                if (response) {
                    notification.success({ message: "Horario de clases encontrado"
                        , placement: 'top', duration: 2
                     });
                    updateSchedule(response, initialSchedule);
                } else {
                    notification.info({ message: "No se encontró el horario de clases", 
                    placement: 'top', duration: 2
                     });
                    setSchedule(initialSchedule);
                }
            } catch (error) {
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
                        const timeSlot = `${schedule.classroomConfiguration.hourStart?.slice(0, 5)}-${schedule.classroomConfiguration.hourEnd?.slice(0, 5)}`;
                        const slotIndex = scheduleMapping[timeSlot];
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
                }
            });
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


    const TABLE_HEAD = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    const [selectedDay, setSelectedDay] = useState(TABLE_HEAD[0]); // Día seleccionado por defecto: Lunes

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    return (
        <div className={classes["generalCardContainer"]}>
            {/* Selector de día solo visible en dispositivos móviles */}
            <div className="block md:hidden mb-4 w-48 justify-center items-center mx-auto">
                    <label htmlFor="day-select" className="block text-sm font-bold mb-2">Seleccione un día:</label>
                    <select
                        id="day-select"
                        value={selectedDay}
                        onChange={handleDayChange}
                        className="w-full border border-gray-400 rounded px-2 py-1"
                    >
                        {TABLE_HEAD.map((day) => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
            <CardBody className="flex flex-col bg-white border-2 border-black border-opacity-75 overflow-auto px-2 py-1">
                <Typography className='font-masferrerTitle font-bold text-lg'>
                {grade?.grade ? `Horario de ${grade?.grade.name} - ${grade?.grade.shift.name}` : 
                "Horario del salón de clases"
                }
            </Typography>
                <div className="flex flex-row justify-center items-center mx-auto Mobile-390*844:hidden Mobile-280:hidden">
                    {/* Tabla completa para dispositivos grandes */}
                    <table className="table-auto text-left w-max Mobile-390*844:hidden Mobile-280:hidden">
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
                            {scheduleEmpty && (
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
                            {!scheduleEmpty && schedule.map((subject, index) => (
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
                {/* Tabla filtrada para dispositivos móviles */}

                <div className="md:hidden flex flex-row overflow-auto">
                <table className="table-auto text-left w-full overflow-auto">
                <thead>
                            <tr>
                                <th className="p-4 bg-transparent">
                                    <Typography className="font-masferrerTitle text-center text-xl font-bold">
                                        {selectedDay}
                                    </Typography>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduleEmpty && (
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
                            {!scheduleEmpty && schedule.map((subject, index) => (
                                subject.Recreo ? (
                                    <tr key={`recreo-${index}`}>
                                        <td className="p-4 bg-transparent">
                                            <div className="font-masferrer text-2xl font-bold border-2 px-14 py-2 text-center border-black">
                                                <Typography className="font-masferrerTitle text-base font-bold uppercase">
                                                    {subject.Recreo}
                                                </Typography>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={index}>
                                        <td key={index} className="p-4 bg-transparent mt-2">
                                            {subject[selectedDay].grade ? (
                                                <div className={`font-masferrer text-lg font-regular border-2 px-4 py-2 max-h-14 overflow-auto
                                                border-black ${getSubjectColor(subject[selectedDay].subject)}`}>
                                                    <Typography className="font-masferrerTitle font-bold text-center text-base">
                                                        {subject[selectedDay].subject}
                                                    </Typography>
                                                </div>
                                            ) : (
                                                <div className="font-masferrer text-base font-regular border-2 
                                                px-4 py-3 border-black bg-orange-400">
                                                    <div className="flex justify-center items-center mx-auto">
                                                        <Typography
                                                            className="font-masferrerTitle text-center text-lg font-bold"
                                                        >
                                                            LIBRE
                                                        </Typography>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
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
