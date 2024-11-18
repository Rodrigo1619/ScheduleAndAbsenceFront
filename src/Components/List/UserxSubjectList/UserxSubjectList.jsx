import React, { useState, useEffect } from 'react';
import { Card, Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { notification } from 'antd';
import UserTable from '../../Table/TableUserComponents/BodyTableUser.jsx'; 
import PaginationFooter from '../../Table/TableUserComponents/FooterTableUser.jsx';
import UserHeader from '../../Table/TableUserComponents/HeaderTableUser.jsx';
import { userxSubjectService } from '../../../Services/userxSubjectService.js';
import UserxSubjectForm from '../../Form/UserxSubjectForm/UserxSubjectForm.jsx';
import { useUserContext } from '../../../Context/userContext.jsx';

const TABLE_HEAD = ["", "ID", "Profesor", "Materia", ""];
const TABLE_KEYS = ["id", "teacher.name", "subject.name"];

const UserxSubjectList = ({ userxSubjects, fetchData }) => {
    const { token } = useUserContext();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedUserxSubject, setSelectedUserxSubject] = useState(null);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredUserxSubjects = userxSubjects.filter((userxsubject) =>
        userxsubject.teacher?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userxsubject.subject?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const visibleUserxSubjects = filteredUserxSubjects.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredUserxSubjects.length / rowsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCheckboxChange = (row) => {
        const isSelected = selectedRows.some(selected => selected.id === row.id);
        if (isSelected) {
            setSelectedRows(selectedRows.filter(selected => selected.id !== row.id));
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    };

    const handleSelectAllChange = () => {
        if (selectedRows.length === visibleUserxSubjects.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(visibleUserxSubjects);
        }
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchData();
    };

    const handleOpenDeleteDialog = (userxsubject) => {
        setSelectedUserxSubject(userxsubject);
        setOpenDelete(true);
    };

    const handleCloseDeleteDialog = () => { 
        setOpenDelete(false);
    };

    const handleUpdateUserxSubjects = (userxsubject) => {
        setSelectedUserxSubject(userxsubject);
        handleOpenDialog();
    };

    const handleUpdateSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'Se ha actualizado la asignación de materia a profesor exitosamente',
            placement: 'top',
            duration: 2,
        });
        handleCloseDialog();
    };

    const handleDeleteUserxSubjects = async () => {
        try {
            await userxSubjectService.deleteUserxSubject(selectedUserxSubject.id, token);
            notification.success({
                message: 'Éxito',
                description: 'La asignación de materia a profesor ha sido eliminada exitosamente',
                placement: 'top',
                duration: 2,
            });
            setOpenDelete(false);
            fetchData(); // Mover la llamada de fetchData después de cerrar el diálogo
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Hubo un error al eliminar la asignación de materia a profesor. Inténtalo nuevamente.',
                placement: 'top',
                duration: 2,
            });
        }
    };

    return (
        <Card className="h-full w-full mx-auto">
            <UserHeader 
                title="Listado de asignación de materia a Profesor" 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                handleDelete={handleCloseDeleteDialog}
                selectedRows={selectedRows}
                tableHeaders={TABLE_HEAD}
                tableKeys={TABLE_KEYS}
                isDownload={true}
                handleSelectAllChange={handleSelectAllChange}
                allRows={visibleUserxSubjects}
                setSelectedRows={setSelectedRows}
                AllData={filteredUserxSubjects}
            />
            <UserTable 
                TABLE_HEAD={TABLE_HEAD} 
                USERS={visibleUserxSubjects} 
                selectedRows={selectedRows}
                handleCheckboxChange={handleCheckboxChange}
                handleDelete={handleOpenDeleteDialog}
                showUpdateButton={false}
            />
            <PaginationFooter 
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredTeachers={filteredUserxSubjects}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />

            <Dialog open={open} handler={setOpen}>
                <DialogHeader> Editar Asignación </DialogHeader>
                <DialogBody className="overflow-auto h-CarouselItemPC-1024*768">
                    <UserxSubjectForm subject={selectedUserxSubject} editStatus={true} onSuccess={handleUpdateSuccess} />
                </DialogBody>
                <DialogFooter>
                    <Button color="red" className="m-4" onClick={handleCloseDialog}>Cancelar</Button>
                </DialogFooter>
            </Dialog>

            <Dialog open={openDelete} handler={setOpenDelete}>
                <DialogHeader> Eliminar Asignación </DialogHeader>
                <DialogBody> 
                    ¿Estás seguro que deseas eliminar la asignación de <b>{selectedUserxSubject?.teacher.name}</b> a la materia <b>{selectedUserxSubject?.subject.name}</b>? 
                </DialogBody>
                <DialogFooter>
                    <Button color="green" className='m-4' onClick={handleDeleteUserxSubjects}> Eliminar </Button>
                    <Button color="red" className='m-4' onClick={handleCloseDeleteDialog}> Cancelar </Button>
                </DialogFooter>
            </Dialog>
        </Card>
    );
};

export default UserxSubjectList;
