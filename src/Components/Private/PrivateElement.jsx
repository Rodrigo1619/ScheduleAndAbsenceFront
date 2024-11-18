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

                if(role) {
                    if(!admittedRoles.some(routeRole => routeRole === role.name)) {
                        setHasPermission(false);
                    }
                }
            
            } catch (error) {
            
                if(error == 403){
                    localStorage.removeItem("token");
                    setHasPermission(false);
                }

                setHasPermission(false);
            }

        }

        verifyRole();
    }, []);
    
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