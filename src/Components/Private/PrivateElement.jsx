import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { useUserContext } from '../../Context/userContext';
import { userService } from '../../Services/userService';

const PrivateElement = ({ admittedRoles, children }) => {
    const [hasPermission, setHasPermission] = useState(true);
    const { token } = useUserContext();


    useEffect(() => {
        
        const verifyRole = async () => {

            try {
            
                const { role } = await userService.verifyToken(token);
                console.log("Rol del usuario: ", role);

                if(role) {
                    console.log("Roles admitidos: ", admittedRoles);
                    if(!admittedRoles.some(routeRole => routeRole === role.name)) {
                        console.log("El usuario no tiene permisos para acceder a la página");
                        setHasPermission(false);
                    }
                }
            
            } catch (error) {
            
                if(error == 403){
                    console.log("El usuario no tiene permisos para acceder a la página");
                    localStorage.removeItem("token");
                    console.log("Token eliminado");
                    setHasPermission(false);
                }

                console.log("Error al verificar el rol: ", error);
                setHasPermission(false);
            }

        }

        verifyRole();
    }, []);

    console.log("Has permission: ", hasPermission);
    
    if(hasPermission) {
        if(token){
            return children;
        }else{
            return <Navigate to="/" />;
        }
    } else {
        return <Navigate to="/PageNotFound" />;
    }

};

export default PrivateElement;