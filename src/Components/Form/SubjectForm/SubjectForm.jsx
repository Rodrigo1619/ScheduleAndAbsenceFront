import React, { useEffect, useState } from 'react';
import classes from './SubjectForm.module.css';
import { useUserContext } from '../../../Context/userContext';
import { subjectService } from '../../../Services/subjectService.js';

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Toaster, toast } from 'sonner';

const SubjectForm = ({subject, editStatus, onSuccess}) => {
    const [name, setName] = useState('');
    const [newSubject, setNewSubject] = useState({});
    const { user, token } = useUserContext();
    const { uuid, setUuid } = useState();
    

    useEffect(() => {
        if (subject) {
            setName(subject.name);
        }
    }
    , [subject]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!name) {
                throw new Error('El campo nombre es requerido');
            }
        } catch (error) {
            toast.error(error.message, { 
                duration: 2000,
                icon: <XCircleIcon style={{color: "red"}} />,
            });

            return;
        }


        if (editStatus && subject && subject.id !== undefined && token !== undefined) {      
            try {
                const data = await subjectService.updateSubject(subject.id, {
                    name: name,
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
                const data = await subjectService.createSubject({
                    name: name,
                }, token);
                if (data) {
                    toast.success('Materia Registrada con exito', { 
                        duration: 2000,
                        icon: <CheckCircleIcon style={{color: "green"}} />,
                    });
                    setName('');}
            }
            catch (error) {
                toast.error('Error al crear la materia, posible duplicado de datos', { 
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
                    Nombre de la materia:
                </label>
                <input type="text" value={name} onChange={handleNameChange} className={[classes["input"]]} placeholder="Materia" />
            </div>
            <div className={[classes["button-container"]]}>
                <button type="submit" className={[classes["submit-button"]]}> {!editStatus ? "Registrar" : "Actualizar"}</button>
            </div>
        </form>
    );
};

export default SubjectForm;