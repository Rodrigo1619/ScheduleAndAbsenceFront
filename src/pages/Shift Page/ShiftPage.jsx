import React, { useEffect } from "react";

import classes from "./ShiftPage.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import ShiftList from "../../Components/List/ShiftList/ShiftList";
import { useUserContext } from "../../Context/userContext";

const ShiftPage = () => {

    const { user } = useUserContext();

    useEffect(() => {
        document.title = "Sistema de Asistencia y Horario - Escuela Masferrer";
    }, []);
    
    return (
        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <div className={[classes["allContentContainer"]]}>             
                    <div className={[classes["pageContentContainerCol"]]}>
                        <div className={[classes["TitleContainer"]]}>
                        </div>
                        <div className={[classes["pageContentContainerRow"]]}>
                            <div className={[classes["SubtitleContainer"]]}>
                            <ShiftList />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ShiftPage;
