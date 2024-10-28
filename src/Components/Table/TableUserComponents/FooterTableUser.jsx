import React from "react";
import { Typography, Button, CardFooter } from "@material-tailwind/react";
import styles from "./FooterTableUser.module.css";

const FooterTableUser = ({
    rowsPerPage,
    setRowsPerPage,
    startIndex,
    endIndex,
    filteredTeachers,
    currentPage,
    totalPages,
    handlePageChange
}) => (
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
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>
        <Typography variant="small" color="blue-gray" className={styles.paginationInfo}>
            {startIndex + 1}-{Math.min(endIndex, filteredTeachers.length)} de {filteredTeachers.length}
        </Typography>
        <div className={styles.paginationButtons}>
            <Button
                variant="outlined"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                Anterior
            </Button>
            <Button
                variant="outlined"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                Siguiente
            </Button>
        </div>
    </CardFooter>
);

export default FooterTableUser;
