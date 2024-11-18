import classes from './CheckMailPage.module.css';
import logo from '../../../assets/logo.png'

import { Typography } from "@material-tailwind/react";
import { Toaster, toast } from 'sonner';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { AiOutlineLoading } from "react-icons/ai";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../Services/userService';

const CheckMail = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [ifFounded, setIfFounded] = useState(false);

    const [verificationCode, setVerificationCode] = useState('');
    const [email, setEmail] = useState('');

    const onChange = (e, save) => {
        save(e.target.value);
    } 

    const onSubmitHandler = async (e) => {

        e.preventDefault();

        const loadingToast = toast('Cargando...', {
            icon: <AiOutlineLoading className="animate-spin" />,
        });

        try {
            const founded = await userService.forgotPassword(username);

            if (founded) {
                setIfFounded(true);
                setEmail(founded.verifiedEmail);
            }
        } catch (error) {
            toast.error('Ocurrio un error', {
                duration: 2000,
                icon: <XCircleIcon style={{color: "red"}} />,
            });
        } finally {
            // Ocultar el toast de carga cuando termine la búsqueda
            toast.dismiss(loadingToast);
        }

    }

    const maskEmail = (email) => {
        const [name, domain] = email.split('@');
        const maskedName = name.slice(0, 1) + '****' + name.slice(-4); // Mostrar solo la primera letra y las últimas cuatro
        return `${maskedName}@${domain}`;
    };

    const codeVerificationHandler = async (e) => {
        e.preventDefault();

        const loadingToast = toast('Cargando...', {
            icon: <AiOutlineLoading className="animate-spin" />,
        });

        try {
            const response = await userService.verifyCode(username, verificationCode);

            if (response) {
                
                toast.success('Código verificado', {
                    duration: 2000,
                    icon: <CheckCircleIcon style={{color: "green"}} />,
                });

                navigate(`/ResetPassword?email=${encodeURIComponent(username)}&code=${encodeURIComponent(verificationCode)}`);

            }
        } catch (error) {
            toast.error('Ocurrio un error', {
                duration: 2000,
                icon: <XCircleIcon style={{color: "red"}} />,
            });
        } finally {
            toast.dismiss(loadingToast);
        }
    }

    return (
        <div className={classes["generalContainer"]}>
            
            <div className={classes["infoContainer"]}>
            <Toaster />
                
            {
                !ifFounded &&

                <div className={classes["logoFormContainer"]}>

                <div className={classes["miniLogo"]}>
                    <img src= {logo} alt="logo" className="h-24 w-18" />
                    <Typography
                    as="a"
                    href="#"
                    className="mr-4 ml-2 cursor-pointer py-1.5 text-blueMasferrer 
                    font-masferrerTitle font-normal max-w-40
                    text-left"
                    >
                    Centro Escolar Católico "Alberto Masferrer"
                    </Typography>
                </div>

                    <h1 className={classes["titleForm"]}>
                        ¿Olvidaste tu contraseña?
                    </h1>
                    <h2 className={classes["subtitleForm"]}>
                        Introduce tu nombre de usuario o correo para buscar tu cuenta
                    </h2>
                    <form  className={classes["form"]} onSubmit={onSubmitHandler}>
                        <div className={classes["input-container"]}>
                            <input 
                                type="text" 
                                value={username} 
                                className={classes["input"]}  
                                onChange={(e) => onChange(e, setUsername)}/>
                        </div>
                        
                        <div className={classes["button-container"]}>
                            <button className={classes["submit-button"]}>
                                Buscar
                            </button>
                        </div>
                    </form>
                </div>
            }
            
            {
                ifFounded &&

                <div className={classes["logoFormContainer"]}>

                    <div className={classes["miniLogo"]}>
                        <img src= {logo} alt="logo" className="h-24 w-18" />
                        <Typography
                        as="a"
                        href="#"
                        className="mr-4 ml-2 cursor-pointer py-1.5 text-blueMasferrer 
                        font-masferrerTitle font-normal max-w-40
                        text-left"
                        >
                        Centro Escolar Católico "Alberto Masferrer"
                        </Typography>
                    </div>

                    <h2 className={classes["subtitleForm"]}>
                        Se ha enviado un correo a {maskEmail(email)} con el código para restablecer tu contraseña
                    </h2>

                    <form  className={classes["form"]} onSubmit={codeVerificationHandler}>
                        <div className={classes["input-container"]}>
                            <input 
                                type="text" 
                                value={verificationCode} 
                                className={classes["input"]}  
                                onChange={(e) => onChange(e, setVerificationCode)}/>
                        </div>
                        
                        <div className={classes["button-container"]}>
                            <button className={classes["submit-button"]}>
                                Verificar
                            </button>
                        </div>
                    </form>
                </div>
            }

            </div>
        </div>
    );
};

export default CheckMail;