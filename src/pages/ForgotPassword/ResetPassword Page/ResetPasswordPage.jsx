import classes from './ResetPasswordPage.module.css';
import logo from '../../../assets/logo.png'

import { Typography } from "@material-tailwind/react";
import { Toaster, toast } from 'sonner';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../../../Services/userService';

let passwordRegex = {
    lowercase: /^(?=.*[a-z]).*$/,
    uppercase: /^(?=.*[A-Z]).*$/,
    number: /^(?=.*[0-9]).*$/,
    special: /^(?=.*[@#$%\^&+=!{}.,<>\-+*;:\'\/?¡¿_]).*$/,
}

const ResetPassword = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = searchParams.get('email');
    const code = searchParams.get('code');

    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');

    const [ifReseted, setIfReseted] = useState(false);

    const [type, setType] = useState("password");
    const [icon, setIcon] = useState(IoEyeOffOutline);

    const onChange = (e, save) => {
        save(e.target.value);
    } 

    const onSubmitHandler = async (e) => {

        e.preventDefault();

        try {

            if (newPassword !== reNewPassword) {
                throw new Error('Las contraseñas no coinciden');
            }

            if(newPassword === reNewPassword && newPassword.length < 8) {
                throw new Error('La contraseña debe tener al menos 8 caracteres');
            }

            if(newPassword === reNewPassword && !passwordRegex.lowercase.test(newPassword)) {
                throw new Error('La contraseña debe tener al menos una minuscula');
            }

            if(newPassword === reNewPassword && !passwordRegex.uppercase.test(newPassword)) {
                throw new Error('La contraseña debe tener al menos una mayuscula');
            } 

            if(newPassword === reNewPassword && !passwordRegex.number.test(newPassword)) {
                throw new Error('La contraseña debe tener al menos un número');
            }

            if(newPassword === reNewPassword && !passwordRegex.special.test(newPassword)) {
                throw new Error('La contraseña debe tener al menos un caracter especial');
            }

            const founded = await userService.resetPassword(email, code, newPassword);

            if (founded) {
                toast.success('Contraseña actualizada correctamente', {
                    duration: 2000,
                    icon: <CheckCircleIcon style={{color: "green"}} />,
                });
                setIfReseted(true);
            }
        } catch (error) {
            if (error.message == '400') {
                toast.error("Código no válido o código caducado o código ya utilizado", {
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            }else{
                toast.error(error.message, {
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            }
        }
    }

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
        <div className={classes["generalContainer"]}>
            
            <div className={classes["infoContainer"]}>
            <Toaster />
                
                {
                    !ifReseted &&

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
                            Ahora que has verificado tu correo, ingresa tu nueva contraseña
                        </h2>
                        <form  className={classes["form"]} onSubmit={onSubmitHandler}>
                            <div className={classes["input-container"]}>
                                <label className={classes["label"]}>
                                    Nueva contraseña:
                                </label>
                                <div className={classes["password-wrapper"]}>
                                    <input 
                                        type={type} 
                                        value={newPassword} 
                                        className={classes["input"]}  
                                        onChange={(e) => onChange(e, setNewPassword)}/>
                                    <span className={classes["eye-icon"]} onClick={handleToggle}>
                                        {icon}
                                    </span>
                                </div>
                            </div>

                            <div className={classes["input-container"]}>
                                <label className={classes["label"]}>
                                    Reingresa tu nueva contraseña:
                                </label>
                                <div className={classes["password-wrapper"]}>
                                    <input 
                                        type={type}
                                        value={reNewPassword} 
                                        className={classes["input"]}  
                                        onChange={(e) => onChange(e, setReNewPassword)}/>
                                    <span className={classes["eye-icon"]} onClick={handleToggle}>
                                        {icon}
                                    </span>
                                </div>
                            </div>
                            
                            <div className={classes["button-container"]}>
                                <button className={classes["submit-button"]}>
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </div>
                }

                {
                    ifReseted &&

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
                            Contraseña actualizada
                        </h1>
                        <h2 className={classes["subtitleForm"]}>
                            Tu contraseña ha sido actualizada correctamente, ya puedes iniciar sesión
                        </h2>

                        <div className={classes["button-container2"]}>
                            <button className={classes["submit-button"]} onClick={() => navigate('/')}>
                                Regresar
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default ResetPassword;