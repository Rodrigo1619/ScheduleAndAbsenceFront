import './Login.module.css'
import classes from './Login.module.css';
import logo from '../../assets/logo.png'

import { Typography } from "@material-tailwind/react";
import { Toaster, toast } from 'sonner';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { AiOutlineLoading } from "react-icons/ai";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Grid } from 'react-loader-spinner';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context/userContext';
import { userService } from '../../Services/userService';

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginAttempt, setLoginAttempt] = useState(false);

    const [type, setType] = useState("password");
    const [icon, setIcon] = useState(IoEyeOffOutline);
    const [loading, setLoading] = useState(true);

    const { login, token } = useUserContext();

    const handleNavigate = (role) => {

        switch (role) {
            case "Administrador":
                navigate('/AdminPage');
                break;
            case "Moderador":
                navigate('/ModeratorPage');
                break;
            case "Coordinador":
                navigate('/CoordinatorHomepage');
                break;
            case "Asistencia":
                navigate('/AttendanceRegisterView');
                break;
            default:
                navigate('/HomePage');
                break;
        }
    
    }
    
    const onChange = (e, save) => {
        save(e.target.value);
    } 

    useEffect(() => {
        if (token) {
            
            const navigate = async () => { 

                const {role: userRole} = await userService.verifyToken(token) 

                if(userRole){
                    handleNavigate(userRole.name);
                }
            };

            navigate();
        }

        setTimeout(() => {
            setLoading(false);
        },2000);

    }, [token]);
    

    const onSubmitHandler = async (e) => {

        e.preventDefault();

        const loadingToast = toast('Cargando...', {
            icon: <AiOutlineLoading className="animate-spin" />,
        });

        try {
            const logged = await login(email, password);

            if(logged){
                toast.success('Bienvenido', { 
                    duration: 2000,
                    icon: <CheckCircleIcon style={{color: "green"}} />,
                });
            };

        } catch (error) {
            setLoginAttempt(true);

            if(error.message == 403){
                toast.error('Su cuenta no esta activa', {
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            }else{
                toast.error('Usuario o contraseña incorrectos', {
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            }

        } finally {
            toast.dismiss(loadingToast);
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
        loading ?
            <div className={[classes["loaderContainer"]]}>
                <Grid type="Grid" color="#170973" height={80} width={80} visible={loading} />
            </div>

            :
        <div className={classes["generalContainer"]}>
            
            <div className={classes["infoContainer"]}>
            <Toaster />
                <div className={classes["logoTitleContainer"]}>
                    <img className= {classes["logoImg"]} src={logo}></img>
                    <h1 className={classes["systemText"]}>
                        Sistema de Control de Asistencia
                    </h1>
                    <h1 className={classes["systemsubText"]}>
                        Centro Escolar Católico "Alberto Masferrer"
                    </h1>

                    <Typography className='text-xl font-normal mt-20 px-4'>
                        Realizado por estudiantes de la carrera de Ingeniería Informática
                    </Typography>
                    <Typography className='font-bold text-lg px-4'>
                        Universidad Centroamericana "José Simeón Cañas", 2024
                    </Typography>
                </div>
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
                        BIENVENIDO
                    </h1>
                    <h2 className={classes["subtitleForm"]}>
                        Inicia sesión con tus credenciales asignadas
                    </h2>
                    <form  className={classes["form"]} onSubmit={onSubmitHandler}>
                        <div className={classes["input-container"]}>            
                            <label className={classes["label"]}>
                                Correo:
                            </label>
                            <input 
                                type="text" 
                                value={email} 
                                className={classes["input"]} 
                                placeholder="00176020@cecam.edu.sv" 
                                onChange={(e) => onChange(e, setEmail)}/>
                        </div>
                        <div className={classes["input-container"]}>
                            <label className={classes["label"]}>
                                Contraseña:
                            </label>
                            <div className={classes["password-wrapper"]}>
                                <input 
                                    type={type}
                                    value={password}
                                    className={classes["input"]} 
                                    placeholder="**********" 
                                    onChange={(e) => onChange(e, setPassword)}/>
                                    
                                <span className={classes["eye-icon"]} onClick={handleToggle}>
                                    {icon}
                                </span>
                            </div>
                        </div>

                        <div className={classes["button-container"]}>
                            <button className={classes["submit-button"]}>
                                Iniciar Sesión
                            </button>
                        </div>

                        {
                            loginAttempt &&
                            
                            <div className={classes["forgot-password"]}>
                                <Typography
                                        as="a"
                                        href="#"
                                        variant="small"
                                        className="font-medium"
                                        onClick={() => navigate('/ForgotPassword')}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Typography>
                            </div> 
                        }

                    </form>
                </div>
            
            </div>
        </div>
    );
};
export default Login;