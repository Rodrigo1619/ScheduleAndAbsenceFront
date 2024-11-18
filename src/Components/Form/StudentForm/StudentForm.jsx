import React, { useEffect, useState } from 'react';
import classes from './StudentForm.module.css';
import { useUserContext } from '../../../Context/userContext';
import { studentService } from '../../../Services/studentService.js';
import { Toaster, toast } from 'sonner';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const StudentForm = ({student, editStatus, onSuccess}) => {
    const [nie, setNie] = useState('');
    const [name, setName] = useState('');
    const { user, token } = useUserContext();
    
    const numberRegExp = new RegExp('^[0-9]+$');

    useEffect(() => {
        if (student) {
            setNie(student.nie);
            setName(student.fullName);
        }
    }
    , [student]);

    const handleNieChange = (e) => {
        setNie(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (nie === '' || name === '') {
                throw new Error('No puede haber campos vacios');
            }

            if (!numberRegExp.test(nie)) {
                throw new Error('El NIE debe ser un numero');
            }

            if (nie.length < 7) {
                throw new Error('El NIE debe tener al menos 7 digitos');
            }

            if (name.length < 5) {
                throw new Error('Ingrese un nombre valido');
            }

        } catch (error) {
            toast.error(error.message, {
                duration: 2000,
                icon: <XCircleIcon style={{color: "red"}} />,
            });

            return;
        }



        if (editStatus && student && student.id !== undefined && token !== undefined) {      
            try {
                const data = await studentService.updateStudent(student.id, {
                    nie: nie,
                    name: name
                }, token);
                if (data) {
                    onSuccess();
                }
            }
            catch (error) {
                toast.error('Error al actualizar, posible duplicado de datos', { 
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            }
        } else {
            try {
                const data = await studentService.createStudent({
                    nie: nie,
                    name: name
                }, token);
                if (data) {

                    setNie('');
                    setName('');

                    toast.success('Estudiante Registrado con exito', { 
                        duration: 2000,
                        icon: <CheckCircleIcon style={{color: "green"}} />,
                    });
                }
            }
            catch (error) {
                toast.error('Error al registrar estudiante', { 
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
                    NIE:
                </label>
                <input type="text" value={nie} onChange={handleNieChange} className={[classes["input"]]} placeholder="NIE" />
            </div>
            <div className={[classes["input-container"]]}>
                <label className={[classes["label"]]}>
                    Nombre Completo:
                </label>
                <input type="text" value={name} onChange={handleNameChange} className={[classes["input"]]} placeholder="Nombre completo" />
            </div>
            <div className={[classes["button-container"]]}>
                <button type="submit" className={[classes["submit-button"]]}>Registrar</button>
            </div>
        </form>
    );
};

export default StudentForm;