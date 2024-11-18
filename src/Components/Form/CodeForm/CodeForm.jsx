import React, { useEffect, useState } from 'react';
import classes from './CodeForm.module.css';
import { useUserContext } from '../../../Context/userContext';
import { codeService } from '../../../Services/codeService.js';
import { notification } from 'antd';

const CodeForm = ({code, editStatus, onSuccess}) => {
    const [number, setNumber] = useState('');
    const [description, setDescription] = useState('');
    const [newCode, setNewCode] = useState({});
    const { user, token } = useUserContext();
    const { uuid, setUuid } = useState();
    

    useEffect(() => {
        if (code) {
            setNumber(code.number);
            setDescription(code.description);
        }
    }
    , [code]);

    const handleNumberChange = (e) => {
        setNumber(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editStatus && code && code.id !== undefined && token !== undefined) {      
            try {
            const data = await codeService.updateCode(code.id, {
                number: number,
                description: description
            }, token);
            if (data) {
                onSuccess();
            }
            }
            catch (error) {
            }
        } else {
            try {
                const data = await codeService.createCode({
                    number: number,
                    description: description
                }, token);
                if (data) {
                    notification.success({
                        message: 'Éxito',
                        description: 'El codigo ha registrado exitosamente',
                        placement: 'top',
                        duration: 2,
                        onClose: () => window.location.reload(),
                    });
            }
            }
            catch (error) {
            }
        }
    }
    

    return (
        <form onSubmit={handleSubmit} className={[classes["form"]]}>
            <div className={[classes["input-container"]]}>            
                <label className={[classes["label"]]}>
                    Número:
                </label>
                <input type="text" value={number} onChange={handleNumberChange} className={[classes["input"]]} placeholder="Número" />
            </div>
            <div className={[classes["input-container"]]}>
                <label className={[classes["label"]]}>
                    Descripción:
                </label>
                <input type="text" value={description} onChange={handleDescriptionChange} className={[classes["input"]]} placeholder="Descripción" />
            </div>
            <div className={[classes["button-container"]]}>
                <button type="submit" className={[classes["submit-button"]]}>Registrar</button>
            </div>
        </form>
    );
};

export default CodeForm;