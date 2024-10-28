import { Card, Option } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import classes from './SelectTeacherScheduleForm.module.css';
import AsyncSelect from '../../AsyncSelect/AsyncSelect.jsx';
import Select from 'react-select';
import { userService } from '../../../Services/userService';
import { useUserContext } from '../../../Context/userContext';
import { gradeService } from '../../../Services/gradeService';
import { shiftService } from '../../../Services/shiftService';
import { subjectService } from '../../../Services/subjectService';
import TeacherScheduleTable from '../../TeacherScheduleTable/TeacherScheduleTable.jsx';

const SelectTeacherScheduleForm = () => {

    const [shift, setShift] = useState(null);	
    const [year, setYear] = useState(null);
    const [gradesList, setGradesList] = useState([]);
    const [shiftsList, setShiftsList] = useState([]);

    const { token } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {

                    // Set year with system date with format YYYY
                    const date = new Date();
                    setYear(date.getFullYear());

                    const shifts = await shiftService.getAllShifts(token);
                    const grades = await gradeService.getAllGrades(token);
                    
                    setShiftsList(shifts || []);
                    setGradesList(grades || []);

                } catch (error) {
                    console.log("Error fetching data: ", error);
                }
            }
        };

        fetchData();
    }, [token]);


    const handleSelectGradeChange = (value) => {
        const grade = gradesList.find(grade => grade.id === value);
        setGrade(grade);
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
                </div>
            </div>
            </Card>
            <TeacherScheduleTable shift={shift} year={year} />
        </div>
    );
};

export default SelectTeacherScheduleForm;