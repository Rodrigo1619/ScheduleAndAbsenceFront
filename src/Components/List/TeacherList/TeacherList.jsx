import React, { useState, useEffect } from 'react';
import { Card, Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { notification } from 'antd';
import BodyTableUser from '../../Table/TableUserComponents/BodyTableUser.jsx'; 
import PaginationFooter from '../../Table/TableUserComponents/FooterTableUser.jsx';
import HeaderTableUser from '../../Table/TableUserComponents/HeaderTableUser.jsx';
import { userService } from '../../../Services/userService.js';
import { useUserContext } from '../../../Context/userContext.jsx';
import TeacherForm from '../../Form/TeacherForm/TeacherForm.jsx';

const TABLE_HEAD = ["", "ID", "Nombre Completo", "Correo", "Rol Asignado", "Estado","Correo de Verificación","", ""];
const TABLE_KEYS = ["id", "name", "email", `role.name`, "active", "verifiedEmail"]; // Mapea a las claves del objeto correspondiente

const TeacherList = ({teachers  = [], fetchTeachers}) => {
    const { token } = useUserContext();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openStatus, setOpenStatus] = useState(false);


    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredTeachers = teachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const visibleTeachers = filteredTeachers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredTeachers.length / rowsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCheckboxChange = (row) => {
        const isSelected = selectedRows.some(selected => selected.id === row.id);
        
        if (isSelected) {
            // Si la fila ya está seleccionada, la removemos
            setSelectedRows(selectedRows.filter(selected => selected.id !== row.id));
        } else {
            // Si la fila no está seleccionada, la agregamos
            setSelectedRows([...selectedRows, row]);
        }
    };    

    const handleDelete = () => {
        setSelectedRows([]);
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchTeachers();
    };

    const handleUpdateTeacher = (teacher) => {
        setSelectedTeacher(teacher);
        handleOpenDialog();
    }

    const handleUpdateSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'El usuario ha sido actualizado exitosamente',
            placement: 'top',
            duration: 2,
        });
        handleCloseDialog();
    }

    const handleOpenDeleteDialog = (teacher) => {
        setSelectedTeacher(teacher);
        setOpenDelete(true);
    };

    const handleCloseDeleteDialog = () => { 
        setOpenDelete(false);
    };

    const handleOpenStatusDialog = (teacher) => {
        setSelectedTeacher(teacher);
        setOpenStatus(true);
    };

    const handleCloseStatusDialog = () => { 
        setOpenStatus(false);
    };

    const handleDeleteTeachers = async () => {
        try {
            const data = await userService.deleteTeacher(token, selectedTeacher.id);
            if (data) {
                setOpenDelete(false);
                notification.success({
                    message: 'Éxito',
                    description: 'El usuario ha sido eliminado exitosamente',
                    placement: 'top',
                    duration: 2,
                });
                fetchTeachers();
            }
        } catch (error) {
        }
    }

    const handleChangeStatus = async () => {
        try {
            const data = await userService.toggleStatus(token, selectedTeacher.id);
            if (data) {
                setOpenStatus(false);
                notification.success({
                    message: 'Éxito',
                    description: 'El estado del usuario ha sido actualizado exitosamente',
                    placement: 'top',
                    duration: 2,
                });
                fetchTeachers();
            }
        } catch (error) {
        }
    };

    return (
        <Card className="h-full w-full mx-auto">
            <HeaderTableUser
                title="Lista de Usuarios"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleDelete={handleDelete}
                selectedRows={selectedRows}
                tableHeaders={TABLE_HEAD}
                tableKeys={TABLE_KEYS}
                isDownload={true}
                allRows={teachers}
                setSelectedRows={setSelectedRows}
                AllData={filteredTeachers}
            />
            <BodyTableUser
                TABLE_HEAD={TABLE_HEAD}
                USERS={visibleTeachers}
                selectedRows={selectedRows}
                handleCheckboxChange={handleCheckboxChange}
                handleUpdate={handleUpdateTeacher}
                handleDelete={handleOpenDeleteDialog}
                handleStatus={handleOpenStatusDialog}
            />
            <PaginationFooter 
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredTeachers={filteredTeachers}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />

            <Dialog open={ open } handler={ handleOpenDialog }>
                <DialogHeader> Editar Usuario</DialogHeader>
                <DialogBody className="overflow-auto h-CarouselItemPC-1024*768">
                    <TeacherForm teacher={ selectedTeacher } editStatus={true} onSuccess={handleUpdateSuccess}/>
                </DialogBody>
                <DialogFooter>
                    <Button color="red" className="m-4" onClick={handleCloseDialog}>Cancelar</Button>
                </DialogFooter>
            </Dialog>

            <Dialog open={openDelete} handler={handleOpenDeleteDialog}>
                <DialogHeader> Eliminar Usuario </DialogHeader>
                <DialogBody> ¿Estás seguro que deseas eliminar el usuario { selectedTeacher.name }? </DialogBody>
                <DialogFooter>
                    <Button color="green" className='m-4' onClick={handleDeleteTeachers}> Eliminar </Button>
                    <Button color="red" className='m-4' onClick={handleCloseDeleteDialog}> Cancelar </Button>
                </DialogFooter>
            </Dialog>

            <Dialog open={openStatus} handler={handleOpenStatusDialog}>
                <DialogHeader> Editar Estado de Actividad </DialogHeader>
                <DialogBody> 
                    ¿Estás seguro que deseas cambiar el estado de { selectedTeacher.name }?
                </DialogBody>
                <DialogFooter>
                    <Button color="green" className='m-4' onClick={handleChangeStatus}> Cambiar </Button>
                    <Button color="red" className='m-4' onClick={handleCloseStatusDialog}> Cancelar </Button>
                </DialogFooter>
            </Dialog>
        </Card>
    );
}

export default TeacherList;

