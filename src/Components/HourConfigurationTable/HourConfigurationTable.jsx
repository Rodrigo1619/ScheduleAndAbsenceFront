import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import classes from './HourConfigurationTable.module.css';
import { CardBody, Input, Typography } from '@material-tailwind/react';

const HourConfigurationTable = forwardRef(({ onTimeSlotsChange, initialTimeSlots, updatedTimeSlots }, ref) => {

    const defaultSubjects = [
        { id: 1, inicio: "07:00", fin: "07:40" },
        { id: 2, inicio: "07:40", fin: "08:20" },
        { id: 3, inicio: "08:20", fin: "08:50" },
        { id: 4, inicio: "08:50", fin: "09:30" },
        { id: 5, inicio: "09:30", fin: "10:10" },
        { id: 6, inicio: "10:10", fin: "10:50" },
        { id: 7, inicio: "10:50", fin: "11:05" },
        { id: 8, inicio: "11:05", fin: "11:45" },
        { id: 9, inicio: "11:45", fin: "12:20" },
        { id: 10, inicio: "12:20", fin: "13:00" },
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
            <CardBody className="flex flex-row bg-white px-2 py-1">
                <table className="table-auto text-left w-max">
                    <thead>
                        <tr>
                            <th className="p-4 bg-transparent">
                                <div className="font-masferrer text-xl font-regular border-2 px-2 py-1 border-black">
                                    <Typography className="font-masferrerTitle text-center text-xl font-bold">
                                        Inicio
                                    </Typography>
                                </div>
                            </th>
                            <th className="p-4 bg-transparent">
                                <div className="font-masferrer text-xl font-regular border-2 px-2 py-1 border-black">
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
                                <td className="p-4 w-auto bg-transparent">
                                    <div className="flex font-masferrer px-2 py-2 mt-2">
                                        <Input
                                            type="time"
                                            value={subject.inicio || "00:00"}
                                            onChange={(e) => handleHourChange(e, index, 'inicio')}
                                            className="text-center text-xl font-bold"
                                        />
                                    </div>
                                </td>
                                <td className="p-4 w-auto bg-transparent">
                                    <div className="flex font-masferrer text-lg font-regular px-2 py-2">
                                        <Input
                                            type="time"
                                            value={subject.fin || "00:00"}
                                            onChange={(e) => handleHourChange(e, index, 'fin')}
                                            className="text-center text-xl"
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