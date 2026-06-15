import { useReducer, useRef, useEffect } from "react";
import { Button, TextBox, LoadIndicator } from "devextreme-react";
import { CheckBox } from 'devextreme-react/check-box';
import { useNavigate } from "react-router-dom";
import AuthService from '@services/auth/AuthService';
import { useLogError } from '../../hooks/useLogError';
import CambioPasswordModal from '../Admin/Admin/CambioPasswordModal';

import './LoginPage.css';

const initialState = {
    username: "",
    password: "",
    toastVisible: false,
    toastMessage: "",
    showPassword: false,
    isLoading: false,
    isPasswordModalOpen: false,
    userIdForPasswordModal: null
};

function loginReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'START_LOGIN':
            return { ...state, isLoading: true, toastVisible: false };
        case 'LOGIN_ERROR':
            return { ...state, isLoading: false, toastVisible: true, toastMessage: action.message };
        case 'LOGIN_SUCCESS':
            return { ...state, isLoading: false };
        case 'SHOW_PASSWORD_MODAL':
            return { ...state, isPasswordModalOpen: true, userIdForPasswordModal: action.userId };
        case 'HIDE_PASSWORD_MODAL':
            return { ...state, isPasswordModalOpen: false, userIdForPasswordModal: null };
        case 'TOGGLE_PASSWORD':
            return { ...state, showPassword: !state.showPassword };
        case 'HIDE_TOAST':
            return { ...state, toastVisible: false };
        default:
            return state;
    }
}

const LoginPage = () => {
    const navigate = useNavigate();
    const txtUserRef = useRef(null);
    const [state, dispatch] = useReducer(loginReducer, initialState);
    const { username, password, toastVisible, toastMessage, showPassword, isLoading } = state;

    const logError = useLogError("Página de login");

    const handleLogin = async () => {
        dispatch({ type: 'START_LOGIN' });

        if (!username && !password) {
            dispatch({ type: 'LOGIN_ERROR', message: 'Se requieren nombre de usuario y contraseña.' });
            return;
        }

        try {
            const res = await fetch('/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario: username, contrasena: password }),
            });

            if (!res.ok) {
                const err = await res.json();
                logError(`Intento de login fallido para usuario: ${username}. Estado: ${res.status}`);
                dispatch({ type: 'LOGIN_ERROR', message: err.message || 'Usuario o contraseña incorrectos.' });
                return;
            }

            const data = await res.json();
            AuthService.setUserData(data);
            dispatch({ type: 'LOGIN_SUCCESS' });

            if (data.requiresPasswordChange) {
                dispatch({ type: 'SHOW_PASSWORD_MODAL', userId: data.usuarioId });
            } else {
                navigate("/Admin/ResumendeGastos");
            }
        } catch (error) {
            logError("Fallo crítico de conexión al intentar iniciar sesión", error);
            console.error("Error en login:", error);
            dispatch({ type: 'LOGIN_ERROR', message: 'Error de conexión. Inténtelo de nuevo.' });
        }
    };

    const handleFocus = () => {
        if (toastVisible) dispatch({ type: 'HIDE_TOAST' });
    };

    useEffect(() => {
        if (txtUserRef.current && txtUserRef.current.instance) {
            txtUserRef.current.instance().focus();
        }
    }, []);

    return (
        <div className="login-page-container">
            <header id="login-header">
                <div id="logo-cliente">
                    <img src="/assets/img/logos/mercanza_logo.png" alt="Mercanza" />
                </div>
            </header>

            <div id="login-body">
                <div className="login-instance">
                    <div className="login-leyend">
                        <img className="logo-app" src="/assets/img/logos/mercanza_logo.png" alt="Mercanza" />
                    </div>
                    <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                        <TextBox
                            value={username}
                            onValueChanged={(e) => dispatch({ type: 'SET_FIELD', field: 'username', value: e.value })}
                            placeholder={'Usuario'}
                            className="input-form"
                            ref={txtUserRef}
                            onFocusIn={handleFocus}
                        />
                        <div className="relative-box">
                            <TextBox
                                value={password}
                                onValueChanged={(e) => dispatch({ type: 'SET_FIELD', field: 'password', value: e.value })}
                                placeholder={"Contraseña"}
                                mode={showPassword ? "text" : "password"}
                                className="input-form input-form-password"
                                onFocusIn={handleFocus}
                            />
                            <Button
                                onClick={() => dispatch({ type: 'TOGGLE_PASSWORD' })}
                                className="btn-absolute"
                                stylingMode="text"
                                icon={showPassword ? "ri ri-eye-off-line" : "ri ri-eye-line"}
                            />
                        </div>
                        <div className="relative-box">
                            <Button
                                className="btn-form"
                                text={"Ingresar"}
                                type="default"
                                onClick={handleLogin}
                                useSubmitBehavior={false}
                            />
                        </div>
                        <div className="help-cover">
                            <CheckBox text={"Recuerdame"} hint={"Recuerdame"} />
                            <button type="button" className="reset_password">{"¿Olvidaste tu contraseña?"}</button>
                        </div>

                        {isLoading && (
                            <div className="LoadIndicatorCover">
                                <LoadIndicator visible={isLoading} />
                            </div>
                        )}
                    </form>
                    {toastVisible && (
                        <div className="messages-error">
                            {toastMessage}
                        </div>
                    )}
                </div>
            </div>

            {state.isPasswordModalOpen && (
                <CambioPasswordModal 
                    visible={state.isPasswordModalOpen}
                    usuarioId={state.userIdForPasswordModal}
                    onClose={() => {
                        dispatch({ type: 'HIDE_PASSWORD_MODAL' });
                        navigate("/Admin/ResumendeGastos");
                    }}
                />
            )}
        </div>
    );
};

export default LoginPage;
