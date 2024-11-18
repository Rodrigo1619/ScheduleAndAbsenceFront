import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import UserTable from '../../Table/TableUserComponents/BodyTableUser.jsx'; 
import PaginationFooter from '../../Table/TableUserComponents/FooterTableUser.jsx';
import UserHeader from '../../Table/TableUserComponents/HeaderTableUser.jsx';
import { useUserContext } from '../../../Context/userContext';
import CodeForm from '../../Form/CodeForm/CodeForm.jsx';
import { notification } from 'antd';
import { codeService } from '../../../Services/codeService.js';

const TABLE_HEAD = [" ","ID", "Numero", "Descripción", "", ""];

const CodeList = ({ codes = [], fetchCodes }) => {
    const { token } = useUserContext();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedCode, setSelectedCode] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    // Ensure codes is an array before mapping
    const CODES = Array.isArray(codes) ? codes.map((code) => ({
        id: code.id,
        number: code.number,
        description: code.description
    })) : [];

    // Filtra las filas según el término de búsqueda
    const filteredCodes = CODES.filter((code) =>
        code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcula el índice inicial y final de las filas a mostrar
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Filtra las filas según el índice inicial y final
    const visibleCodes = filteredCodes.slice(startIndex, endIndex);

    // Calcula el total de páginas
    const totalPages = Math.ceil(filteredCodes.length / rowsPerPage);

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
        if (selectedRows.length === visibleCodes.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(visibleCodes);
        }
    };

    useEffect(() => {
        setSelectedRows([]);
    }, [currentPage, rowsPerPage, searchTerm]);

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchCodes();
    };

    const handleOpenDeleteDialog = (code) => {
        setSelectedCode(code);
        setOpenDelete(true);
    };

    const handleCloseDeleteDialog = () => { 
        setOpenDelete(false);
    };

    const handleUpdateCodes = (code) => {
        setSelectedCode(code);
        handleOpenDialog();
    };

    const handleUpdateSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'El código ha sido actualizado exitosamente',
            placement: 'top',
            duration: 2,
        });
        handleCloseDialog();
    };

    const handleDeleteCodes = async () => {
        try {
            const data = await codeService.deleteCode(selectedCode.id, token);
            if (data) {
                setOpenDelete(false);
                notification.success({
                    message: 'Éxito',
                    description: 'El código ha sido eliminado exitosamente',
                    placement: 'top',
                    duration: 2,
                });
                fetchCodes();
            }
        }
        catch (error) {
        }
    };

    return (
        <Card className="h-full w-full mx-auto">
            <UserHeader 
                title="Lista de códigos" 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                handleDelete={handleDeleteCodes}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows} // Asegúrate de pasar setSelectedRows aquí
                tableHeaders={TABLE_HEAD}
                tableKeys={["id", "number", "description"]}
                isDownload={true}
                allRows={visibleCodes}
                handleSelectAllChange={handleSelectAllChange}
            />
            <UserTable 
                TABLE_HEAD={TABLE_HEAD} 
                USERS={visibleCodes} 
                selectedRows={selectedRows}
                handleCheckboxChange={handleCheckboxChange}
                handleDelete={handleOpenDeleteDialog}
                handleUpdate={handleUpdateCodes}
            />
            <PaginationFooter 
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredTeachers={filteredCodes}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />
            <Dialog open={open} handler={handleOpenDialog}>
                <DialogHeader> Editar Código </DialogHeader>
                <DialogBody>
                    <CodeForm code={selectedCode} editStatus={true} onSuccess={handleUpdateSuccess} />
                </DialogBody>
                <DialogFooter>
                    <Button color="red" className='m-4' onClick={handleCloseDialog}> Cancelar </Button>
                </DialogFooter>
            </Dialog>
            <Dialog open={openDelete} handler={handleOpenDeleteDialog}>
                <DialogHeader> Eliminar código </DialogHeader>
                <DialogBody> 
                    ¿Estás seguro que deseas eliminar el código {selectedCode.description}? <br/>
                    <p className="font-semibold"> Puede que el dato se esté utilizando en otro lugar. </p>
                </DialogBody>
                <DialogFooter>
                    <Button color="green" className='m-4' onClick={handleDeleteCodes}> Eliminar </Button>
                    <Button color="red" className='m-4' onClick={handleCloseDeleteDialog}> Cancelar </Button>
                </DialogFooter>
            </Dialog>
        </Card>
    );
}

export default CodeList;


