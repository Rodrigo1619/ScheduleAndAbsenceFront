import React, { useState, useEffect } from 'react';
import { CardHeader, Typography, Input, Dialog, DialogHeader, DialogFooter, Button } from "@material-tailwind/react";
import { MdOutlinePersonSearch } from "react-icons/md";
import { RiFileDownloadFill } from "react-icons/ri";
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import Papa from 'papaparse';
import styles from "./HeaderTableUser.module.css";

const HeaderTableUser = ({ 
    title, 
    searchTerm, 
    setSearchTerm, 
    handleDelete, 
    selectedRows = [], 
    tableHeaders = [], 
    tableKeys = [], 
    isDownload = false, 
    allRows = [], 
    setSelectedRows,
    AllData,
 }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [isSelectAll, setIsSelectAll] = useState(false);

    const formatedHeaders = tableHeaders.slice(1);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleDownloadExcel = async () => {

        if (selectedRows.length === 0 && tableHeaders.length > 1 && tableKeys.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            // Add header row
            worksheet.addRow(formatedHeaders);

            // Add data rows
            AllData.forEach(row => {
                const newRow = tableKeys.map((key) => {
                    if (key.includes(".")) {
                        return key.split(".").reduce((acc, part) => acc ? acc[part] : "N/A", row);
                    } else {
                        return row[key];
                    }
                });
                worksheet.addRow(newRow);
            });

            // Export workbook to Excel
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), `${title}.xlsx`);
            handleCloseDialog();
        }

        if (selectedRows.length > 0 && tableHeaders.length > 1 && tableKeys.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            // Add header row
            worksheet.addRow(formatedHeaders);

            // Add data rows
            selectedRows.forEach(row => {
                const newRow = tableKeys.map((key) => {
                    if (key.includes(".")) {
                        return key.split(".").reduce((acc, part) => acc ? acc[part] : "N/A", row);
                    } else {
                        return row[key];
                    }
                });
                worksheet.addRow(newRow);
            });

            // Export workbook to Excel
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), `${title}.xlsx`);
            handleCloseDialog();
        } else {
        }
    };

    const handleDownloadCSV = () => {

        if (selectedRows.length === 0 && tableHeaders.length > 1 && tableKeys.length > 0) {
            const csvData = AllData.map(row => {
                const newRow = {};
                tableKeys.forEach((key, index) => {
                    if (key.includes(".")) {
                        const keys = key.split(".");
                        let value = row;
                        keys.forEach(k => {
                            value = value ? value[k] : "N/A";
                        });
                        newRow[formatedHeaders[index]] = value;
                    } else {
                        newRow[formatedHeaders[index]] = row[key];
                    }
                });
                return newRow;
            });

            const csvContent = Papa.unparse(csvData, { header: true });
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `${title}.csv`);
            handleCloseDialog();
        }

        if (selectedRows.length > 0 && tableHeaders.length > 1 && tableKeys.length > 0) {
            const csvData = selectedRows.map(row => {
                const newRow = {};
                tableKeys.forEach((key, index) => {
                    if (key.includes(".")) {
                        const keys = key.split(".");
                        let value = row;
                        keys.forEach(k => {
                            value = value ? value[k] : "N/A";
                        });
                        newRow[formatedHeaders[index]] = value;
                    } else {
                        newRow[formatedHeaders[index]] = row[key];
                    }
                });
                return newRow;
            });

            const csvContent = Papa.unparse(csvData, { header: true });
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `${title}.csv`);
            handleCloseDialog();
        } else {
        }
    };

    const handleSelectAllChange = () => {
        if (isSelectAll) {
            setSelectedRows([]);
        } else {
            setSelectedRows(allRows);
        }
        setIsSelectAll(!isSelectAll);
    };

    useEffect(() => {
        setIsSelectAll(allRows.length > 0 && selectedRows.length === allRows.length);
    }, [selectedRows, allRows]);

    return (
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
                    <Typography color="blue-gray" className="text-lg text-xs-mobile-390 sm:text-xs-mobile-390 xs:text-xs-mobile-280 ml-2">
                        {title}
                    </Typography>
                </div>
                <div className="flex shrink-0 flex-row gap-3 items-center Mobile-390*844:gap-2 Mobile-280:gap-1 pr-1">
                    <Input
                        label="Buscar"
                        icon={<MdOutlinePersonSearch size={24} />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.userHeaderInput}
                    />
                    {isDownload && (
                        <Typography as="a" href="#" color="blue-gray" className={styles.userHeaderButton} size="sm" onClick={handleOpenDialog}>
                            <RiFileDownloadFill size={24} />
                        </Typography>
                    )}
                </div>
            </div>
            <Dialog open={openDialog} handler={handleOpenDialog}>
                <DialogHeader>Descargar {title}</DialogHeader>
                <DialogFooter className="flex flex-col items-center gap-4">
                    <Button color="green" className="m-4" onClick={handleDownloadExcel}>Descargar Excel</Button>
                    <Button color="blue" className="m-4" onClick={handleDownloadCSV}>Descargar CSV</Button>
                    <Button color="red" className="m-4" onClick={handleCloseDialog}>Cancelar</Button>
                </DialogFooter>
            </Dialog>
        </CardHeader>
    );
};

export default HeaderTableUser;
