import React, { useEffect, useState } from 'react';
import classes from './AddScheduleTable.module.css';
import { Button, CardBody, Tooltip, Typography } from '@material-tailwind/react';
import { ExclamationTriangleIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import HoursTable from '../Hours Table/HoursTable';
import { useUserContext } from '../../Context/userContext';
import { scheduleService } from '../../Services/scheduleService';
import { weekdayService } from '../../Services/weekdayService';
import { classroomConfigurationService } from '../../Services/classroomConfigurationService';
import { notification } from 'antd';
import { classPeriodService } from '../../Services/classPeriodService';
import HourDynamicTable from '../HourDynamicTable/HourDynamicTable';

const AddScheduleTable = ({ teacher, subject, grade, shift, year }) => {
    const [teacherSelected, setTeacherSelected] = useState("");
    const [subjectSelected, setSubjectSelected] = useState("");
    const [gradeSelected, setGradeSelected] = useState("");
    const [shiftSelected, setShiftSelected] = useState("");
    const [yearSelected, setYearSelected] = useState("");
    const [schedule, setSchedule] = useState([]);
    const [hourConfiguration, setHourConfiguration] = useState([]);
    const [classPeriod, setClassPeriod] = useState([]);
    const [scheduleToCreate, setScheduleToCreate] = useState([]);
    const [scheduleToDelete, setScheduleToDelete] = useState([]);
    const [weekdays, setWeekdays] = useState([]);
    const { token } = useUserContext();
    const [warnings, setWarnings] = useState({});

    const defaultSubject = {
        teacher: "",
        subject: "",
        grade: "",
        shift: "",
        year: "",
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
        if (teacher && subject && grade && shift && year) {
            setTeacherSelected(teacher);
            setSubjectSelected(subject);
            setGradeSelected(grade);
            setShiftSelected(shift);
            setYearSelected(year);
        }
    }, [teacher, subject, grade, shift, year]);



    useEffect(() => {

        if (hourConfiguration.length > 0 && classPeriod.length > 0) {
            initializeSchedule(token, hourConfiguration, classPeriod);
        } else {
            console.log("classPeriod: ", classPeriod);
            console.log("Condition not met");
        }
    }, [grade, hourConfiguration, classPeriod]);

    useEffect(() => {
        setWarnings({});
    }, [schedule]);



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
                                hourStart: schedule?.classroomConfiguration.hourStart,
                                hourEnd: schedule?.classroomConfiguration.hourEnd,
                                id: schedule.id,
                                classroomConfigurationId: schedule.classroomConfiguration.id
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

    const checkTeacherConflict = async (teacherId, hourStart, hourEnd, weekdayId, token, yearSelected, gradeSelected, classPeriodId, classroomConfigurationId) => {
        try {
            // Obtener los horarios del profesor
            const schedule = await scheduleService.getScheduleByUserId(token, teacherId, yearSelected);

    
            const conflict = schedule.some((entry) =>
            (entry.schedules.some((sched) => {
                    return sched.classroomConfiguration.classPeriod.id === classPeriodId &&
                        sched.weekday.id === weekdayId &&
                        sched.classroomConfiguration.id !== classroomConfigurationId;
                })) && 
            (entry.classroom.shift.id === shiftSelected.id &&
                entry.classroom.id !== gradeSelected.id)
            );
    
            return conflict;
        } catch (error) {
            console.error('Error checking teacher conflict:', error);
            return false; // En caso de error, devuelve falso para no bloquear la asignación
        }
    };
    

    const handleAddGradeSubjectToSchedule = async (e, day, index, hourStart, hourEnd) => {
        e.preventDefault();
        console.log("Schedule to delete: ", scheduleToDelete);
        console.log("hourConfiguration: ", hourConfiguration);
        e.preventDefault();
        const weekdayId = weekdays.find(weekday => weekday.day === day).id;
        const teacherId = teacherSelected.id;
        const classroomConfigurationId = hourConfiguration.find(block => block.hourStart === hourStart && block.hourEnd === hourEnd).id;
        const classPeriod = hourConfiguration.find(block => block.hourStart === hourStart && block.hourEnd === hourEnd).classPeriod.id;
        const conflict = await checkTeacherConflict(teacherId, hourStart, hourEnd, weekdayId, token, yearSelected, gradeSelected, classPeriod, classroomConfigurationId);
    if (conflict) {
        setWarnings(prevWarnings => ({
            ...prevWarnings,
            [`${day}-${index}`]: 'El profesor ya está asignado a otra clase en esta hora.'
        }));
        } else {

            const updatedSchedule = schedule.map((entry, idx) => {
                if (idx === index) {
                    return {
                        ...entry,
                        [day]: {
                            teacher: teacherSelected.name,
                            subject: subjectSelected.name,
                            grade: gradeSelected.name,
                            shift: shiftSelected.name,
                            year: yearSelected,
                            hourStart: hourStart,
                            hourEnd: hourEnd,
                            weekday: weekdays.find(weekday => weekday.day === day).id,
                            classroomConfigurationId: hourConfiguration.find(block => block.hourStart === hourStart && block.hourEnd === hourEnd).id
                        }
                    };
                }
                return entry;
            });

            setSchedule(updatedSchedule);

            setScheduleToCreate(prevScheduleToCreate => [
                ...prevScheduleToCreate,
                {
                    teacher: teacherSelected.id,
                    subject: subjectSelected.id,
                    grade: gradeSelected.id,
                    shift: shiftSelected.id,
                    year: yearSelected,
                    hourStart: hourStart.slice(0, 5),
                    hourEnd: hourEnd.slice(0, 5),
                    weekday: weekdays.find(weekday => weekday.day === day).id,
                    classroomConfigurationId: hourConfiguration.find(block => block.hourStart === hourStart && block.hourEnd === hourEnd).id
                }
            ]);

            console.log("Schedule updated: ", updatedSchedule);
        }
    };

    const renderWarningIcon = (day, index) => {
        const warningKey = `${day}-${index}`;
        return warnings[warningKey] ? (
            <Tooltip content={warnings[warningKey]}>
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500
                hover:text-yellow-700 cursor-pointer
                " />
            </Tooltip>
        ) : null;
    };

    const handleDeleteSubjectFromSchedule = (e, day, index, hourStart, hourEnd) => {
        e.preventDefault();

        // Buscar los datos del horario a eliminar en la lista de scheduleToCreate, 
        // si coincide, eliminarlo de ahi tambien

        const updatedSchedule = schedule.map((entry, idx) => {
            if (idx === index) {
                return {
                    ...entry,
                    [day]: {
                        teacher: "",
                        subject: "",
                        grade: "",
                        shift: "",
                        year: "",
                        hourStart: hourStart,
                        hourEnd: hourEnd,
                        weekday: weekdays.find(weekday => weekday.day === day).id,
                        classroomConfigurationId: hourConfiguration.find(block => block.hourStart === hourStart && block.hourEnd === hourEnd).id
                    }
                };
            }
            if (scheduleToCreate.length > 0) {

                const scheduleIndex = scheduleToCreate.findIndex(schedule =>
                    schedule.hourStart === hourStart &&
                    schedule.hourEnd === hourEnd &&
                    schedule.weekday === weekdays.find(weekday => weekday.day === day).id
                );
                if (scheduleIndex !== -1) {
                    scheduleToCreate.splice(scheduleIndex, 1);
                }

            }

            return entry;
        });

        setSchedule(updatedSchedule);

        if (schedule[index][day].id) {
            setScheduleToDelete(prevScheduleToDelete => [
                ...prevScheduleToDelete,
                {
                    id: schedule[index][day].id
                }
            ]);
        }

        console.log("Schedule updated: ", updatedSchedule);
        console.log("schedule to create", scheduleToCreate);
    };

    const deleteSchedule = async (scheduleToDelete) => {
        try {
            console.log("Deleting schedule...");

            const schedulesIdsDelete = scheduleToDelete.map(schedule => schedule.id);
            const response = await scheduleService.deleteSchedule(schedulesIdsDelete, token);
            console.log("Schedule deleted: ", response);
            setScheduleToDelete([]);
            notification.success({
                message: 'Éxito',
                description: 'El horario se ha borrado con éxito',
                placement: 'top',
                duration: 4,
            });
        } catch (error) {
            console.log("Error creating schedule: ", error);
            notification.error({
                message: 'Error',
                description: 'Hubo un error al borrar el horario',
                placement: 'top',
                duration: 4,
            });
        }
    };

    const createSchedule = async (scheduleToCreate) => {
        try {
            console.log("Creating schedule...");
            const schedulesCreate = {
                "schedules": scheduleToCreate.map(schedule => ({
                    id_user: schedule.teacher,
                    id_subject: schedule.subject,
                    id_classroomConfiguration: schedule.classroomConfigurationId,
                    id_weekday: schedule.weekday,
                    year: schedule.year
                }))
            };

            console.log("Schedules to create: ", schedulesCreate);

            const response = await scheduleService.createSchedule(token, schedulesCreate);
            console.log("Schedule created: ", response);
            setScheduleToCreate([]);
            notification.success({
                message: 'Éxito',
                description: 'El horario se ha creado con éxito',
                placement: 'top',
                duration: 4,
            });
        } catch (error) {
            console.log("Error creating schedule: ", error);
            setScheduleToCreate([]);
            notification.error({
                message: 'Error',
                description: 'Hubo un error al crear el horario',
                placement: 'top',
                duration: 4,
            });
        }
    };

    const saveSchedule = async (scheduleToCreate, scheduleToDelete) => {

        try {

            if (scheduleToDelete.length > 0) {
                deleteSchedule(scheduleToDelete);
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

            if (scheduleToCreate.length > 0) {
                createSchedule(scheduleToCreate);
            }
        }
        catch (error) {
            console.log("Error saving schedule: ", error);
            notification.error({
                message: 'Error',
                description: 'Hubo un error al guardar el horario',
                placement: 'top',
                duration: 4,
            });
        }
    };



    const handleSaveSchedule = async () => {
        console.log("Schedule to create: ", scheduleToCreate);
        console.log("Schedule to delete: ", scheduleToDelete);
        if (scheduleToCreate.length > 0 || scheduleToDelete.length > 0) {
            saveSchedule(scheduleToCreate, scheduleToDelete);
        }
    };


    const TABLE_HEAD = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    return (
        <div className={classes["generalCardContainer"]}>
            <CardBody className="flex flex-col bg-white border-2 border-black border-opacity-75 px-2 py-1">
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
                                            <td key={idx} className="p-4 bg-transparent">
                                                {subject[day].teacher ? (
                                                    <div className="font-masferrer text-lg font-regular border-2 
                                            px-4 py-2 border-black">
                                                        <div className="flex justify-center items-center mx-auto">
                                                            <div className="flex flex-col justify-center items-center mx-auto">
                                                                <Typography
                                                                    className="font-masferrerTitle font-bold text-center text-sm"
                                                                >
                                                                    {subject[day].teacher}
                                                                </Typography>
                                                                <Typography
                                                                    className="font-masferrerTitle font-bold text-center text-sm"
                                                                >
                                                                    {subject[day].subject}
                                                                </Typography>
                                                            </div>
                                                            <Button
                                                                color="lightBlue"
                                                                buttonType="filled"
                                                                size="regular"
                                                                rounded={false}
                                                                block={false}
                                                                iconOnly={false}
                                                                onClick={(e) => {
                                                                    handleDeleteSubjectFromSchedule(e, day, index, subject[day].hourStart, subject[day].hourEnd);
                                                                }}
                                                                ripple="light"
                                                                className="w-auto bg-red-300 hover:bg-red-700 text-white font-bold py-2 px-2 rounded mx-2"
                                                            >
                                                                <TrashIcon className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center font-masferrer text-lg font-regular border-2 
                                            px-6 py-2 border-black">
                                                        <Button
                                                            color="lightBlue"
                                                            buttonType="filled"
                                                            size="regular"
                                                            rounded={false}
                                                            block={false}
                                                            iconOnly={false}
                                                            ripple="light"
                                                            className="w-auto justify-center text-center mx-auto 
                                                bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                                                            onClick={(e) => {
                                                                handleAddGradeSubjectToSchedule(e, day, index, subject[day].hourStart, subject[day].hourEnd);
                                                            }}
                                                        >
                                                            <PlusIcon className="h-5 w-5" />
                                                        </Button>
                                                        {renderWarningIcon(day, index)}
                                                    </div>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
                    <HourDynamicTable hourConfiguration={hourConfiguration} />
                </div>
                <div className="flex flex-row justify-end items-center mx-auto">
                    <Button
                        className="w-auto bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg"
                    >
                        Cancelar
                    </Button>
                    <Button
                        className="w-auto mx-4 bg-blueMasferrer bg-opacity-85 hover:bg-opacity-100 
                text-white font-bold py-4 px-4 rounded-lg"
                        onClick={handleSaveSchedule}
                    >
                        Guardar
                    </Button>
                </div>
            </CardBody>
        </div>
    );
};

export default AddScheduleTable;
