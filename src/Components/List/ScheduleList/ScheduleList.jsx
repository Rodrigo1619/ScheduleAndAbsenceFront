import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
//import UserTable from '../../Table/TableUserComponents/BodyTableUser.jsx'; 
import UserTable from '../../Table/TableScheduleComponents/BodyTableSchedule.jsx'
import PaginationFooter from '../../Table/TableUserComponents/FooterTableUser.jsx';
import UserHeader from '../../Table/TableUserComponents/HeaderTableUser.jsx';
import { useUserContext } from '../../../Context/userContext';
import { notification } from 'antd';
import { scheduleService } from '../../../Services/scheduleService.js';
import ScheduleeForm from '../../Form/ScheduleeForm/ScheduleeForm.jsx';

const TABLE_HEAD = ["ID", "Inicia", "Finaliza", "Profesor", "Materia", "Clase", "Año", "Grado", "Día"];

const ScheduleList = ({ schedules = [], fetchSchedules }) => {
    const { user, token } = useUserContext();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [proSchedules, setProSchedules] = useState([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const data = await scheduleService.getAllSchedule(token);
                setProSchedules(data);
            } catch (error) {
            }
        };

        fetchSchedules();
    }, [token]);

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

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchSchedules();
    };

    const handleOpenDeleteDialog = (schedule) => {
        setSelectedSchedule(schedule);
        setOpenDelete(true);
    };

    const handleCloseDeleteDialog = () => { 
        setOpenDelete(false);
    };

    const handleUpdateSchedules = (schedule) => {
        setSelectedSchedule(schedule);
        handleOpenDialog();
    };

    const handleUpdateSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'El horario ha sido actualizado exitosamente',
            placement: 'top',
            duration: 2,
        });
        handleCloseDialog();
    };

    const handleDeleteSchedules = async () => {
        try {
            const data = await scheduleService.deleteSchedule(selectedSchedule.id, token);
            if (data) {
                setOpenDelete(false);
                notification.success({
                    message: 'Éxito',
                    description: 'El horario ha sido eliminado exitosamente',
                    placement: 'top',
                    duration: 2,
                });

                fetchSchedules();
            }
        }
        catch (error) {
        }
    };

    // Filtra las filas según el término de búsqueda
    const filteredSchedules = schedules.filter((schedule) =>
        schedule.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.classroomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.classroomYear.toString().includes(searchTerm) ||
        schedule.classroomShift.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.weekday.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcula el índice inicial y final de las filas a mostrar
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Filtra las filas según el índice inicial y final
    const visibleSchedules = filteredSchedules.slice(startIndex, endIndex);

    // Calcula el total de páginas
    const totalPages = Math.ceil(filteredSchedules.length / rowsPerPage);

    // Actualiza la página actual
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <Card className="h-full w-full mx-auto">
            <UserHeader 
                title="Lista de Horarios" 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                handleDelete={handleDeleteSchedules}
            />
            <UserTable 
                TABLE_HEAD={TABLE_HEAD} 
                USERS={visibleSchedules} 
                selectedRows={selectedRows}
                handleCheckboxChange={handleCheckboxChange}
                handleDelete={handleOpenDeleteDialog}
                handleUpdate={handleUpdateSchedules}
            />
            <PaginationFooter 
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredTeachers={filteredSchedules}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />
            <Dialog open={open} handler={handleOpenDialog}>
                <DialogHeader> Editar Horario </DialogHeader>
                <DialogBody>
                    <ScheduleeForm schedule={selectedSchedule} editStatus={true} onSuccess={handleUpdateSuccess} />
                </DialogBody>
                <DialogFooter>
                    <Button color="red" className='m-4' onClick={handleCloseDialog}> Cancelar </Button>
                </DialogFooter>
            </Dialog>
            <Dialog open={openDelete} handler={handleOpenDeleteDialog}>
                <DialogHeader> Eliminar Horario </DialogHeader>
                <DialogBody> 
                    ¿Estás seguro que deseas eliminar el horario {selectedSchedule?.id}? <br/>
                    <p className="font-semibold"> Puede que el dato se este utilizando en otro lugar. </p>
                </DialogBody>
                <DialogFooter>
                    <Button color="green" className='m-4' onClick={handleDeleteSchedules}> Eliminar </Button>
                    <Button color="red" className='m-4' onClick={handleCloseDeleteDialog}> Cancelar </Button>
                </DialogFooter>
            </Dialog>
        </Card>
    );
};

export default ScheduleList;
