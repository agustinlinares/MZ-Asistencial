import { useReducer, useRef, useEffect } from "react";
import { Button, TextBox, LoadIndicator } from "devextreme-react";
import { CheckBox } from 'devextreme-react/check-box';
import { useNavigate } from "react-router-dom";

import './LoginPage.css';

const initialState = {
    username: "",
    password: "",
    toastVisible: false,
    toastMessage: "",
    showPassword: false,
    isLoading: false,
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

    const handleLogin = async () => {
        dispatch({ type: 'START_LOGIN' });

        if (!username || !password) {
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
                dispatch({ type: 'LOGIN_ERROR', message: err.message || 'Usuario o contraseña incorrectos.' });
                return;
            }

            const data = await res.json();
            // Guardar datos del usuario en sessionStorage
            sessionStorage.setItem('user', JSON.stringify(data));
            dispatch({ type: 'LOGIN_SUCCESS' });
            navigate("/Admin/ResumendeGastos");
        } catch (error) {
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
                    <form className="login-form">
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
        </div>
    );
};

export default LoginPage;
