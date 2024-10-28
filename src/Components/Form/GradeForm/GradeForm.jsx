import React, { useState, useEffect } from 'react';
import classes from './GradeForm.module.css';

import { useUserContext } from '../../../Context/userContext.jsx';

import { Toaster, toast } from 'sonner';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { notification } from 'antd';
import { gradeService } from '../../../Services/gradeService.js';

const DefaultSections = [
    {label: "A", value: "A"},
    {label: "B", value: "B"},
    {label: "C", value: "C"},
    {label: "D", value: "D"},
    {label: "E", value: "E"},
    {label: "F", value: "F"},
    {label: "G", value: "G"},
];

const GradeForm = ({ grade, editStatus, onSuccess }) => {

    const { token } = useUserContext();

    const [gradeName, setGradeName] = useState('');
    const [governmentId, setGovernmentId] = useState('');
    const [section, setSection] = useState('');

    const handleGradeNameChange = (e) => {
        setGradeName(e.target.value);
    };

    const handleGovermentIDChange = (e) => {
        setGovernmentId(e.target.value);
    };

    const handleSectionChange = (e) => {

        console.log("Seccion elegida: ", e.target.value);

        setSection(e.target.value);
    };

    useEffect(() => {
        if (grade) {
            setGradeName(grade.name);
            setGovernmentId(grade.idGoverment);
            setSection(grade.section);
        }
    }, [grade]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        const gradeJSON = {
            name: gradeName,
            idGoverment: governmentId,
            section: section
        }
        
        if (editStatus &&  grade && grade.id !== undefined && token !== undefined) {      
            try {
                const data = await gradeService.updateGrade(grade.id, token, gradeJSON);

                if (data) {
                    onSuccess();
                }
            }
            catch (error) {
                console.log(error);

                toast.error('Revise que el dato sea correcto', { 
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            }
        } else {
            try {

                const data = await gradeService.createGrade(gradeJSON, token);

                if (data) {
                    setGradeName('');
                    setGovernmentId('');
                    toast.success('Grado Registrado con exito', { 
                        duration: 2000,
                        icon: <CheckCircleIcon style={{color: "green"}} />,
                    });
                }
            }
            catch (error) {
                toast.error('No datos repetidos ni espacio en blanco', { 
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
                ID Gubernamental:
            </label>
            <input type="text" value={governmentId} onChange={handleGovermentIDChange} className={[classes["input"]]} placeholder="1407219" />
        </div>
        <div className={[classes["input-container"]]}>            
            <label className={[classes["label"]]}>
                Nombre del Grado:
            </label>
            <input type="text" value={gradeName} onChange={handleGradeNameChange} className={[classes["input"]]} placeholder="1ro General A" />
        </div>
        <div className={[classes["input-container"]]}>            
            <label className={[classes["label"]]}>
                Sección:
            </label>
            <select onChange={handleSectionChange} className={[classes["input"]]}>
                <option value={section ? section : ""}>{section ? section : "Elija una opción"}</option>
                {DefaultSections.map((section, index) => (
                    <option key={index} value={section.value}>{section.label}</option>
                ))}
            </select>
        </div>
        <div className={[classes["button-container"]]}>
            <button type="submit" className={[classes["submit-button"]]}>Registrar</button>
        </div>
        </form>
    );
}

export default GradeForm;