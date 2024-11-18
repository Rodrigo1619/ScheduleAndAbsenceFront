import { Card, Option } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import classes from "./SelectTeacherScheduleForm.module.css";
import AsyncSelect from "../../AsyncSelect/AsyncSelect.jsx";
import SelectSearch from "react-select";
import { useUserContext } from "../../../Context/userContext";
import { userService } from "../../../Services/userService.js";
import { shiftService } from "../../../Services/shiftService";
import TeacherScheduleComponent from "../../TeacherScheduleComponent/TeacherScheduleComponent.jsx";

const SelectTeacherScheduleForm = () => {
    const [shift, setShift] = useState(null);
    const [teacher, setTeacher] = useState();
    const [year, setYear] = useState(null);
    const [shiftsList, setShiftsList] = useState([]);
    const [teachersList, setTeachersList] = useState([]);

    const { token } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    // Set year with system date with format YYYY
                    const date = new Date();
                    setYear(date.getFullYear());

                    const shifts = await shiftService.getAllShifts(token);
                    const teachers = await userService.getAllTeachersAdmin(token);

                    setShiftsList(shifts || []);
                    setTeachersList(teachers.filter((user) => user.role.name === "Profesor") || []);
                } catch (error) {
                }
            }
        };

        fetchData();
    }, [token]);

    const handleSelectTeacherChange = (e) => {

        const selectedTeacher = teachersList.find((teacher) => teacher.id === e.value);

        if(selectedTeacher){
            setTeacher(selectedTeacher);
        }
    }

    const handleSelectShiftChange = (value) => {
        const shift = shiftsList.find((shift) => shift.id === value);
        setShift(shift);
    };


    return (
        <div className={classes["form-container"]}>
            <Card className="bg-transparent p-4 mx-4 border-0 shadow-none">
                <div className={classes["form-container"]}>
                    <div className={classes["inputsContainer"]}>
                        <div className={classes["input-container"]}>
                            <label className={classes["label"]}> Profesor:</label>
                            <SelectSearch
                                value={teacher ? { value: teacher.id, label: teacher.name } : '' }
                                options={teachersList.map((teacher) => ({
                                    value: teacher.id,
                                    label: teacher.name,
                                }))}
                                onChange={handleSelectTeacherChange}
                                placeholder="Seleccione un maestro"
                                className="Mobile-280:w-full text-black min-w-full border-2 border-black border-opacity-20 w-60 Mobile-390*844:w-full "
                                menuPlacement='bottom'
                                menuPortalTarget={document.body}
                            />
                        </div>
                        <div className={classes["input-container"]}>
                            <label className={classes["label"]}>Turno:</label>
                            <AsyncSelect
                                value={shift ? shift.id : ""}
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
                            <input
                                type="number"
                                minLength="4"
                                maxLength="4"
                                min="2024"
                                max="2099"
                                pattern="[0-9]{4}"
                                onChange={(e) => setYear(e.target.value)}
                                defaultValue={year}
                                className="Mobile-280:w-full text-black border-2 text-center mx-auto border-black border-opacity-20"
                                placeholder="Año"
                            />
                        </div>
                    </div>
                </div>
            </Card>
            <TeacherScheduleComponent teacher={teacher} shift={shift} year={year} />
        </div>
    );
};

export default SelectTeacherScheduleForm;
