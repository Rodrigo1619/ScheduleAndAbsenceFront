import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import classes from './HourConfigurationTable.module.css';
import { CardBody, Input, Typography } from '@material-tailwind/react';

const HourConfigurationTable = forwardRef(({ onTimeSlotsChange, initialTimeSlots, updatedTimeSlots, shift }, ref) => {
    
    // Si no se recibe un shift.name = vespertino se asignan los valores por defecto, sino se asignan los valores de la tarde
    const defaultSubjects = shift.name === "Vespertino" ? [
        { id: 1, inicio: "13:00", fin: "13:45" },
        { id: 2, inicio: "13:45", fin: "14:30" },
        { id: 3, inicio: "14:30", fin: "15:15" },
        { id: 4, inicio: "15:15", fin: "16:00" },
        { id: 5, inicio: "16:00", fin: "16:45" },
        { id: 6, inicio: "16:45", fin: "17:30" },
        { id: 7, inicio: "17:30", fin: "18:15" },
    
    ] : [
        { id: 1, inicio: "07:00", fin: "07:45" },
        { id: 2, inicio: "07:45", fin: "08:30" },
        { id: 3, inicio: "08:30", fin: "09:15" },
        { id: 4, inicio: "09:15", fin: "10:00" },
        { id: 5, inicio: "10:00", fin: "10:45" },
        { id: 6, inicio: "10:45", fin: "11:30" },
        { id: 7, inicio: "11:30", fin: "12:15" },
    ];


    const [subjects, setSubjects] = useState(initialTimeSlots.length > 0 ? initialTimeSlots : defaultSubjects);

    useEffect(() => {
        if (updatedTimeSlots && !areTimeSlotsEqual(updatedTimeSlots, subjects)) {
            setSubjects(updatedTimeSlots);
        }
    }, [updatedTimeSlots]);
    
    const areTimeSlotsEqual = (slots1, slots2) => {
        if (slots1.length !== slots2.length) return false;
        for (let i = 0; i < slots1.length; i++) {
            if (slots1[i].inicio !== slots2[i].inicio || slots1[i].fin !== slots2[i].fin) return false;
        }
        return true;
    };

    useImperativeHandle(ref, () => ({
        handleDeleteLastTimeSlot() {
            if (subjects.length > 0) {
                const updatedSubjects = [...subjects];
                updatedSubjects.pop();
                setSubjects(updatedSubjects);
                onTimeSlotsChange(updatedSubjects);
            }
        },
        handleAddTimeSlot() {
            const lastSlot = subjects[subjects.length - 1];
            const newSlotStartTime = lastSlot ? lastSlot.fin : "00:00";
            const updatedSubjects = [...subjects, { id: subjects.length + 1, inicio: newSlotStartTime, fin: newSlotStartTime }];
            setSubjects(updatedSubjects);
            onTimeSlotsChange(updatedSubjects);
        },

        updateTimeSlots(newTimeSlots) {
            onTimeSlotsChange(newTimeSlots);
        }
    }));

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const adjustHours = (updatedSubjects) => {
        for (let i = 0; i < updatedSubjects.length - 1; i++) {
            const endTimeCurrent = formatTime(updatedSubjects[i].fin);
            const startTimeNext = formatTime(updatedSubjects[i + 1].inicio);
    
            if (endTimeCurrent > startTimeNext) {
                updatedSubjects[i + 1].inicio = endTimeCurrent;
            }
    
            if (formatTime(updatedSubjects[i + 1].inicio) > formatTime(updatedSubjects[i + 1].fin)) {
                updatedSubjects[i + 1].fin = updatedSubjects[i + 1].inicio;
            }
        }
        return updatedSubjects;
    };

    const handleHourChange = (e, index, key) => {
        const updatedSubjects = [...subjects];
        updatedSubjects[index][key] = e.target.value;
    
        const adjustedSubjects = adjustHours(updatedSubjects);
        setSubjects(adjustedSubjects);
        onTimeSlotsChange(adjustedSubjects);
    };

    return (
        <div className={classes.table}>
            <CardBody className="flex flex-row bg-white px-2 py-1
            Mobile-390*844:px-0 Mobile-280:px-0 Mobile-390*844:w-96 overflow-auto Mobile-280:w-96
            ">
                <table className="table-auto text-left w-max Mobile-390*844:overflow-auto Mobile-280:overflow-auto">
                    <thead>
                        <tr>
                            <th className="p-4 bg-transparent
                            Mobile-390*844:w-36 Mobile-280:w-36 Mobile-390*844:p-0 Mobile-280:p-0">
                                <div className="font-masferrer text-xl font-regular border-2 px-2 py-1 border-black
                                Mobile-390*844:w-36 Mobile-280:w-36">
                                    <Typography className="font-masferrerTitle text-center text-xl font-bold">
                                        Inicio
                                    </Typography>
                                </div>
                            </th>
                            <th className="p-4 bg-transparent
                            Mobile-390*844:w-36 Mobile-280:w-36 Mobile-390*844:p-0 Mobile-280:p-0
                            ">
                                <div className="font-masferrer text-xl font-regular border-2 px-2 py-1 border-black
                                Mobile-390*844:w-36 Mobile-280:w-36">
                                    <Typography className="font-masferrerTitle text-center text-xl font-bold">
                                        Fin
                                    </Typography>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.sort((a, b) => a.inicio.localeCompare(b.inicio)).map((subject, index) => (
                            <tr key={index}>
                                <td className="p-4 w-auto bg-transparent
                                Mobile-390*844:w-36 Mobile-280:w-36 Mobile-390*844:p-0 Mobile-280:p-0">
                                    <div className="flex font-masferrer px-2 py-2 mt-2">
                                        <Input
                                            type="time"
                                            value={subject.inicio || "00:00"}
                                            onChange={(e) => handleHourChange(e, index, 'inicio')}
                                            className="text-center text-xl font-bold"
                                        />
                                    </div>
                                </td>
                                <td className="p-4 w-auto bg-transparent
                                Mobile-390*844:w-36 Mobile-280:w-36 Mobile-390*844:p-0 Mobile-280:p-0">
                                    <div className="flex font-masferrer text-lg font-regular px-2 py-2">
                                        <Input
                                            type="time"
                                            value={subject.fin || "00:00"}
                                            onChange={(e) => handleHourChange(e, index, 'fin')}
                                            className="text-center text-xl font-bold 
                                            "
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardBody>
        </div>
    );
});

export default HourConfigurationTable;