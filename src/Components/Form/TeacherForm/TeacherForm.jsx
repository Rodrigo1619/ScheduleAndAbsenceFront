import React, { useState, useEffect, useRef } from 'react';
import classes from './TeacherForm.module.css';
import AsyncSelect from '../../../Components/AsyncSelect/AsyncSelect.jsx';

import { userService } from '../../../Services/userService.js';
import { roleService } from '../../../Services/roleService.js';
import { useUserContext } from '../../../Context/userContext.jsx';

import { Select, Option } from "@material-tailwind/react";
import { Toaster, toast } from 'sonner';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";


let passwordRegex = {
    lowercase: /^(?=.*[a-z]).*$/,
    uppercase: /^(?=.*[A-Z]).*$/,
    number: /^(?=.*[0-9]).*$/,
    special: /^(?=.*[@#$%\^&+=!{}.,<>\-+*;:\'\/?¡¿_]).*$/,
}

const TeacherForm = ({ teacher, editStatus, onSuccess }) => {

    const { token } = useUserContext();
    const [rolesList, setRolesList] = useState([]);

    const [type, setType] = useState("password");
    const [icon, setIcon] = useState(IoEyeOffOutline);

    const selectedRoleRef = useRef(null);
    const [role, setRole] = useState();

    useEffect(() => {
        if (token) {
            roleService.getAllRoles(token)
                .then((data) => {
                    setRolesList(data);
                });
        }
    }, [token]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [verificationMail, setVerificationMail] = useState('');

    useEffect(() => {
        if (teacher) {
            setUsername(teacher.email);
            setFullName(teacher.name);
            selectedRoleRef.current = teacher.role;
            setRole(teacher.role);
            setVerificationMail(teacher.verifiedEmail);
        }

        return () => {
            selectedRoleRef.current = null;
        };

    }, [teacher]);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleFullNameChange = (e) => {
        setFullName(e.target.value);
    };

    const handleSelectChange = (e) => {
        const selectedRole = rolesList.find(role => role.id === e);
        selectedRoleRef.current = selectedRole;
        setRole(selectedRole);

    };

    const handleVerificationMailChange = (e) => {
        setVerificationMail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(editStatus && teacher.id != undefined && token != undefined){

            try {

                const teacherJSON ={ 
                    name: fullName, 
                    email: username,
                    id_role: selectedRoleRef.current.id,
                    password: password,
                    verifiedEmail: verificationMail 
                };

                const data = await userService.updateTeacher(token, teacher.id, teacherJSON);

                if(data){
                    onSuccess();
                }

            } catch (error) {
                toast.error('Error al actualizar el usuario', {
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            }

        }else{

            try {
                if(password.length < 8) {
                    throw new Error('La contraseña debe tener al menos 8 caracteres');
                }
    
                if(!passwordRegex.lowercase.test(password)) {
                    throw new Error('La contraseña debe tener al menos una minuscula');
                }
    
                if(!passwordRegex.uppercase.test(password)) {
                    throw new Error('La contraseña debe tener al menos una mayuscula');
                } 
    
                if(!passwordRegex.number.test(password)) {
                    throw new Error('La contraseña debe tener al menos un número');
                }
    
                if(!passwordRegex.special.test(password)) {
                    throw new Error('La contraseña debe tener al menos un caracter especial');
                }
            } catch (error) {
                toast.error(error.message, {
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });

                return;
            }

            try {
                const teacherJSON ={ 
                    name: fullName, 
                    email: username, 
                    password: password, 
                    id_role: selectedRoleRef.current.id,
                    verified_email: verificationMail,
                };

                const data = await userService.createTeacher(token, teacherJSON);
                
                if(data){

                    setUsername('');
                    setPassword('');
                    setFullName('');
                    setVerificationMail('');
                    setRole('');

                    toast.success('Usuario Registrado con exito', { 
                        duration: 2000,
                        icon: <CheckCircleIcon style={{color: "green"}} />,
                    });
                }
            } catch (error) {
                toast.error('Revise que los datos sean correctos', { 
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            }
        }

        
    };

    const handleToggle = () => {
        if (type==="password"){
            setIcon(IoEyeOutline);
            setType("text")
        } else {
            setIcon(IoEyeOffOutline);
            setType("password")
        }
    }

    return (
        <form onSubmit={handleSubmit} className={[classes["form"]]}>
            <Toaster />
            <div className={[classes["input-container"]]}>
                <label className={[classes["label"]]}>
                    Nombre Completo:
                </label>
                <input type="text" value={fullName} onChange={handleFullNameChange} className={[classes["input"]]} placeholder="Reyes Campos Alberto Romeo" />
            </div>
            <div className={[classes["input-container"]]}>            
                <label className={[classes["label"]]}>
                    Correo:
                </label>
                <input type="text" value={username} onChange={handleUsernameChange} className={[classes["input"]]} placeholder="reyes@cecam.uca.edu.sv" />
            </div>
            {
                editStatus ? false : (
                    <div className={classes["input-container"]}>
                            <div className={classes["password-wrapper"]}>
                                <label className={classes["label"]}>
                                    Contraseña:
                                </label>
                                <span className={classes["eye-icon"]} onClick={handleToggle}>
                                    {icon}
                                </span>
                            </div>
                            
                            <input 
                                type={type}
                                value={password}
                                className={classes["input"]}
                                placeholder="**********" 
                                onChange={handlePasswordChange}/>
                     </div>
                )
            }
            <div className={[classes["input-container"]]}>
                <label className={[classes["label"]]}>
                    Rol:
                </label>
                <AsyncSelect
                    value={role ? role.id : ''}
                    onChange={handleSelectChange}
                    className="bg-white Mobile-280:w-full">
                    {rolesList.map((role) => (
                        <Option key={role.id} value={role.id}>
                            {role.name}
                        </Option>
                    ))}
                </AsyncSelect>
            </div>
            <div className={[classes["input-container"]]}>
                <label className={[classes["label"]]}>
                    Correo de verificación:
                </label>
                <input type="text" value={verificationMail} onChange={handleVerificationMailChange} className={[classes["input"]]} placeholder="reyes@cecam.uca.edu.sv" />
            </div>
            <div className="button-container">
                <button type="submit" className={[classes["submit-button"]]}>{editStatus ? "Editar" : "Registrar"}</button>
            </div>
        </form>
    );
};

export default TeacherForm;