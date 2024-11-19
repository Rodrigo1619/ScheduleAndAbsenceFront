import React, { useState, useEffect } from 'react';
import {Card, CardHeader, CardBody, CardFooter, Typography, Input, Button, Dialog, DialogHeader, DialogFooter } from "@material-tailwind/react";
import { MdOutlineSearch } from "react-icons/md";
import { RiFileDownloadFill } from "react-icons/ri";
import ExcelJS from 'exceljs';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import styles from "./TableGlobalAttendanceComponent.module.css";
import dayjs from 'dayjs';

const TableAttendanceComponent = ({
    title,
    tableHeaders, 
    tableData,
    tableKeys,
    rowsPerPageOptions = [5, 10, 15],
    isDownload = false,
    noContent,
    classroomInfo
}) => {
    const formatedHeaders = tableHeaders.slice(1);
    const currentDate = dayjs(new Date()).format("YYYY");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(tableData);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
        const filtered = tableData.filter(row => 
            row.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.student.nie.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, tableData]);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleDownloadExcel = async () => {
        if (selectedRows.length === 0 && formatedHeaders.length > 1 && tableKeys.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');
            
            worksheet.addRow(formatedHeaders);
            
            filteredData.forEach(row => {
                const newRow = tableKeys.map(key => key.split(".").reduce((acc, part) => acc ? acc[part] : "N/A", row));
                worksheet.addRow(newRow);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), `Inasistencia Global ${classroomInfo.classroomGrade} (${classroomInfo.shiftName})-${currentDate}.xlsx`);
            handleCloseDialog();
        }

        if (selectedRows.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');
            
            worksheet.addRow(formatedHeaders);
            
            selectedRows.forEach(row => {
                const newRow = tableKeys.map(key => key.split(".").reduce((acc, part) => acc ? acc[part] : "N/A", row));
                worksheet.addRow(newRow);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), `Inasistencia Global ${classroomInfo.classroomGrade} (${classroomInfo.shiftName})-${currentDate}.xlsx`);
            handleCloseDialog();
        }
    };

    const handleDownloadCSV = () => {
        if (selectedRows.length === 0 && formatedHeaders.length > 1 && tableKeys.length > 0) {
            const csvData = filteredData.map(row => {
                const newRow = {};
                tableKeys.forEach((key, index) => {
                    newRow[formatedHeaders[index]] = key.split(".").reduce((acc, part) => acc ? acc[part] : "N/A", row);
                });
                return newRow;
            });

            const csvContent = Papa.unparse(csvData, { header: true });
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `Inasistencia Global - ${classroomInfo.classroomGrade} (${classroomInfo.shiftName}) - ${currentDate}.csv`);
            handleCloseDialog();
        }


        if (selectedRows.length > 0) {
            const csvData = selectedRows.map(row => {
                const newRow = {};
                tableKeys.forEach((key, index) => {
                    newRow[formatedHeaders[index]] = key.split(".").reduce((acc, part) => acc ? acc[part] : "N/A", row);
                });
                return newRow;
            });

            const csvContent = Papa.unparse(csvData, { header: true });
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `Inasistencia Global - ${classroomInfo.classroomGrade} (${classroomInfo.shiftName}) - ${currentDate}.csv`);
            handleCloseDialog();
        }
    };

    const handleSelectAllChange = () => {
        if (isSelectAll) {
            setSelectedRows([]);
        } else {
            setSelectedRows(filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage));
        }
        setIsSelectAll(!isSelectAll);
    };

    const handleCheckboxChange = (row) => {
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter(selected => selected !== row));
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return (
        <Card className="h-full w-full mx-auto">
            <CardHeader floated={false} shadow={false}>
                <div className={styles.userHeaderContainer}>
                    <div className="flex items-center">
                        {isDownload && (
                            <input
                                type="checkbox"
                                checked={isSelectAll}
                                onChange={handleSelectAllChange}
                            />
                        )}
                        <Typography color="blue-gray" className="text-lg ml-2">
                            {title}
                        </Typography>
                    </div>
                    <div className="flex items-center gap-3 p-1">
                        <Input
                            label="Buscar"
                            icon={<MdOutlineSearch size={24} />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.userHeaderInput}
                        />
                        {isDownload && (
                            noContent ? (
                                <Typography as="a" href="#" size="sm" className='hover:pointer-events-none text-gray-400'>
                                    <RiFileDownloadFill size={24} />
                                </Typography>
                            ) : (
                                <Typography as="a" href="#" size="sm" onClick={handleOpenDialog} className='text-gray-900'>
                                    <RiFileDownloadFill size={24} />
                                </Typography>
                            )
                        )}
                    </div>
                </div>
                <Dialog open={openDialog} handler={handleOpenDialog}>
                    <DialogHeader>Descargar {title}</DialogHeader>
                    <DialogFooter className="flex flex-col items-center gap-4">
                        <Button color="green" onClick={handleDownloadExcel}>Descargar Excel</Button>
                        <Button color="blue" onClick={handleDownloadCSV}>Descargar CSV</Button>
                        <Button color="red" onClick={handleCloseDialog}>Cancelar</Button>
                    </DialogFooter>
                </Dialog>
            </CardHeader>

            {/* Body */}
            <CardBody className={`${styles["table-container"]} px-0 py-1 overflow-scroll`}>
                <table className={`${styles.table} text-left`}>
                    <thead>
                        <tr>
                            {tableHeaders.map((head, index) => (
                                <th key={index} className="bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            noContent ? (
                                <tr>
                                    <td colSpan={tableHeaders.length} className="p-4 text-center">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            No hay datos para mostrar
                                        </Typography>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, index) => (
                                    <tr key={index} className={selectedRows.includes(row) ? styles["selected-row"] : ""}>
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(row)}
                                                onChange={() => handleCheckboxChange(row)}
                                            />
                                        </td>
                                        {tableKeys.map((key, idx) => (
                                            <td key={idx} className="p-4">
                                                {key.split(".").reduce((acc, part) => acc ? acc[part] : "N/A", row)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
            </CardBody>

            {/* Footer */}
            <CardFooter className={styles.paginationFooterContainer}>
                <div className="flex items-center gap-2">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Filas por página:
                    </Typography>
                    <select
                        className="border border-blue-gray-300 rounded-md px-2 py-1"
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    >
                        {rowsPerPageOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <Typography variant="small" color="blue-gray">
                    {startIndex + 1}-{endIndex} de {filteredData.length}
                </Typography>
                <div className={styles.paginationButtons}>
                    <Button variant="outlined" size="sm" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                        Anterior
                    </Button>
                    <Button variant="outlined" size="sm" disabled={endIndex >= filteredData.length} onClick={() => handlePageChange(currentPage + 1)}>
                        Siguiente
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default TableAttendanceComponent;