import React, { useEffect, useState, useRef } from 'react';
import classes from './AddHourConfigurationTable.module.css';
import { Button, CardBody, Typography, Select, Option } from '@material-tailwind/react';
import HourConfigurationTable from '../HourConfigurationTable/HourConfigurationTable';
import { useUserContext } from '../../Context/userContext';
import { weekdayService } from '../../Services/weekdayService';
import { classPeriodService } from '../../Services/classPeriodService';
import { classroomConfigurationService } from '../../Services/classroomConfigurationService';
import { notification } from 'antd';

const AddHourConfigurationTable = ({ classroom, shift, year, edit }) => {
    const [classroomSelected, setClassroomSelected] = useState("");
    const [shiftSelected, setShiftSelected] = useState("");
    const [yearSelected, setYearSelected] = useState("");
    const [schedule, setSchedule] = useState([]);
    const [initialSchedule, setInitialSchedule] = useState([]);
    const [weekdays, setWeekdays] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [periodSlots, setPeriodSlots] = useState([]);
    const [visibleSlots, setVisibleSlots] = useState([]);
    const [deletedBlocks, setDeletedBlocks] = useState([]);
    const [success, setSuccess] = useState(false);
    const [initialLength, setInitialLength] = useState(0);
    const [haveClassroomConfig, setHaveClassroomConfig] = useState(false);
    const { token } = useUserContext();
    const hourConfigTableRef = useRef(null);

    const defaultSubjects = [
        { id: 1, inicio: "07:00", fin: "07:40", isHidden: false },
        { id: 2, inicio: "07:40", fin: "08:20", isHidden: false },
        { id: 3, inicio: "08:20", fin: "08:50", isHidden: false },
        { id: 4, inicio: "08:50", fin: "09:30", isHidden: false },
        { id: 5, inicio: "09:30", fin: "10:10", isHidden: false },
        { id: 6, inicio: "10:10", fin: "10:50", isHidden: false },
        { id: 7, inicio: "10:50", fin: "11:05", isHidden: false },
        { id: 8, inicio: "11:05", fin: "11:45", isHidden: false },
        { id: 9, inicio: "11:45", fin: "12:20", isHidden: false },
        { id: 10, inicio: "12:20", fin: "13:00", isHidden: false },
    ];


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
        if (token) {
            const fetchPeriodSlots = async () => {
                try {
                    const response = await classPeriodService.getClassPeriods(token);
                    setPeriodSlots(response);
                } catch (error) {
                    console.log("Error fetching class periods: ", error);
                }
            };
            fetchPeriodSlots();
        }
    }, [token]);

    useEffect(() => {
        // Update timeSlots whenever schedule changes
        const updatedTimeSlots = schedule.map(block => ({
            id: block.id,
            inicio: block.hourStart,
            fin: block.hourEnd,
            isHidden: block.isHidden || false
        }));
        setTimeSlots(updatedTimeSlots);
    }, [schedule]);


    useEffect(() => {
        console.log("Initial schedule: ", initialSchedule);
    }, [initialSchedule]);

    useEffect(() => {
        console.log("classrooms" , classroom);
    }
    , [classroom]);

    const fetchClassroomConfiguration = async () => {
        try {
            const response = await classroomConfigurationService.getAllByClassroomId(token, classroom);
            console.log("Response: ", response);
            if (response && response[0] && response[0].classroomConfigurations.length > 0) {
                const mappedSchedule = response[0].classroomConfigurations
                    .map((config, index) => ({
                        id: config.id,
                        hourStart: config.hourStart.slice(0, 5),
                        hourEnd: config.hourEnd.slice(0, 5),
                        classPeriodId: config.classPeriod.id,
                        type: config.classPeriod.name === "RECREO" ? "Recreo" : "Clase",
                        isRecreo: config.classPeriod.name === "RECREO"
                    }))
                    .sort((a, b) => a.hourStart.localeCompare(b.hourStart));

                setSchedule(mappedSchedule);
                setInitialSchedule(
                    response[0].classroomConfigurations.map(config => ({
                        id: config.id,
                        hourStart: config.hourStart.slice(0, 5),
                        hourEnd: config.hourEnd.slice(0, 5),
                        classPeriodId: config.classPeriod.id,
                        type: config.classPeriod.name === "RECREO" ? "Recreo" : "Clase",
                        isRecreo: config.classPeriod.name === "RECREO"
                    }))
                );
                console.log("Mapped schedule: ", mappedSchedule);
                setHaveClassroomConfig(true);
                setInitialLength(mappedSchedule.length - 1);
                setVisibleSlots(new Array(mappedSchedule.length).fill(true));
                setTimeSlots(response[0].classroomConfigurations.map(config => ({
                    inicio: config.hourStart,
                    fin: config.hourEnd
                })));
            } else {
                // Use defaultSubjects if no classroom configuration is found
                const initialSchedule = defaultSubjects.map((subject, index) => ({
                    hourStart: subject.inicio,
                    hourEnd: subject.fin,
                    type: "Clase",
                }));

                setSchedule(initialSchedule);
                setHaveClassroomConfig(false);
                setInitialLength(initialSchedule.length - 1);
                setVisibleSlots(new Array(initialSchedule.length).fill(true));
                setTimeSlots(defaultSubjects.map(subject => ({
                    inicio: subject.inicio,
                    fin: subject.fin
                })));
            }
        } catch (error) {
            console.log("Error fetching classroom configuration: ", error);
            // Use defaultSubjects in case of error
            const initialSchedule = defaultSubjects.map((subject, index) => ({
                hourStart: subject.inicio,
                hourEnd: subject.fin,
                type: "Clase",
            }));

            setSchedule(initialSchedule);
            setHaveClassroomConfig(false);
            setInitialLength(initialSchedule.length - 1);
            setVisibleSlots(new Array(initialSchedule.length).fill(true));
            setTimeSlots(defaultSubjects.map(subject => ({
                inicio: subject.inicio,
                fin: subject.fin
            })));
        }

    };




    useEffect(() => {
        if (classroom && shift && year) {
            fetchClassroomConfiguration();
        }
    }, [classroom, shift, year, token]);

    useEffect(() => {
        if (classroom && shift && year) {
            setClassroomSelected(classroom);
            setShiftSelected(shift);
            setYearSelected(year);
        }
    }, [classroom, shift, year]);

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const initializeSchedule = (timeSlots) => {
        const initialSchedule = timeSlots.map((slot, index) => ({
            id: schedule[index]?.id || null,
            hourStart: formatTime(slot.inicio),
            hourEnd: formatTime(slot.fin),
            type: "Clase",
            isHidden: false,
        }));

        setSchedule(initialSchedule);
        setVisibleSlots(new Array(initialSchedule.length).fill(true));
    };

    const handleBlockChange = (index, key, value) => {
        const updatedSchedule = [...schedule];
        updatedSchedule[index][key] = value;
        setSchedule(updatedSchedule);
    };
    
    
    

    const handleAddBlock = (index = null) => {
        let newBlock;
        console.log("Deleted blocks: ", deletedBlocks.map(block => block.id));
        if (deletedBlocks.length > 0) {
            newBlock = deletedBlocks.pop(); // Restore the last deleted block
        } else {
            const lastSlot = timeSlots[timeSlots.length - 1];
            if (!lastSlot) {
                console.error("No hay slots disponibles para añadir un nuevo bloque.");
                return;
            }
            newBlock = {
                id: null,
                hourStart: lastSlot.fin,
                hourEnd: lastSlot.fin,
                classPeriodId: periodSlots[timeSlots.length]?.id,
                type: "Clase",
                isHidden: false,
            };
        }
        console.log("Restored block: ", newBlock);
        const updatedSchedule = [...schedule];
        const updatedVisibleSlots = [...visibleSlots];

        if (index !== null && updatedSchedule[index]) {
            // Reuse the existing block's data
        } else {
            updatedSchedule.push(newBlock);
            updatedVisibleSlots.push(true);
        }

        console.log("Updated schedule: ", updatedSchedule);
        setSchedule(updatedSchedule);
        console.log("Updated visible slots: ", updatedVisibleSlots);
        setVisibleSlots(updatedVisibleSlots);

        console.log(schedule);

        if (hourConfigTableRef.current) {
            console.log("Updating time slots in HourConfigurationTable");
            hourConfigTableRef.current.updateTimeSlots(updatedSchedule);
        } else {
            console.error("hourConfigTableRef.current is null");
        }
    };

    const handleDeleteBlock = (index) => {
        const updatedSchedule = [...schedule];
        const updatedVisibleSlots = [...visibleSlots];
        const deletedBlock = updatedSchedule[index];
        updatedSchedule.splice(index, 1);
        updatedVisibleSlots.splice(index, 1);
        setSchedule(updatedSchedule);
        setVisibleSlots(updatedVisibleSlots);
        setDeletedBlocks([...deletedBlocks, deletedBlock]);
    };

    useEffect(() => {
        console.log("Schedule changed: ", schedule);
    }, [schedule]);

    const handleTimeSlotsChange = (updatedTimeSlots) => {
        setTimeSlots(updatedTimeSlots);
    
        const updatedSchedule = updatedTimeSlots.map((slot, index) => ({
            ...schedule[index], // Mantener el resto de la información
            hourStart: slot.inicio,
            hourEnd: slot.fin,
        }));
    
        setSchedule(updatedSchedule);
        setVisibleSlots(new Array(updatedSchedule.length).fill(true)); 
    };

    useEffect(() => {
        const updatedTimeSlots = schedule.map(block => ({
            inicio: block.hourStart,
            fin: block.hourEnd,
        }));
        setTimeSlots(updatedTimeSlots);
    }, [schedule]);


    const handleSaveSchedule = async () => {
        const scheduleToCreate = [];
        const scheduleToUpdate = [];
        const scheduleToDelete = [];
        console.log("classroom: ", classroom);
         // Comprobamos si algún salón ya tiene configuraciones existentes utilizando el servicio de ClassroomConfiguration
         // se debe recorrer classroom si es una lista de salones

         if(!edit)  {
            const classroomsWithConfig = await Promise.all(classroom.map(async (classroom) => {
                try {
                    const response = await classroomConfigurationService.getAllByClassroomId(token, classroom.id);
                    return response;
                } catch (error) {
                    console.log("Error fetching classroom configuration: ", error);
                    return [];
                }
            }));
            console.log("Classrooms with config: ", classroomsWithConfig);
    
    if (classroomsWithConfig.some(config => config.length > 0)) {
        // Alerta si uno o más salones ya tienen configuración
        notification.warning({
            message: 'Advertencia',
            description: `Uno o más salones ya tienen una configuración de horas asignada. Edite las configuraciones individuales para cambiar el horario.`,
            placement: 'top',
            duration: 8,
        });
        return; // Salir de la función para no continuar con la creación
    }

}

    
        deletedBlocks.forEach((block) => {
            console.log("Block: ", block);
            if (block.id !== null) {
                scheduleToDelete.push(block);
            }
        });
    
        console.log("Schedule to create: ", scheduleToCreate);
        console.log("Schedule to update: ", scheduleToUpdate);
        console.log("Schedule to delete: ", scheduleToDelete);
        console.log(schedule);

        let realIndex = 0; // Real index for non-"Recreo" blocks
        
       if (!edit) {
        const scheduleToSaveCreate = schedule.map((block, index) => {
            const idClassPeriod = block.type === "Recreo" ? periodSlots[8]?.id : periodSlots[realIndex]?.id;
            if (block.type !== "Recreo") {
                realIndex++; // Increment real index only for non-"Recreo" blocks
            }
            return {
                idClassPeriod,
                hourStart: block.hourStart,
                hourEnd: block.hourEnd,
            };
        });



        const classroomsToSave = classroom.map((classroom) => 
            classroom.id
        );

        console.log("Schedule to save create: ", scheduleToSaveCreate);
        console.log("Classrooms to save: ", classroomsToSave);
        console.log("edit: ", edit);
        console.log("period slots: ", periodSlots);

        const scheduleToSave = {
            classConfigurations: [
                ...scheduleToSaveCreate
            ],
            classrooms: [
                ...classroomsToSave
            ]
        }

        console.log("Schedule to save: ", scheduleToSave);
    
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
        if (scheduleToSaveCreate.length > 0) {
            try {
                const response = await classroomConfigurationService.saveClassroomConfiguration(token, scheduleToSave);
                console.log("Schedule saved: ", response);
                notification.success({
                    message: 'Éxito',
                    description: 'La configuración de horas ha sido guardada exitosamente',
                    placement: 'top',
                    duration: 2,
                });
                setSuccess(true);
            } catch (error) {
                console.log("Error saving schedule: ", error);
                notification.error({
                    message: 'Error',
                    description: 'Hubo un error al guardar la configuración de horas',
                    placement: 'top',
                    duration: 2,
                });
            }
            await delay(3000); // Wait for 3 seconds
        }
        } else {

        realIndex = 0; // Reset real index
    
        const scheduleToSaveUpdate = schedule.map((block, index) => {
            const idClassPeriod = block.type === "Recreo" ? periodSlots[8]?.id : periodSlots[realIndex]?.id;
            if (block.type !== "Recreo") {
                realIndex++; // Increment real index only for non-"Recreo" blocks
            }
    
            console.log(realIndex);
            
            const initialBlock = initialSchedule[index] || {};
            console.log("Block: ", block);
            

            console.log("Initial block: ", initialBlock);
            if (initialBlock && block.id !== null &&(block.hourStart !== initialBlock.hourStart || block.hourEnd !== initialBlock.hourEnd || block.type !== initialBlock.type)) {
                return {
                    idClassroomConfiguration: block.id,
                    idClassPeriod,
                    hourStart: block.hourStart,
                    hourEnd: block.hourEnd,
                    idClassroom: classroomSelected,
                };
            } else {
                return null;
            }
        }).filter(item => item !== null); // Filtrar los elementos nulos
    
        // Ordenar de mayor a menor por hourStart
        const sortedScheduleToSaveUpdate = scheduleToSaveUpdate.sort((a, b) => {
            return b.hourStart.localeCompare(a.hourStart);
        });

    
        console.log("Schedule to save update: ", sortedScheduleToSaveUpdate);

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    
    
        const scheduleToSaveDelete = scheduleToDelete.map(block => block.id);
        console.log("Schedule to save delete: ", scheduleToSaveDelete);
    
        if (scheduleToDelete.length === 1) {
            try {
                const response = await classroomConfigurationService.deleteClassroomConfiguration(token, scheduleToSaveDelete[0]);
                console.log("Schedule deleted: ", response);
                notification.success({
                    message: 'Éxito',
                    description: 'La configuración de horas ha sido eliminada exitosamente',
                    placement: 'top',
                    duration: 3,
                });
                setDeletedBlocks([]);
                setSuccess(true);
            } catch (error) {
                console.log("Error deleting schedule: ", error);
                notification.error({
                    message: 'Error',
                    description: 'Hubo un error al eliminar la configuración de horas',
                    placement: 'top',
                    duration: 2,
                });
            }
            await delay(3000); // Wait for 3 seconds
        } else if (scheduleToDelete.length > 1) {
            try {
                const response = await classroomConfigurationService.deleteClassroomConfigurations(token, scheduleToSaveDelete);
                console.log("Schedule deleted: ", response);
                notification.success({
                    message: 'Éxito',
                    description: 'La configuración de horas ha sido eliminada exitosamente',
                    placement: 'top',
                    duration: 2,
                });
                setDeletedBlocks([]);
                setSuccess(true);
            } catch (error) {
                console.log("Error deleting schedule: ", error);
                notification.error({
                    message: 'Error',
                    description: 'Hubo un error al eliminar la configuración de horas',
                    placement: 'top',
                    duration: 2,
                });
            }
            await delay(3000); // Wait for 3 seconds
        }

        if (sortedScheduleToSaveUpdate.length > 0) {
            try {
                const response = await classroomConfigurationService.updateClassroomConfiguration(token, sortedScheduleToSaveUpdate);
                console.log("Schedule updated: ", response);
                notification.success({
                    message: 'Éxito',
                    description: 'La configuración de horas ha sido actualizada exitosamente',
                    placement: 'top',
                    duration: 3,
                });
                setSuccess(true);
            } catch (error) {
                console.log("Error updating schedule: ", error);
                notification.error({
                    message: 'Error',
                    description: 'Hubo un error al actualizar la configuración de horas',
                    placement: 'top',
                    duration: 2,
                });
            }
            await delay(3000); // Wait for 3 seconds

        }
        }
    
        if (success) {
            fetchClassroomConfiguration();
            console.log("Schedule updated successfully");
            setSuccess(false);
            notification.info({
                message: 'Información',
                description: 'Se ha actualizado la tabla de horas',
                placement: 'top',
                duration: 3,
            });
        }
    };


    const formatTimeDisplay = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const TABLE_HEAD = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

    return (
        <div className={classes.generalCardContainer}>
            <CardBody className="flex flex-col bg-white border-2 border-black border-opacity-75 px-2 py-1">
                <div className="flex flex-row justify-center items-center mx-auto">
                    <table className="table-auto text-left w-full">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head, index) => (
                                    <th key={index} className="p-4 bg-transparent">
                                        <div
                                            className="font-masferrerTitle text-center text-2xl font-bold 
                                            bg-black text-white px-2 py-1"
                                        >
                                            {head}
                                        </div>
                                    </th>
                                ))}
                                <th className="p-4 bg-transparent">
                                    <div
                                        className="font-masferrerTitle text-center text-2xl font-bold 
                                        bg-black text-white px-2 py-1"
                                    >
                                        Tipo
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((block, index) => (
                                <tr key={index} className={visibleSlots[index] ? "" : "hidden"}>
                                    <td colSpan={TABLE_HEAD.length} className="p-4 bg-transparent">
                                        <div className="flex items-center justify-center font-masferrer text-lg font-regular border-2 
                                            px-2 py-4 border-black bg-white rounded-lg">
                                            <Typography className="font-masferrer text-center text-lg font-bold uppercase">
                                                {block.type}: {formatTimeDisplay(block.hourStart)} - {formatTimeDisplay(block.hourEnd)}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className="p-4 bg-transparent">
                                        <div className="flex items-center justify-center">
                                            <Select
                                                label="Tipo"
                                                value={block.type}
                                                onChange={(e) => handleBlockChange(index, 'type', e)}
                                                className="w-full text-center text-xl"
                                            >
                                                <Option value="Clase">Clase</Option>
                                                <Option value="Recreo">Recreo</Option>
                                            </Select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <HourConfigurationTable ref={hourConfigTableRef} onTimeSlotsChange={handleTimeSlotsChange} initialTimeSlots={timeSlots} updatedTimeSlots={timeSlots} />
                </div>
                <div className="flex flex-row justify-end items-center mx-auto">
                    <Button
                        className="w-auto bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg"
                        onClick={() => handleAddBlock(schedule.length)}
                    >
                        Añadir Bloque
                    </Button>
                    <Button
                        className="w-auto bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg ml-4"
                        onClick={() => {
                            handleDeleteBlock(schedule.length - 1);
                        }}
                    >
                        Eliminar Último Bloque
                    </Button>


                    <Button
                        className="w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg ml-4"
                        onClick={handleSaveSchedule}
                    >
                        {haveClassroomConfig ? "Actualizar" : "Guardar"}
                    </Button>

                </div>
            </CardBody>
        </div>
    );
};

export default AddHourConfigurationTable;