import React, { useState, useEffect } from 'react';
import {Card, CardHeader, CardBody, CardFooter, Typography, Input, Button, Dialog, DialogHeader, DialogFooter } from "@material-tailwind/react";
import { MdOutlineSearch, MdOutlineVisibility } from "react-icons/md";
import { RiFileDownloadFill } from "react-icons/ri";
import ExcelJS from 'exceljs';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import styles from "./TableGeneralAttendanceComponent.module.css";

const TableAttendanceComponent = ({
    title,
    tableHeaders, // Headers for the table
    tableData = [], // Default to an empty array if tableData is undefined
    tableKeys,    // Keys for accessing nested data
    rowsPerPageOptions = [5, 10, 15], // Options for number of rows per page
    showUpdateButton = true,
    isDownload = false,
    noChange = true,
    handleUpdate,
    handleDelete
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(tableData);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const filtered = tableData.filter(row => 
            Object.values(row).some(val => 
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredData(filtered);
    }, [searchTerm, tableData]);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleDownloadExcel = async () => {
        if (selectedRows.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');
            worksheet.addRow(tableHeaders);

            selectedRows.forEach(row => {
                const newRow = tableKeys.map(key => key.split(".").reduce((acc, part) => acc ? acc[part] : "N/A", row));
                worksheet.addRow(newRow);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Data.xlsx");
            handleCloseDialog();
        }
    };

    const handleDownloadCSV = () => {
        if (selectedRows.length > 0) {
            const csvData = selectedRows.map(row => {
                const newRow = {};
                tableKeys.forEach((key, index) => {
                    newRow[tableHeaders[index]] = key.split(".").reduce((acc, part) => acc ? acc[part] : "N/A", row);
                });
                return newRow;
            });

            const csvContent = Papa.unparse(csvData, { header: true });
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, "Data.csv");
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
                            <Typography as="a" href="#" color="blue-gray" size="sm" onClick={handleOpenDialog}>
                                <RiFileDownloadFill size={24} />
                            </Typography>
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
                        {paginatedData.map((row, index) => (
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
                                {showUpdateButton && noChange && (
                                    <td className="p-4">
                                        <Typography as="a" href="#" variant="small" onClick={() => handleUpdate(row)}>
                                            <MdOutlineVisibility size={24} />
                                        </Typography>
                                    </td>
                                )}
                                {noChange && (
                                    <td className="p-4 text-center align-middle">
                                        <Typography as="a" href="#" variant="small" onClick={() => handleDelete(row)}>
                                            <MdOutlineVisibility size={24} />
                                        </Typography>
                                    </td>
                                )}
                            </tr>
                        ))}
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