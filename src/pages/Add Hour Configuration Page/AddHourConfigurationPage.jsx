import React, { useState, useEffect } from "react";
import {
    Typography,
    Button,
} from "@material-tailwind/react";
import classes from "./AddHourConfigurationPage.module.css";
import Header from "../../Components/Header/Header";
import AddHourConfigurationEditForm from "../../Components/Form/AddHourConfigurationForm/AddHourConfigurationEditForm";
import AddHourConfigurationNewForm from "../../Components/Form/AddHourConfigurationForm/AddHourConfigurationNewForm";
import { useUserContext } from "../../Context/userContext";

const AddHourConfigurationPage = () => {
    const [mode, setMode] = useState("create"); // Estado para controlar el modo, por defecto 'create'
    const { user } = useUserContext();
    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
    }, []);

    // Función para cambiar el modo según el botón presionado
    const handleModeChange = (newMode) => {
        setMode(newMode);
    };

    return (
        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <div className={[classes["allContentContainer"]]}>
                    <div className={[classes["pageContentContainerCol"]]}>
                        <div className={[classes["TitleContainer"]]}>
                            <Typography className="font-masferrer text-4xl font-regular text-center justify-center items-center mx-auto font-bold text-black">
                                Agregar configuración de horas
                            </Typography>
                        </div>

                        {/* Botones para cambiar entre "Crear" y "Editar" */}
                        <div className="flex justify-center my-4">
                            <Button
                                className="mx-2"
                                color={mode === "create" ? "blue" : "gray"}
                                onClick={() => handleModeChange("create")}
                            >
                                Crear nueva configuración
                            </Button>
                            <Button
                                className="mx-2"
                                color={mode === "edit" ? "blue" : "gray"}
                                onClick={() => handleModeChange("edit")}
                            >
                                Editar configuración
                            </Button>
                        </div>

                        {/* Renderizado condicional basado en el estado */}
                        <div className={[classes["pageContentContainerRow"]]}>
                            {mode === "create" ? (
                                <AddHourConfigurationNewForm />
                            ) : (
                                <AddHourConfigurationEditForm />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddHourConfigurationPage;
