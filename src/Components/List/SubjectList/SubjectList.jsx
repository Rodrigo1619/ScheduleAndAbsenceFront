import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import UserTable from '../../Table/TableUserComponents/BodyTableUser.jsx'; 
import PaginationFooter from '../../Table/TableUserComponents/FooterTableUser.jsx';
import UserHeader from '../../Table/TableUserComponents/HeaderTableUser.jsx';
import { useUserContext } from '../../../Context/userContext';
import SubjectForm from '../../Form/SubjectForm/SubjectForm.jsx';
import { notification } from 'antd';
import { subjectService } from '../../../Services/subjectService.js';

const TABLE_HEAD = ["", "ID", "Materia","",""];
const TABLE_KEYS = ["id", "name"];

const SubjectList = ({ subjects = [], fetchSubjects }) => {
    const { token } = useUserContext();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState([]);
    const [subjectsId, setSubjectsId] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    // Ensure SUBJECTS is an array before mapping
    const SUBJECTS = Array.isArray(subjects) ? subjects.map((subject) => ({
        id: subject.id,
        name: subject.name
    })) : [];

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Filtra las filas según el término de búsqueda
    const filteredSubjects = SUBJECTS.filter((subject) =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcula el índice inicial y final de las filas a mostrar
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Filtra las filas según el índice inicial y final
    const visibleSubjects = filteredSubjects.slice(startIndex, endIndex);

    // Calcula el total de páginas
    const totalPages = Math.ceil(filteredSubjects.length / rowsPerPage);

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
        if (selectedRows.length === visibleSubjects.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(visibleSubjects);
        }
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchSubjects();
    };

    const handleOpenDeleteDialog = (subject) => {
        setSelectedSubject(subject);
        setOpenDelete(true);
    };

    const handleCloseDeleteDialog = () => { 
        setOpenDelete(false);
    };

    const handleUpdateSubjects = (subject) => {
        setSelectedSubject(subject);
        handleOpenDialog();
    };

    const handleUpdateSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'La Materia ha sido actualizada exitosamente',
            placement: 'top',
            duration: 2,
        });
        handleCloseDialog();
    };

    const handleDeleteSubjects = async () => {
        try {
            const data = await subjectService.deleteSubject(selectedSubject.id, token);
            if (data) {
                setOpenDelete(false);
                notification.success({
                    message: 'Éxito',
                    description: 'La Materia ha sido eliminada exitosamente',
                    placement: 'top',
                    duration: 2,
                });
                fetchSubjects();
            }
        }
        catch (error) {
        }
    };

    return (
        <Card className="h-full w-full mx-auto">
            <UserHeader 
                title="Lista de Materias" 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                handleDelete={handleDeleteSubjects}
                isDownload={true}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                tableHeaders={TABLE_HEAD}
                tableKeys={TABLE_KEYS}
                allRows={visibleSubjects}
                handleSelectAllChange={handleSelectAllChange}
                AllData={filteredSubjects}
            />
            <UserTable 
                TABLE_HEAD={TABLE_HEAD} 
                USERS={visibleSubjects} 
                selectedRows={selectedRows}
                handleCheckboxChange={handleCheckboxChange}
                handleDelete={handleOpenDeleteDialog}
                handleUpdate={handleUpdateSubjects}
            />
            <PaginationFooter 
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredTeachers={filteredSubjects}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />
            <Dialog open={open} handler={handleOpenDialog}>
                <DialogHeader> Editar Materia</DialogHeader>
                <DialogBody> 
                    <SubjectForm subject={selectedSubject} editStatus={true} onSuccess={handleUpdateSuccess} />
                </DialogBody>
                <DialogFooter>
                    <Button color="red" className='m-4' onClick={handleCloseDialog}> Cancelar </Button>
                </DialogFooter>
            </Dialog>
            <Dialog open={openDelete} handler={handleOpenDeleteDialog}>
                <DialogHeader> Eliminar Materia </DialogHeader>
                <DialogBody> 
                    ¿Estás seguro que deseas eliminar la materia {selectedSubject.name}? <br/>
                    <p className="font-semibold"> Puede que el dato se este utilizando en otro lugar. </p>
                </DialogBody>
                <DialogFooter>
                    <Button color="green" className='m-4' onClick={handleDeleteSubjects}> Eliminar </Button>
                    <Button color="red" className='m-4' onClick={handleCloseDeleteDialog}> Cancelar </Button>
                </DialogFooter>
            </Dialog>
        </Card>
    );
};

export default SubjectList;