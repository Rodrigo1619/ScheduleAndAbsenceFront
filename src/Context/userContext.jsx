import React, {useState, useEffect, useMemo, useCallback} from 'react';
import { userService } from '../Services/userService';

const UserContext = React.createContext();

export const UserProvider = (props) => {

    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState();
    const [tokenVerified, setTokenVerified] = useState(false);

    useEffect(() => {
        
        const verifyTokenAsync = async () => {
            const lsToken = getToken();

            if(lsToken && !tokenVerified) {
                
                const { email, role, name } = await userService.verifyToken(lsToken);
                if(email && role && name) {
                    setUser({ email, role, name });
                    setTokenAll(lsToken);
                }
                setTokenVerified(true);
            }
        }

        verifyTokenAsync();
    }, [token, tokenVerified])

    const setTokenAll = (newToken) => {
        if (newToken) {
            localStorage.setItem("token", newToken);
        }
        else {
            localStorage.removeItem("token");
        }
        setToken(newToken);
    };

    const login = useCallback((identifier, password)=> {
        const loginAsync = async () => {
            let status = false;
            try {

                const response = await userService.login(identifier, password);

                if(response["token"]) {
                    setTokenAll(response["token"]);
                    status = true;
                }

                return status;
            } catch (error) {
                throw error;
            } 
        };

        return loginAsync();
    }, [])

    /*const signup = useCallback((email, password, profilePic)=> {
        const signupAsync = async () => {
            let status = false;
            try {
                const response = await userService.signUp(email, password, profilePic);

                if(response != null) {
                    status = true;
                }
            
            } catch (error) {
            } finally {
            
                return status;
            
            }
        };

        return signupAsync();
    }, [])*/

    const logout = useCallback(() => {
        setUser(undefined);
        setTokenAll(undefined);
    }, [])

    const value = useMemo(()=> ({
        token: token,
        user: user,
        /*signup: signup,*/
        login: login,
        logout: logout,
    }), [token, user, login, logout]);

    return <UserContext.Provider value={value} {... props}/>;
}

export const useUserContext = () => {
    const context = React.useContext(UserContext);

    if (!context) {
        throw new Error("useUserContext() isn't inside of UserProvider");
    }

    return context;
}

const getToken = () => localStorage.getItem("token");
