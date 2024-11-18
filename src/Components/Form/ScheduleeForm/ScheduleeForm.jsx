import React, { useEffect, useState } from 'react';
import { useUserContext } from '../../../Context/userContext.jsx';
import { scheduleService } from '../../../Services/scheduleService.js';
import { Toaster, toast } from 'sonner';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import classes from './ScheduleeForm.module.css';


const ScheduleeForm = ({schedule, editStatus, onSuccess}) => {
    const [id_userxsubject, setIdUserxSubject] = useState('');
    const [id_classroom, setIdClassroom] = useState('');
    const [startHour, setStartHour] = useState('');
    const [endHour, setEndHour] = useState('');
    const { user, token } = useUserContext();

    useEffect(() => {
        if (schedule) {
            setIdUserxSubject(schedule.id_userxsubject);
            setIdClassroom(schedule.id_classroom);
            setStartHour(schedule.startHour);
            setEndHour(schedule.endHour);
        }
    }, [schedule]);

    const handleIdUserxSubjectChange = (e) => {
        setIdUserxSubject(e.target.value);
    };

    const handleIdClassroomChange = (e) => {
        setIdClassroom(e.target.value);
    };

    const handleStartHourChange = (e) => {
        setStartHour(e.target.value);
    };

    const handleEndHourChange = (e) => {
        setEndHour(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editStatus && schedule && schedule.id !== undefined && token !== undefined) {      
            try {
                const data = await scheduleService.updateSchedule(schedule.id, {
                    id_userxsubject: id_userxsubject,
                    id_classroom: id_classroom,
                    startHour: startHour,
                    endHour: endHour
                }, token);
                if (data) {
                    onSuccess();
                }
            }
            catch (error) {
                toast.error('Revise que los datos sean correctos', { 
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            }
        } else {
            try {
                const data = await scheduleService.createSchedule({
                    id_userxsubject: id_userxsubject,
                    id_classroom: id_classroom,
                    startHour: startHour,
                    endHour: endHour
                }, token);
                if (data) {
                    setIdUserxSubject('');
                    setIdClassroom('');
                    setStartHour('');
                    setEndHour('');

                    toast.success('Horario registrado con éxito', { 
                        duration: 2000,
                        icon: <CheckCircleIcon style={{color: "green"}} />,
                    });
                }
            }
            catch (error) {
                toast.error('Revise que los datos sean correctos', { 
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className={[classes["form"]]}>
            <Toaster />
            <div className={[classes["input-container"]]}>            
                <label className={[classes["label"]]}>
                    ID UserxSubject:
                </label>
                <input type="text" value={id_userxsubject} onChange={handleIdUserxSubjectChange} className={[classes["input"]]} placeholder="ID UserxSubject" />
            </div>
            <div className={[classes["input-container"]]}>
                <label className={[classes["label"]]}>
                    ID Classroom:
                </label>
                <input type="text" value={id_classroom} onChange={handleIdClassroomChange} className={[classes["input"]]} placeholder="ID Classroom" />
            </div>
            <div className={[classes["input-container"]]}>
                <label className={[classes["label"]]}>
                    Start Hour:
                </label>
                <input type="text" value={startHour} onChange={handleStartHourChange} className={[classes["input"]]} placeholder="Start Hour" />
            </div>
            <div className={[classes["input-container"]]}>
                <label className={[classes["label"]]}>
                    End Hour:
                </label>
                <input type="text" value={endHour} onChange={handleEndHourChange} className={[classes["input"]]} placeholder="End Hour" />
            </div>
            <div className={[classes["button-container"]]}>
            <button type="submit" className={[classes["submit-button"]]}>Registrar</button>
            </div>
        </form>
    );
};

export default ScheduleeForm;
