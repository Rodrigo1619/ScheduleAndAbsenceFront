import React, { useState, useEffect } from 'react';
import { Card } from "@material-tailwind/react";
import UserTable from '../../Table/TableUserComponents/BodyTableUser.jsx'; 
import PaginationFooter from '../../Table/TableUserComponents/FooterTableUser.jsx';
import UserHeader from '../../Table/TableUserComponents/HeaderTableUser.jsx';
import { useUserContext } from '../../../Context/userContext.jsx';
import { shiftService } from '../../../Services/shiftService.js';

const HEAD_SHIFTS = ["ID", "Nombre"];

const ShiftList = () => {
    const { token } = useUserContext();
    const [shifts, setShifts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) {
            shiftService.getAllShifts(token)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setShifts(data);
                }
            })
            .catch((error) => {
                setError(error.message);
            });
        }
    }, [token]);

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);

    const filteredShifts = shifts.filter((shift) =>
        shift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shift.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const visibleShifts = filteredShifts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredShifts.length / rowsPerPage);

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

    const handleDeleteShifts = () => {
        setSelectedRows([]);
        // Aquí puedes agregar el código para eliminar las filas seleccionadas de la lista de SHIFTS
    };

    return (
        <Card className="h-full w-full mx-auto">
            <UserHeader 
                title="Lista de Turnos" 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                handleDelete={handleDeleteShifts}
                noChange={null}
            />
            <UserTable 
                TABLE_HEAD={HEAD_SHIFTS} 
                USERS={visibleShifts} 
                selectedRows={selectedRows}
                handleCheckboxChange={handleCheckboxChange}
                noChange={null}
            />
            <PaginationFooter 
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredTeachers={filteredShifts}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />
        </Card>
    );
};

export default ShiftList;
