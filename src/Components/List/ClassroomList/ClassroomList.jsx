import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardFooter, Typography, Button, Input, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import UserTable from '../../Table/TableUserComponents/BodyTableUser.jsx'; 
import PaginationFooter from '../../Table/TableUserComponents/FooterTableUser.jsx';
import UserHeader from '../../Table/TableUserComponents/HeaderTableUser.jsx';
import { classroomService } from '../../../Services/classroomService.js';
import NewClassroomPage from '../../../pages/NewClassroomPage/NewClassroomPage.jsx';
import ClassroomForm from '../../Form/ClassroomForm/ClassroomForm.jsx';
import { notification } from 'antd';
import { useUserContext } from '../../../Context/userContext.jsx';

const TABLE_HEAD = ["", "ID", "Año", "Grado", "Turno", "Maestro", "", ""];

const ClassroomList = ({ classrooms = [], fetchClassrooms }) => {
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const { token } = useUserContext();

    const CLASSROOMS = Array.isArray(classrooms) ? classrooms.map((classroom) => ({
        id: classroom.id,
        year: classroom.year,
        grade: classroom.grade?.name ?? "N/A",
        shift: classroom.grade?.shift.name ?? "N/A", 
        teacher: classroom.homeroomTeacher?.name ?? "N/A"
    })) : [];

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filter rows based on search term
    const filteredClassrooms = CLASSROOMS.filter((classroom) =>
        classroom.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.shift.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate the start and end index of the rows to display
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Filter rows based on the start and end index
    const visibleClassrooms = filteredClassrooms.slice(startIndex, endIndex);

    // Calculate the total number of pages
    const totalPages = Math.ceil(filteredClassrooms.length / rowsPerPage);

    // Update the current page
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

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchClassrooms();
    };

    const handleOpenDeleteDialog = (classroom) => {
        setSelectedClassroom(classroom);
        setOpenDelete(true);
    };

    const handleCloseDeleteDialog = () => { 
        setOpenDelete(false);
    };

    const handleUpdateClassrooms = (classroom) => {
        setSelectedClassroom(classroom);
        handleOpenDialog();
    }

    const handleUpdateSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'El salón de clases ha sido actualizado exitosamente',
            placement: 'top',
            duration: 2,
        });
        handleCloseDialog();
    }

    const handleDeleteClassrooms = async () => {
        try {
            const data = await classroomService.deleteClassroom(selectedClassroom.id, token);
                setOpenDelete(false);
                notification.success({
                    message: 'Éxito',
                    description: 'El salón de clases ha sido eliminado exitosamente',
                    placement: 'top',
                    duration: 2,
                });
            fetchClassrooms();
        }
        catch (error) {
        }
    }

    return (
        <Card className="h-full w-full mx-auto">
            <UserHeader 
                title="Lista de Salones" 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                handleDelete={handleDeleteClassrooms}
                isDownload={true} // Habilita la opción de descarga
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                tableHeaders={TABLE_HEAD}
                tableKeys={["id", "year", "grade", "shift", "teacher"]}
                handleSelectAllChange={() => setSelectedRows(visibleClassrooms)}
                allRows={visibleClassrooms}
                AllData={filteredClassrooms}
            />
            <UserTable 
                TABLE_HEAD={TABLE_HEAD} 
                USERS={visibleClassrooms} 
                selectedRows={selectedRows}
                handleCheckboxChange={handleCheckboxChange}
                handleDelete={handleOpenDeleteDialog}
                handleUpdate={handleUpdateClassrooms}
            />
            <PaginationFooter 
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredTeachers={filteredClassrooms}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />
                <Dialog className=' overflow-auto max-h-screen' open={open}  handler={handleOpenDialog}>
                    <DialogHeader> Editar Salón de Clase:  </DialogHeader>
                    <DialogBody className='overflow-auto'> <ClassroomForm classroom={selectedClassroom} editStatus={true} onSuccess={handleUpdateSuccess} /> </DialogBody>
                    <DialogFooter>
                        <Button color="red" className='m-4' onClick={handleCloseDialog}> Cancelar </Button>
                    </DialogFooter>
                </Dialog>
                <Dialog open={openDelete} handler={handleOpenDeleteDialog}>
                    <DialogHeader> Eliminar Salón de Clase </DialogHeader>
                    <DialogBody> ¿Estás seguro que deseas eliminar el salón de clase {selectedClassroom.grade}? </DialogBody>
                <DialogFooter>
                    <Button color="green" className='m-4' onClick={handleDeleteClassrooms}> Eliminar </Button>
                    <Button color="red" className='m-4' onClick={handleCloseDeleteDialog}> Cancelar </Button>
                </DialogFooter>
                </Dialog>
        </Card>
    );
}

export default ClassroomList;