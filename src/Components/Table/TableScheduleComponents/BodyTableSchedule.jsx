// TableUser.jsx
import { CardBody, Typography } from "@material-tailwind/react";
import styles from "./BodyTableSchedule.module.css"; // Importa los estilos modulares

const BodyTableUser = ({ TABLE_HEAD, USERS, selectedRows, handleCheckboxChange }) => {
    return (
        <CardBody className={`${styles["table-container"]} px-0 py-1 overflow-scroll`}>
        <table className={`${styles.table} text-left`}>
            <thead>
            <tr>
                {TABLE_HEAD.map((head, index) => (
                <th key={index} className="bg-blue-gray-50 p-4">
                    <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                    >
                    {head}
                    </Typography>
                </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {USERS.map((user, index) => (
                <tr key={index} className={selectedRows.includes(index) ? styles["selected-row"] : ""}>
                <td className="p-4">
                    <input
                    type="checkbox"
                    checked={selectedRows.includes(user)}
                    onChange={() => handleCheckboxChange(index, user)}
                    />
                </td>
                {Object.entries(user).map(([key, value]) => (
                    <td className="p-4" key={key}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        {value}
                    </Typography>
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        </CardBody>
    );
};

export default BodyTableUser;
