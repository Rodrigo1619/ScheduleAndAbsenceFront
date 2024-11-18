import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, DialogBody, DialogFooter, DialogHeader, Typography} from "@material-tailwind/react";
import classes from "./CodePage.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import CodeForm from "../../Components/Form/CodeForm/CodeForm";
import CodeList from "../../Components/List/CodeList/CodeList";
import { codeService } from "../../Services/codeService";
import { useUserContext } from "../../Context/userContext";

const CodePage = () => {

    const [codes, setCodes] = useState([]);
    const { token, user } = useUserContext();

    const fetchCodes = async () => {
        try 
        {   
            const data = await codeService.getAllCodes(token);
            setCodes(data);
        }
        catch (error) 
        {
        }
    }

    const [openRegister, setOpenRegister] = useState(false);

    const handleOpenRegisterDialog = () => {
        setOpenRegister(true);
    };

    const handleCloseRegisterDialog = () => {
        setOpenRegister(false);
        fetchCodes();
    };

    const handleRegisterSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'El código ha sido registrado exitosamente',
            placement: 'top',
            duration: 2,
        });
        handleCloseRegisterDialog();
    }

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
        fetchCodes();
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
                        <Button color="white" className='m-4' onClick={handleOpenRegisterDialog}>
                            <Typography className='text-sm justify-center my-auto
                            font-masferrerTitle font-normal PC-1280*720:text-xs 
                            PC-800*600:text-xs
                            PC-640*480:text-xs
                            Mobile-390*844:text-xs
                            Mobile-280:text-xs
                            IpadAir:text-xs'>Agregar código</Typography>
                        </Button>
                        <Dialog open={openRegister} handler={handleOpenRegisterDialog}>
                            <DialogHeader> Registrar Código </DialogHeader>
                                <DialogBody> <CodeForm editStatus={false} onSuccess={handleRegisterSuccess} />
                                </DialogBody>
                            <DialogFooter>
                                <Button color="red" className='m-4' onClick={handleCloseRegisterDialog}> Cancelar </Button>
                            </DialogFooter>
                        </Dialog>
                        </div>
                        <div className={[classes["pageContentContainerRow"]]}>
                            <div className={[classes["SubtitleContainer"]]}>
                            <CodeList codes = {codes} fetchCodes={fetchCodes}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default CodePage;
