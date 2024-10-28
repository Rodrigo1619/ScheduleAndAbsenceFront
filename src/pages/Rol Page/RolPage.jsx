import React, { useState, useEffect } from "react";
import {
    Navbar,
    Button,
    Typography,
} from "@material-tailwind/react";
import classes from "./RolPage.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import RolList from "../../Components/List/RolList/RolList";
import { useUserContext } from "../../Context/userContext";
import { roleService } from "../../Services/roleService";

const RolPage = () => {

    const [roles, setRoles] = useState([]);
    const { user, token} = useUserContext();

    useEffect(() => {
        const fetchRoles = async () => {
            try
            {
                const data = await roleService.getAllRoles(token);
                setRoles(data);
                console.log(data);
            }
            catch (error)
            {
                console.log("Hubo un error al obtener los roles" + error);
            }
        }
        fetchRoles();
    }, []);

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
    }, []);

    return (
        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name="Luis Morales" role="Administrador" />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <div className={[classes["allContentContainer"]]}>
                    <SideBarNav />
                    <div className={[classes["pageContentContainerCol"]]}>
                        <div className={[classes["pageContentContainerRow"]]}>
                            <div className={[classes["SubtitleContainer"]]}>
                            <RolList roles={roles} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default RolPage;