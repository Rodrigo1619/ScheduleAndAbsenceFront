import React, { useState } from 'react';
import { Card, CardHeader, CardFooter, Typography, Button, Input } from "@material-tailwind/react";
import UserTable from '../../Table/TableUserComponents/BodyTableUser.jsx'; 
import PaginationFooter from '../../Table/TableUserComponents/FooterTableUser.jsx';
import UserHeader from '../../Table/TableUserComponents/HeaderTableUser.jsx';

const TABLE_HEAD = ["ID", "Nombre"];


const RolList = ({roles = []}) => {
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRole, setSelectedRole] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const ROLES = Array.isArray(roles) ? roles.map((role) => ({
        id: role.id,
        name: role.name
    })) : [];
    
    // Filtra las filas según el término de búsqueda
    const filteredRoles = ROLES.filter((role) =>
        role.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcula el índice inicial y final de las filas a mostrar
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Filtra las filas según el índice inicial y final
    const visibleRoles = filteredRoles.slice(startIndex, endIndex);

    // Calcula el total de páginas
    const totalPages = Math.ceil(filteredRoles.length / rowsPerPage);

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

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleOpenDeleteDialog = (role) => {
        setSelectedStudent(role);
        setOpenDelete(true);
    };

    const handleCloseDeleteDialog = () => { 
        setOpenDelete(false);
    };

    const handleUpdateRoles = (role) => {
        setSelectedStudent(role);
        handleOpenDialog();
    }

    const handleUpdateSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'El estudiante ha sido actualizado exitosamente',
            placement: 'top',
            duration: 2,
            onClose: () => window.location.reload(),
        });
        handleCloseDialog();
    }

    const handleDeleteRoles = async () => {
        try {
            const data = await studentService.deleteStudent(selectedStudent.id, token);
            if (data) {
                setOpenDelete(false);
                notification.success({
                    message: 'Éxito',
                    description: 'El estudiante ha sido eliminado exitosamente',
                    placement: 'top',
                    duration: 2,
                    onClose: () => window.location.reload(),
                });
            }
        }
        catch (error) {
        }
    }

    return (
        <Card className="h-full w-full mx-auto">
            <UserHeader 
                title="Lista de ROLES" 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                handleDelete={handleDeleteRoles}
                noChange={null}
            />
            <UserTable 
                TABLE_HEAD={TABLE_HEAD} 
                USERS={visibleRoles} 
                selectedRows={selectedRows}
                handleCheckboxChange={handleCheckboxChange}
                noChange={null}
            />
            <PaginationFooter 
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredTeachers={filteredRoles}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />
        </Card>
    );
}

export default RolList;
