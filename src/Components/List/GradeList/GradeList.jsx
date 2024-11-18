import React, { useState, useEffect } from 'react';
import { Card, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { notification } from 'antd';

import UserTable from '../../Table/TableUserComponents/BodyTableUser.jsx'; 
import PaginationFooter from '../../Table/TableUserComponents/FooterTableUser.jsx';
import UserHeader from '../../Table/TableUserComponents/HeaderTableUser.jsx';
import { useUserContext } from '../../../Context/userContext.jsx';
import { gradeService } from '../../../Services/gradeService.js';
import GradeForm from '../../Form/GradeForm/GradeForm.jsx';

const TABLE_HEAD = [" ","ID", "Nombre", "Sección", "ID Gubernamental", "Turno", " ", " "];

const GradeList = ({ grades = [], fetchGrades }) => {

    const { token } = useUserContext();

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filtra las filas según el término de búsqueda
    const filteredGrades = grades?.filter((grade) =>
        grade.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.idGoverment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.shift.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcula el índice inicial y final de las filas a mostrar
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Filtra las filas según el índice inicial y final
    const visibleGrades = filteredGrades?.slice(startIndex, endIndex);

    // Calcula el total de páginas
    const totalPages = Math.ceil(filteredGrades?.length / rowsPerPage);

    // Actualiza la página actual
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

    const handleSelectAllChange = () => {
        if (selectedRows.length === visibleGrades.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(visibleGrades);
        }
    };

    const handleDelete = () => {
        setSelectedRows([]);
        // Aquí puedes agregar el código para eliminar las filas seleccionadas de la lista de GRADES
    };

    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState([]);

    const handleOpenDialog = () => {
        setOpen(true);
    };
    
    const handleCloseDialog = () => {
        setOpen(false);
        fetchGrades();
    };

    const handleUpdateGrade = (grade) => {
        setSelectedGrade(grade);
        handleOpenDialog();
    };

    const handleUpdateSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'El grado ha sido actualizado exitosamente',
            placement: 'top',
            duration: 2,
        });
        handleCloseDialog();
    };

    const handleOpenDeleteDialog = (grade) => {
        setSelectedGrade(grade);
        setOpenDelete(true);
    };

    const handleCloseDeleteDialog = () => { 
        setOpenDelete(false);
        fetchGrades();
    };

    const handleDeleteGrades = async () => {
        try {
            const data = await gradeService.deleteGrade(selectedGrade.id, token);

            if (data) {
                setOpenDelete(false);
                notification.success({
                    message: 'Éxito',
                    description: 'El grado ha sido eliminado exitosamente',
                    placement: 'top',
                    duration: 2,
                });

                fetchGrades();
            }
        }
        catch (error) {
        }
    };

    return (
        <Card className="h-full w-full mx-auto">
            <UserHeader 
                title="Lista de Grados" 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                handleDelete={handleDelete}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows} // Asegúrate de pasar setSelectedRows aquí
                tableHeaders={TABLE_HEAD}
                tableKeys={["id", "name", "section", "idGoverment", "shift.name"]}
                isDownload={true}
                allRows={visibleGrades}
                handleSelectAllChange={handleSelectAllChange}
                AllData={filteredGrades}
            />
            <UserTable 
                TABLE_HEAD={TABLE_HEAD} 
                USERS={visibleGrades} 
                selectedRows={selectedRows}
                handleCheckboxChange={handleCheckboxChange}
                handleUpdate={handleUpdateGrade}
                handleDelete={handleOpenDeleteDialog}
            />
            <PaginationFooter 
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredTeachers={filteredGrades}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />

            <Dialog open={ open } handler={ handleOpenDialog }>
                <DialogHeader> Editar Grado </DialogHeader>
                <DialogBody className="overflow-auto h-CarouselItemPC-1024*768">
                    <GradeForm grade={ selectedGrade } editStatus={ true } onSuccess={ handleUpdateSuccess } />
                </DialogBody>
                <DialogFooter>
                    <Button color="red" className="m-4" onClick={handleCloseDialog}>Cancelar</Button>
                </DialogFooter>
            </Dialog>

            <Dialog open={openDelete} handler={handleOpenDeleteDialog}>
                <DialogHeader> Eliminar Grado </DialogHeader>
                <DialogBody> 
                    ¿Estás seguro que deseas eliminar el Grado { selectedGrade.name }? <br/>
                    <p className="font-semibold"> Puede que el dato se esté utilizando en otro lugar. </p>
                </DialogBody>
                <DialogFooter>
                    <Button color="green" className='m-4' onClick={handleDeleteGrades}> Eliminar </Button>
                    <Button color="red" className='m-4' onClick={handleCloseDeleteDialog}> Cancelar </Button>
                </DialogFooter>
            </Dialog>
        </Card>
    );
};

export default GradeList;
