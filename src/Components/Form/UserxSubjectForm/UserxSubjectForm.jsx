import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import classes from './UserxSubjectForm.module.css';
import { useUserContext } from '../../../Context/userContext';
import { userService } from '../../../Services/userService';
import { subjectService } from '../../../Services/subjectService';
import { userxSubjectService } from '../../../Services/userxSubjectService';
import { Toaster, toast } from 'sonner';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const UserxSubjectForm = ({ userxsubject, editStatus, onSuccess }) => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [users, setUsers] = useState([]);
    const { user, token } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const subjectsData = await subjectService.getAllSubjects(token);
                const usersData = await userService.getAllTeachersAdmin(token);

                setSubjects(subjectsData.map(subject => ({
                    value: subject.id,
                    label: subject.name
                })));

                setUsers(usersData.filter(user => user.role.name === "Profesor").map(user => ({
                    value: user.id,
                    label: user.name
                })));

                if (userxsubject) {
                    setSelectedSubject(subjectsData.find(sub => sub.id === userxsubject.id_subject));
                    setSelectedUser(usersData.find(u => u.id === userxsubject.id_user));
                }
            } catch (error) {
                toast.error('Error fetching data', {
                    duration: 2000,
                    icon: <XCircleIcon style={{ color: "red" }} />,
                });
            }
        };

        fetchData();
    }, [userxsubject, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSubject || !selectedUser) {
            toast.error('Por favor, elija una materia y un profesor', {
                duration: 2000,
                icon: <XCircleIcon style={{ color: "red" }} />,
            });
            return;
        }

        const userxsubjectData = {
            id_subject: selectedSubject.value,
            id_user: selectedUser.value
        };

        try {
            if (editStatus && userxsubject && userxsubject.id !== undefined && token !== undefined) {
                await userxSubjectService.updateUserxSubject(userxsubject.id, userxsubjectData, token);
                onSuccess();
            } else {
                await userxSubjectService.createUserxSubject(userxsubjectData, token);
                setSelectedSubject(null);
                setSelectedUser(null);
                toast.success('Se registro la materia con exito', {
                    duration: 2000,
                    icon: <CheckCircleIcon style={{ color: "green" }} />,
                });
            }
        } catch (error) {
            toast.error('Error al registrar materia', {
                duration: 2000,
                icon: <XCircleIcon style={{ color: "red" }} />,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={classes.form}>
            <Toaster />
            <div className={classes["input-container"]}>
                <label className={classes.label} htmlFor="subject-select">
                    Materia:
                </label>
                <Select
                    id="subject-select"
                    value={selectedSubject}
                    onChange={setSelectedSubject}
                    options={subjects}
                    placeholder="Seleccione una materia"
                />
            </div>
            <div className={classes["input-container"]}>
                <label className={classes.label} htmlFor="user-select">
                    Profesor:
                </label>
                <Select
                    id="user-select"
                    value={selectedUser}
                    onChange={setSelectedUser}
                    options={users}
                    placeholder="Seleccione un usuario"
                />
            </div>
            <div className={classes["button-container"]}>
                <button type="submit" className={classes["submit-button"]}>Registrar</button>
            </div>
        </form>
    );
};

export default UserxSubjectForm;