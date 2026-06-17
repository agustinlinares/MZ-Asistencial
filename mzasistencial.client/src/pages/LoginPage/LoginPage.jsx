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
    toastType: "error", // "error" | "warning"
    showPassword: false,
    isLoading: false,
    isPasswordModalOpen: false,
    userIdForPasswordModal: null,
    requiereCaptcha: false,
    captchaId: null,
    captchaTexto: "",
    captchaUrl: null,
};

function loginReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'START_LOGIN':
            return { ...state, isLoading: true, toastVisible: false };
        case 'LOGIN_ERROR':
            return { ...state, isLoading: false, toastVisible: true, toastMessage: action.message, toastType: action.toastType || "error" };
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
        case 'SET_CAPTCHA':
            return {
                ...state,
                isLoading: false,
                toastVisible: true,
                toastMessage: action.message,
                toastType: "warning",
                requiereCaptcha: true,
                captchaId: action.captchaId,
                captchaTexto: "",
                captchaUrl: `/api/Auth/captcha?id=${action.captchaId}&t=${Date.now()}`,
            };
        case 'REFRESH_CAPTCHA':
            return {
                ...state,
                captchaId: action.captchaId,
                captchaTexto: "",
                captchaUrl: `/api/Auth/captcha?id=${action.captchaId}&t=${Date.now()}`,
            };
        case 'CLEAR_CAPTCHA':
            return { ...state, requiereCaptcha: false, captchaId: null, captchaTexto: "", captchaUrl: null };
        default:
            return state;
    }
}

const LoginPage = () => {
    const navigate = useNavigate();
    const txtUserRef = useRef(null);
    const [state, dispatch] = useReducer(loginReducer, initialState);
    const {
        username, password, toastVisible, toastMessage, toastType,
        showPassword, isLoading, requiereCaptcha, captchaId, captchaTexto, captchaUrl
    } = state;

    const logError = useLogError("Página de login");

    const handleLogin = async () => {
        dispatch({ type: 'START_LOGIN' });

        if (!username && !password) {
            dispatch({ type: 'LOGIN_ERROR', message: 'Se requieren nombre de usuario y contraseña.' });
            return;
        }

        try {
            const body = {
                usuario: username,
                contrasena: password,
                captchaId: captchaId || null,
                captchaTexto: captchaTexto || null,
            };

            const res = await fetch('/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.status === 429) {
                // Usuario bloqueado
                dispatch({ type: 'LOGIN_ERROR', message: data.message, toastType: "error" });
                dispatch({ type: 'CLEAR_CAPTCHA' });
                return;
            }

            if (!res.ok) {
                logError(`Intento de login fallido para usuario: ${username}. Estado: ${res.status}`);

                if (data.requiereCaptcha && data.captchaId) {
                    dispatch({ type: 'SET_CAPTCHA', captchaId: data.captchaId, message: data.message });
                } else if (data.requiereCaptcha) {
                    const nuevoId = data.captchaId || captchaId;
                    dispatch({ type: 'REFRESH_CAPTCHA', captchaId: nuevoId });
                    dispatch({ type: 'LOGIN_ERROR', message: data.message, toastType: "warning" });
                } else {
                    dispatch({ type: 'LOGIN_ERROR', message: data.message || 'Usuario o contraseña incorrectos.' });
                }
                return;
            }

            // Login exitoso
            AuthService.setUserData(data);
            dispatch({ type: 'LOGIN_SUCCESS' });
            dispatch({ type: 'CLEAR_CAPTCHA' });

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

                        {/* Captcha */}
                        {requiereCaptcha && captchaUrl && (
                            <div className="captcha-box">
                                <img
                                    src={captchaUrl}
                                    alt="Captcha"
                                    className="captcha-imagen"
                                />
                                <TextBox
                                    value={captchaTexto}
                                    onValueChanged={(e) => dispatch({ type: 'SET_FIELD', field: 'captchaTexto', value: e.value })}
                                    placeholder={"Introduce el texto de la imagen"}
                                    className="input-form"
                                />
                            </div>
                        )}

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
                        <div className={`messages-error ${toastType === "warning" ? "messages-warning" : ""}`}>
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