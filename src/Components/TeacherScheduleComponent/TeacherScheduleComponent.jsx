import React, { useEffect, useState } from 'react';
import classes from './TeacherScheduleComponent.module.css';
import { Button, CardBody, Typography } from '@material-tailwind/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import HoursTable from '../Hours Table/HoursTable';
import { useUserContext } from '../../Context/userContext';
import { scheduleService } from '../../Services/scheduleService';
import { weekdayService } from '../../Services/weekdayService';
import { classroomService } from '../../Services/classroomService';
import { notification } from 'antd';
import { userService } from '../../Services/userService';
import { gradeService } from '../../Services/gradeService';

const TeacherScheduleComponent = ({ teacher, shift, year}) => {
    const [schedule, setSchedule] = useState([]);
    const [scheduleEmpty, setScheduleEmpty] = useState(true);
    const [grades, setGrades] = useState([]);
    const [weekdays, setWeekdays] = useState([]);
    const { token } = useUserContext();

    const defaultSubject = {
        teacher: "",
        subject: "",
        grade: "",
        shift: "",
        year: "",
    };

    const [subjectColors, setSubjectColors] = useState({});
    

    useEffect(() => {
        const colors = ["#ff6666", "#ffcc66", "#99cc66", "#66cccc", "#6699cc", "#cc66cc", "#ff66b2"];
        const uniqueGrades = [...new Set(grades.map(grade => grade.name))];
        const colorsMap = {};
        uniqueGrades.forEach((grade, index) => {
            colorsMap[grade] = colors[index % colors.length];
        });
        setSubjectColors(colorsMap);
    }, [grades]);

    useEffect(() => {
        const fetchWeekdays = async () => {
            try {
                const response = await weekdayService.getWeekdays(token);
                setWeekdays(response);
            } catch (error) {
                console.log("Error fetching weekdays: ", error);
            }
        };

        const fetchGrades = async () => {
            try {
                const response = await gradeService.getAllGrades(token);
                setGrades(response);
            } catch (error) {
                console.log("Error fetching grades: ", error);
            }
        };
        fetchWeekdays();
        fetchGrades();
    }, [token]);

    useEffect(() => {
        if (token && shift && year) {
            console.log("Initializing schedule...", teacher);
            initializeSchedule(token, shift, year, teacher);
        }
    }, [shift, year, token, teacher]);


    const initializeSchedule = (token, shift, year, teacher) => {
        const createDefaultEntry = (hour, weekday) => ({
            ...defaultSubject,
            hour,
            weekday
        });

        const initialSchedule = [
            {
                Lunes: { ...createDefaultEntry("1° hora", weekdays[0]?.id) },
                Martes: { ...createDefaultEntry("1° hora", weekdays[1]?.id) },
                Miércoles: { ...createDefaultEntry("1° hora", weekdays[2]?.id) },
                Jueves: { ...createDefaultEntry("1° hora", weekdays[3]?.id) },
                Viernes: { ...createDefaultEntry("1° hora", weekdays[4]?.id) }
            },
            {
                Lunes: { ...createDefaultEntry("2° hora", weekdays[0]?.id) },
                Martes: { ...createDefaultEntry("2° hora", weekdays[1]?.id) },
                Miércoles: { ...createDefaultEntry("2° hora", weekdays[2]?.id) },
                Jueves: { ...createDefaultEntry("2° hora", weekdays[3]?.id) },
                Viernes: { ...createDefaultEntry("2° hora", weekdays[4]?.id) }
            },
            {
                Lunes: { ...createDefaultEntry("3° hora", weekdays[0]?.id) },
                Martes: { ...createDefaultEntry("3° hora", weekdays[1]?.id) },
                Miércoles: { ...createDefaultEntry("3° hora", weekdays[2]?.id) },
                Jueves: { ...createDefaultEntry("3° hora", weekdays[3]?.id) },
                Viernes: { ...createDefaultEntry("3° hora", weekdays[4]?.id) }
            },
            {
                Lunes: { ...createDefaultEntry("4° hora", weekdays[0]?.id) },
                Martes: { ...createDefaultEntry("4° hora", weekdays[1]?.id) },
                Miércoles: { ...createDefaultEntry("4° hora", weekdays[2]?.id) },
                Jueves: { ...createDefaultEntry("4° hora", weekdays[3]?.id) },
                Viernes: { ...createDefaultEntry("4° hora", weekdays[4]?.id) }
            },
            {
                Lunes: { ...createDefaultEntry("5° hora", weekdays[0]?.id) },
                Martes: { ...createDefaultEntry("5° hora", weekdays[1]?.id) },
                Miércoles: { ...createDefaultEntry("5° hora", weekdays[2]?.id) },
                Jueves: { ...createDefaultEntry("5° hora", weekdays[3]?.id) },
                Viernes: { ...createDefaultEntry("5° hora", weekdays[4]?.id) }
            },
            {
                Lunes: { ...createDefaultEntry("6° hora", weekdays[0]?.id) },
                Martes: { ...createDefaultEntry("6° hora", weekdays[1]?.id) },
                Miércoles: { ...createDefaultEntry("6° hora", weekdays[2]?.id) },
                Jueves: { ...createDefaultEntry("6° hora", weekdays[3]?.id) },
                Viernes: { ...createDefaultEntry("6° hora", weekdays[4]?.id) }
            },
            {
                Lunes: { ...createDefaultEntry("7° hora", weekdays[0]?.id) },
                Martes: { ...createDefaultEntry("7° hora", weekdays[1]?.id) },
                Miércoles: { ...createDefaultEntry("7° hora", weekdays[2]?.id) },
                Jueves: { ...createDefaultEntry("7° hora", weekdays[3]?.id) },
                Viernes: { ...createDefaultEntry("7° hora", weekdays[4]?.id) }
            },
            {
                Lunes: { ...createDefaultEntry("8° hora", weekdays[0]?.id) },
                Martes: { ...createDefaultEntry("8° hora", weekdays[1]?.id) },
                Miércoles: { ...createDefaultEntry("8° hora", weekdays[2]?.id) },
                Jueves: { ...createDefaultEntry("8° hora", weekdays[3]?.id) },
                Viernes: { ...createDefaultEntry("8° hora", weekdays[4]?.id) }
            }
        ];

        const scheduleMapping = {
            "1° Hora": 0,
            "2° Hora": 1,
            "3° Hora": 2,
            "4° Hora": 3,
            "5° Hora": 4,
            "6° Hora": 5,
            "7° Hora": 6,
            "8° Hora": 7,
        };

        const getTeacherSchedule = async (teacher) => {
            console.log("token: ", token);
            console.log("shiftselected: ", shift);
            console.log("year: ", year);
            try {
                if (!shift) {
                    return;
                }
                const response = await scheduleService.getScheduleByUserIdShiftYear(token, teacher.id, shift.id, year);
                console.log("Response: ", response);
                if (response && Array.isArray(response)){
                    
                    // Toma los schedules que corresponden al shift y año seleccionado, necesito mapear ya que vienen varios dentro del objeto
                    const teacherSchedule = response
                    console.log("teacherSchedule: ", teacherSchedule);
                    updateSchedule(teacherSchedule, initialSchedule);
                    setScheduleEmpty(false);

                    notification.success({ message: "Horario obtenido correctamente" });
                } else if (response === null) {
                    notification.info({ message: "No se puede obtener el horario. No tiene ninguna clase asignada en el turno: " + shift.name });
                    setScheduleEmpty(true);
                }
            } catch (error) {
                console.log(error)
                notification.error({ message: "Error al obtener el horario del profesor" });
                setScheduleEmpty(true);
            }
        };

        const updateSchedule = (classroomSchedule, initialSchedule) => {
            classroomSchedule.forEach(entry => {
                // Verificar que entry y entry.schedules existan
                if (entry && entry.schedules) {
                    entry.schedules.forEach(schedule => {
                        const day = schedule.weekday.day; // "Lunes", "Martes", etc.
                        console.log("Day: ", day);
                        const timeSlot = schedule.classroomConfiguration.classPeriod.name; // "1° hora", "2° hora", etc.
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

        getTeacherSchedule(teacher);
    };

    const TABLE_HEAD = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    const [selectedDay, setSelectedDay] = useState(TABLE_HEAD[0]); // Día seleccionado por defecto: Lunes

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    return (
        <div className={classes["generalCardContainer"]}>
            <CardBody className="flex flex-col bg-white border-2 
            border-black border-opacity-75 px-2 py-1">
                <div className="flex flex-row justify-center mx-auto my-2">
                    <Typography className='font-masferrerTitle font-bold text-lg text-center'>
                        Horario de clases {shift?.name} - {year}
                    </Typography>
                </div>
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
                <div className="flex flex-row justify-center items-center mx-auto Mobile-390*844:hidden Mobile-280:hidden">
                {/* Tabla completa para dispositivos grandes */}
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
                                                // Different color for any subject that is not free
                                                <td key={idx} className="p-4 bg-transparent">
                                                    <div className="font-masferrer font-regular border-2
                                                px-4 py-2 border-black"
                                                        style={{ backgroundColor: subjectColors[subject[day].grade] }}
                                                    >
                                                        <div className="flex flex-col justify-center items-center mx-auto">
                                                        <Typography
                                                            className="font-masferrerTitle text-center text-sm font-bold"
                                                        >
                                                            {subject[day].grade}
                                                        </Typography>
                                                        <Typography
                                                                className="font-masferrerTitle font-bold text-center text-xs"
                                                            >
                                                                {subject[day].subject}
                                                            </Typography>
                                                            </div>
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
                    {
                        scheduleEmpty ? (
                            <>
                            </>
                        ) : (
                            <HoursTable />
                        )
                    }
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
                            {schedule.map((subject, index) => (
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
                                                <div className="font-masferrer font-regular border-2
                                                px-4 py-2 border-black"
                                                        style={{ backgroundColor: subjectColors[subject[selectedDay].grade] }}
                                                    >
                                                    <div className="flex flex-col justify-center items-center mx-auto">
                                                        <Typography className="font-masferrerTitle font-bold text-center text-sm">
                                                            {subject[selectedDay].grade}
                                                        </Typography>
                                                        <Typography className="font-masferrerTitle font-bold text-center text-xs">
                                                            {subject[selectedDay].subject}
                                                        </Typography>
                                                    </div>
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
                    <HoursTable />
                </div>
            </CardBody>
        </div>
    );
};

export default TeacherScheduleComponent;