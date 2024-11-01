import { Card, Option } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import classes from './SelectClassroomScheduleForm.module.css';
import AsyncSelect from '../../AsyncSelect/AsyncSelect.jsx';
import { useUserContext } from '../../../Context/userContext';
import { shiftService } from '../../../Services/shiftService';
import ClassroomScheduleTable from '../../ClassroomScheduleTable/ClassroomScheduleTable.jsx';
import { classroomService } from '../../../Services/classroomService.js';

const SelectClassroomScheduleForm = () => {

    const [shift, setShift] = useState(null);
    const [classroom, setClassroom] = useState(null);	
    const [year, setYear] = useState(null);
    const [shiftsList, setShiftsList] = useState([]);
    const [classroomsList, setClassroomsList] = useState([]);

    const { token } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {

                    // Set year with system date with format YYYY
                    const date = new Date();
                    setYear(date.getFullYear());

                    const shifts = await shiftService.getAllShifts(token);
                   
                    
                    setShiftsList(shifts || []);

                } catch (error) {
                    console.log("Error fetching data: ", error);
                }
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            if (token) {
                try {
                    const classrooms = await classroomService.getClassroomsByShiftAndYear(token, shift.id, year);
                    setClassroomsList(classrooms || []);
                } catch (error) {
                    console.log("Error fetching data: ", error);
                }
            }
        };
        fetchClassrooms();
    }, [shift, year, token]);
        


    const handleSelectClassroomChange = (value) => {
        const classroom = classroomsList.find(classroom => classroom.id === value);
        setClassroom(classroom);
    }

    const handleSelectShiftChange = (value) => {
        const shift = shiftsList.find(shift => shift.id === value);
        setShift(shift);
    }

    return (
        <div className={classes["form-container"]}>
            <Card className='bg-transparent p-4 mx-4 border-0 shadow-none'>
                <div className={classes["form-container"]}>
                    <div className={classes["inputsContainer"]}>
                <div className={classes["input-container"]}>
                    <label className={classes["label"]}>Turno:</label>
                   <AsyncSelect
                        value={shift ? shift.id : ''}
                        onChange={handleSelectShiftChange}
                        className="bg-white Mobile-280:w-full"
                    >
                        {shiftsList?.map((shift) => (
                            <Option key={shift.id} value={shift.id}>
                                {shift.name}
                            </Option>
                        ))}
                    </AsyncSelect>
                </div>
                <div className={classes["input-container"]}>
                    <label className={classes["label"]}>Año:</label>
                    <input type="number" minLength="4" maxLength="4" min="2024" max="2099" 
                    pattern='[0-9]{4}' onChange={(e) => setYear(e.target.value)}
                    defaultValue={year}
                    className="Mobile-280:w-full text-black border-2 text-center mx-auto border-black border-opacity-20" placeholder="Año" />
                </div>
                <div className={classes["input-container"]}>
                    <label className={classes["label"]}>Salón</label>
                   <AsyncSelect
                        value={classroom ? classroom.id : ''}
                        onChange={handleSelectClassroomChange}
                        className="bg-white Mobile-280:w-full"
                    >
                        {classroomsList?.map((classroom) => (
                            <Option key={classroom.id} value={classroom.id}>
                                {classroom.grade.name}
                            </Option>
                        ))}
                    </AsyncSelect>
                </div>
                </div>
            </div>
            </Card>
            <ClassroomScheduleTable grade={classroom} shift={shift} year={year} />
        </div>
    );
};

export default SelectClassroomScheduleForm;