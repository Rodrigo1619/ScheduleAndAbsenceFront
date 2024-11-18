import React, { useEffect, useRef, useState } from 'react';
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
import { toast, Toaster } from 'sonner';
import { AiOutlineLoading } from 'react-icons/ai';

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
    const [isScheduleCreated, setIsScheduleCreated] = useState(false);
    const [scheduleMapping, setScheduleMapping] = useState({});

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
                    if(response){
                        setHourConfiguration(response[0].classroomConfigurations);
                    } else if ( response === null) {
                        notification.warning({ message: "No se ha configurado las horas para el aula seleccionada" });
                        setHourConfiguration([]);
                        setSchedule([]);
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
        }
    }, [grade, hourConfiguration, classPeriod]);

    useEffect(() => {
        setWarnings({});
    }, [schedule]);

    const scheduleMappingRef = useRef({});

    const updateSchedule = (classroomSchedule, initialSchedule) => {
        classroomSchedule.forEach(entry => {
            if (entry && entry.schedules) {
                entry.schedules.forEach(schedule => {
                    const day = schedule.weekday.day;
                    const timeSlot = `${schedule.classroomConfiguration.hourStart?.slice(0, 5)}-${schedule.classroomConfiguration.hourEnd?.slice(0, 5)}`;
                    const slotIndex = scheduleMappingRef.current[timeSlot];
                    if (slotIndex !== undefined) {
                        initialSchedule[slotIndex][day] = {
                            ...initialSchedule[slotIndex][day],
                            teacher: schedule?.user_x_subject?.teacher.name,
                            subject: schedule?.user_x_subject?.subject.name,
                            grade: entry?.classroom.grade?.name,
                            shift: entry?.classroom.grade.shift?.name,
                            year: entry?.classroom?.year,
                            hourStart: schedule?.classroomConfiguration.hourStart,
                            hourEnd: schedule?.classroomConfiguration.hourEnd,
                            id: schedule.id,
                            classroomConfigurationId: schedule.classroomConfiguration.id
                        };
                    }
                });
            } else {
            }
        });
        setSchedule([...initialSchedule]);
    };

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

        scheduleMappingRef.current = sortedHourConfiguration.reduce((acc, block, index) => {
            if (block.classPeriod.id !== recreoId) {
                acc[`${block.hourStart?.slice(0, 5)}-${block.hourEnd?.slice(0, 5)}`] = index;
            }
            return acc;
        }, {});

        setScheduleMapping(scheduleMapping);

        const getClassroomSchedule = async () => {
            const loadingToast = toast('Cargando...', {
                icon: <AiOutlineLoading className="animate-spin" />,
            });
            try {
                const response = await scheduleService.getScheduleByClassroomId(token, grade.id);
                if (response === null) {
                    notification.warning({ message: "No hay un horario de clases creado para el aula seleccionada" });
                    setIsScheduleCreated(false);
                }
                else if (response) {
                    notification.success({ message: "Horario de clases encontrado" });
                    setIsScheduleCreated(true);
                    updateSchedule(response, initialSchedule);

                } else {
                    notification.info({ message: "No se encontró el horario de clases" });
                    setIsScheduleCreated(false);
                    setSchedule(initialSchedule);
                }
            } catch (error) {
                if (error.message === "Error: 404") {
                    notification.info({ message: "No se encontró el horario de clases" });
                    setIsScheduleCreated(false);
                    setSchedule(initialSchedule);
                } else {
                    notification.error({
                        message: 'Error',
                        description: 'Hubo un error al obtener el horario del profesor',
                        placement: 'top',
                        duration: 4,
                    });
                    setIsScheduleCreated(false);
                    setSchedule(initialSchedule);
                }
            } finally {
                toast.dismiss(loadingToast);
            }
        };

        getClassroomSchedule();
    };

    const checkTeacherConflict = async (teacherId, hourStart, hourEnd, weekdayId, token, yearSelected, gradeSelected, classPeriodId, classroomConfigurationId) => {
              // Obtener los horarios del profesor

            const schedule = await scheduleService.getScheduleByUserId(token, teacherId, yearSelected);

              const conflict = schedule.some((entry) =>

                   entry.schedules.some((sched) => {

                        const schedStart = sched.classroomConfiguration.hourStart;

                         const schedEnd = sched.classroomConfiguration.hourEnd;

                          return  sched.classroomConfiguration.id !== classroomConfigurationId &&

                                sched.weekday.id === weekdayId &&

                                 ((schedStart <= hourStart && schedEnd > hourStart) ||

                                      (schedStart < hourEnd && schedEnd >= hourEnd) ||

                                       (schedStart >= hourStart && schedEnd <= hourEnd) ||

                                        (schedStart === hourStart && schedEnd === hourEnd));

                    })

            );

            return conflict;

    };

    

    const handleAddGradeSubjectToSchedule = async (e, day, index, hourStart, hourEnd) => {
        e.preventDefault();
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
};

    const deleteSchedule = async (scheduleToDelete) => {
        const loadingToast = toast('Cargando...', {
            icon: <AiOutlineLoading className="animate-spin" />,
        });
        try {
            const schedulesIdsDelete = scheduleToDelete.map(schedule => schedule.id);
            const response = await scheduleService.deleteSchedule(schedulesIdsDelete, token);
            setScheduleToDelete([]);
            notification.success({
                message: 'Éxito',
                description: 'El horario se ha borrado con éxito',
                placement: 'top',
                duration: 4,
            });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Hubo un error al borrar el horario',
                placement: 'top',
                duration: 4,
            });
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const createSchedule = async (scheduleToCreate) => {
        const loadingToast = toast('Cargando...', {
            icon: <AiOutlineLoading className="animate-spin" />,
        });
        try {
            const schedulesCreate = {
                "schedules": scheduleToCreate.map(schedule => ({
                    id_user: schedule.teacher,
                    id_subject: schedule.subject,
                    id_classroomConfiguration: schedule.classroomConfigurationId,
                    id_weekday: schedule.weekday,
                }))
            };

            const response = await scheduleService.createSchedule(token, schedulesCreate);
            setScheduleToCreate([]);
            notification.success({
                message: 'Éxito',
                description: 'El horario se ha creado con éxito',
                placement: 'top',
                duration: 4,
            });

            // Fetch the updated schedule from the server and update the state
            const updatedSchedule = await scheduleService.getScheduleByClassroomId(token, grade.id);
            updateSchedule(updatedSchedule, schedule);
        } catch (error) {
            if(error.message === "Error: 409"){
                setScheduleToCreate([]);
                notification.error({
                    message: 'Error',
                    description: 'El profesor ya tiene asignada una clase en esta hora',
                    placement: 'top',
                    duration: 4,
                });
            } else {
                setScheduleToCreate([]);
                notification.error({
                    message: 'Error',
                    description: 'Hubo un error al crear el horario',
                    placement: 'top',
                    duration: 4,
                });
            }
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const createAndDeleteSchedule = async (scheduleToCreate, scheduleTodelete) => {
        const loadingToast = toast('Cargando...', {
            icon: <AiOutlineLoading className="animate-spin" />,
        });
        try {
            const schedulesUpdate = {
                deleteList: scheduleTodelete.map(schedule => schedule.id),
                newSchedules: scheduleToCreate.map(schedule => ({
                    id_user: schedule.teacher,
                    id_subject: schedule.subject,
                    id_classroomConfiguration: schedule.classroomConfigurationId,
                    id_weekday: schedule.weekday,
                }))
            };

            const response = await scheduleService.updateSchedule(token, schedulesUpdate);
            setScheduleToCreate([]);
            setScheduleToDelete([]);
            notification.success({
                message: 'Éxito',
                description: 'El horario se ha actualizado con éxito',
                placement: 'top',
                duration: 4,
            });

            // Fetch the updated schedule from the server and update the state
            const updatedSchedule = await scheduleService.getScheduleByClassroomId(token, grade.id);
            updateSchedule(updatedSchedule, schedule);
        } catch (error) {
            if(error.message === "Error: 409"){
                setScheduleToCreate([]);
                setScheduleToDelete([]);
                notification.error({
                    message: 'Error',
                    description: 'El profesor ya tiene asignada una clase en esta hora',
                    placement: 'top',
                    duration: 4,
                });
            } else {
                setScheduleToCreate([]);
                setScheduleToDelete([]);
                notification.error({
                    message: 'Error',
                    description: 'Hubo un error al actualizar el horario',
                    placement: 'top',
                    duration: 4,
                });
            }
        } finally {
            toast.dismiss(loadingToast);
        }
    };

    const saveSchedule = async (scheduleToCreate, scheduleToDelete) => {
        try {
            if (scheduleToDelete.length > 0 && scheduleToCreate.length > 0) {
                if (isScheduleCreated) {
                    await createAndDeleteSchedule(scheduleToCreate, scheduleToDelete);
                }
            } else if (scheduleToDelete.length > 0 && scheduleToCreate.length === 0) {
                await deleteSchedule(scheduleToDelete);
            } else if (scheduleToDelete.length === 0 && scheduleToCreate.length > 0) {
                await createSchedule(scheduleToCreate);
            }
            initializeSchedule(token, hourConfiguration, classPeriod);
        }
        catch (error) {
            notification.error({
                message: 'Error',
                description: 'Hubo un error al guardar el horario',
                placement: 'top',
                duration: 4,
            });
        } 
};


const handleSaveSchedule = async () => {
    saveSchedule(scheduleToCreate, scheduleToDelete);    
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
            <CardBody className="flex flex-col bg-white border-2 border-black border-opacity-75 overflow-auto px-2 py-1 mx-4">
                <Toaster />
                {/* Tabla completa para dispositivos grandes */}
                <div className="hidden md:flex flex-row justify-center items-center mx-auto ">
                    <table className="table-auto text-left w-max">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head, index) => (
                                    <th key={index} className="p-4 bg-transparent">
                                        <div className="font-masferrer text-xl font-regular border-2 px-14 py-2 border-black">
                                            <Typography className="font-masferrerTitle text-center text-xl font-bold">
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
                                            <div className="font-masferrer text-2xl font-bold border-2 px-14 py-2 text-center border-black">
                                                <Typography className="font-masferrerTitle text-lg font-bold uppercase">
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
                                                    <div className="font-masferrer text-lg font-regular border-2 px-4 py-2 border-black">
                                                        <div className="flex justify-center items-center mx-auto">
                                                            <div className="flex flex-col justify-center items-center mx-auto">
                                                                <Typography className="font-masferrerTitle font-bold text-center text-sm">
                                                                    {subject[day].teacher}
                                                                </Typography>
                                                                <Typography className="font-masferrerTitle font-bold text-center text-sm">
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
                                                    <div className="flex items-center justify-center font-masferrer text-lg font-regular border-2 px-6 py-2 border-black">
                                                        <Button
                                                            color="lightBlue"
                                                            buttonType="filled"
                                                            size="regular"
                                                            rounded={false}
                                                            block={false}
                                                            iconOnly={false}
                                                            ripple="light"
                                                            className="w-auto justify-center text-center mx-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
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
                                        <td className="p-4 bg-transparent">
                                            {subject[selectedDay].teacher ? (
                                                <div className="flex flex-row font-masferrer text-lg font-regular border-2 px-1 py-1 border-black">
                                                    <div className="flex flex-col justify-center items-center mx-auto">
                                                        <Typography className="font-masferrerTitle font-bold text-center text-xs">
                                                            {subject[selectedDay].teacher}
                                                        </Typography>
                                                        <Typography className="font-masferrerTitle font-bold text-center text-xs">
                                                            {subject[selectedDay].subject}
                                                        </Typography>
                                                    </div>
                                                    <Button
                                                                color="lightBlue"
                                                                buttonType="filled"
                                                                size="small"
                                                                rounded={false}
                                                                block={false}
                                                                iconOnly={false}
                                                                onClick={(e) => {
                                                                    handleDeleteSubjectFromSchedule(e, selectedDay, index, subject[selectedDay].hourStart, subject[selectedDay].hourEnd);
                                                                }}
                                                                ripple="light"
                                                                className="w-auto h-fit justify-center m-auto bg-red-300 hover:bg-red-700 text-white font-bold rounded-lg py-2 px-2 mx-2"
                                                            >
                                                                <TrashIcon className="h-2 w-2" />
                                                            </Button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center font-masferrer text-lg font-regular border-2 px-6 py-2 border-black">
                                                    <Button
                                                        color="lightBlue"
                                                        buttonType="filled"
                                                        size="regular"
                                                        rounded={false}
                                                        block={false}
                                                        iconOnly={false}
                                                        ripple="light"
                                                        className="w-auto justify-center text-center mx-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                                                        onClick={(e) => {
                                                            handleAddGradeSubjectToSchedule(e, selectedDay, index, subject[selectedDay].hourStart, subject[selectedDay].hourEnd);
                                                        }}
                                                    >
                                                        <PlusIcon className="h-5 w-5" />
                                                    </Button>
                                                    {renderWarningIcon(selectedDay, index)}
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
                <div className="flex flex-row justify-end items-center mx-auto">
                    <Button
                        className="w-auto mx-4 bg-blueMasferrer bg-opacity-85 hover:bg-opacity-100 text-white font-bold py-4 px-4 rounded-lg"
                        onClick={handleSaveSchedule}>
                        Guardar
                    </Button>
                </div>
            </CardBody>
        </div>
    );
};

export default AddScheduleTable;