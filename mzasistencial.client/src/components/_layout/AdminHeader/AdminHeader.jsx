import React, { useEffect, useMemo, useRef, useReducer } from 'react'; // Cambiado useState por useReducer
import { useNavigate } from "react-router-dom";
import { Popup } from 'devextreme-react/popup';
import { Button } from 'devextreme-react/button';
import { Tooltip } from 'devextreme-react/tooltip';
import { useTranslation } from "react-i18next";
import * as rdd from 'react-device-detect';
import AuthService from '@services/auth/AuthService';
import { TextBox } from 'devextreme-react';
import DropDownButton from 'devextreme-react/drop-down-button';
import './AdminHeader.css';
// import SelectBox from 'devextreme-react/select-box';

// 1. Estado inicial
const initialState = {
    isMobile: rdd.isMobile,
    popupVisible: false,
    popupVisibleUser: false,
    usuarioActivo: '',
    username: '',
    toastVisible: false,
    loggedUser: '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    passwordError: null,
};

// 2. Reducer para gestionar toda la lógica de estado
function headerReducer(state, action) {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'INIT_USER':
            return { ...state, username: action.username, usuarioActivo: action.usuarioActivo };
        case 'SHOW_LOGOUT':
            return { ...state, popupVisible: true };
        case 'SHOW_PASSWORD_MODAL':
            return { ...state, popupVisibleUser: true };
        case 'HIDE_TOAST':
            return { ...state, toastVisible: false };
        case 'SET_ERROR':
            return { ...state, toastVisible: true, passwordError: action.error };
        case 'RESET_MODALS':
            return { 
                ...state, 
                popupVisible: false, 
                popupVisibleUser: false,
                loggedUser: '',
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: '',
                toastVisible: false,
                passwordError: null
            };
        default:
            return state;
    }
}

function AdminHeader(props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const popupRefUser = useRef(null);

    // 3. Inicialización del Reducer
    const [state, dispatch] = useReducer(headerReducer, initialState);

    // Desestructuración del estado
    const { 
        username, popupVisible, popupVisibleUser, loggedUser, 
        oldPassword, newPassword, confirmNewPassword, 
        toastVisible, passwordError 
    } = state;

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('username'));
        const activeUser = AuthService.getUser();
        dispatch({ type: 'INIT_USER', username: storedUser, usuarioActivo: activeUser });
    }, []);

    const destroyModal = () => {
        dispatch({ type: 'RESET_MODALS' });
    };

    const handleShowLogout = () => {
        dispatch({ type: 'SHOW_LOGOUT' });
    };

    const handleCLoseSesion = () => {
        dispatch({ type: 'RESET_MODALS' });
        AuthService.removeUserData();
        navigate("/");
    };

    const handleShowPasswordData = () => {
        dispatch({ type: 'SHOW_PASSWORD_MODAL' });
    };

    const validatePassword = (password, oldPass, confirmPass) => {
        if (!loggedUser) return t('password.errorUser');
        if (!oldPass) return t('password.errorPasswordOld');
        if (!password) return t('password.errorPassword');
        if (password.length < 12) return t('password.errorNunCaracter');
        if (!/[a-z]/.test(password)) return t('password.errorLetterMin');
        if (!/[A-Z]/.test(password)) return t('password.errorLetterMay');
        if (!/\d/.test(password)) return t('password.errorNumRequire');
        if (!/[^a-zA-Z0-9\s]/.test(password)) return t('password.errorCaracterRequire');
        if (password !== confirmPass) return t('password.errorPasswordEqual');
        return null;
    };

    const handleChangeUserData = () => {
        const error = validatePassword(newPassword, oldPassword, confirmNewPassword);
        if (error) {
            dispatch({ type: 'SET_ERROR', error });
            return;
        }
        // Lógica de API aquí
        console.log('Cambio de contraseña realizado');
        destroyModal();
    };

    const handleFocus = () => {
        if (toastVisible) dispatch({ type: 'HIDE_TOAST' });
    };

    const popupAttributes = useMemo(() => ({
        id: 'modal-component-center',
        class: 'modal-component-center'
    }), []);

    const popupAttributesPassword = useMemo(() => ({
        id: 'modal-component-center',
        class: 'modal-component-center modal-password'
    }), []);

    const handleToogleSidebar = () => {
        document.body.classList.toggle('sidebar-collapsed');
    };

    const actions = [
            { id: 'logout', text: 'Cerrar sesión', icon: 'runner' },
            { id: 'password', text: 'Cambiar contraseña', icon: 'key' },
        ];

        const handleActionClick = (e) => {
            if (e.itemData.id === 'logout') handleShowLogout();
            if (e.itemData.id === 'password') handleShowPasswordData();
        };



    return (
        <React.Fragment>
            <header id="top-header-admin">
                <div className='item-admin-header item-admin-header-actions'>
                    <div className="mz-list-options" id="item-left">
                        <div className="item-option ico-menu-collapse">
                            <button type='button' className='mz-btn-link' id="btn-collapse-sidebar" onClick={(e) => { e.preventDefault(); handleToogleSidebar(); }}>
                                <i className="ri-menu-fill"></i>
                            </button>
                        </div>
                    </div>

                    <div className='admin-action'>
                        <div className='item-admin-action header-filters'>
                            {/* Usuario */}
                            <div className="filter-item">
                                <i className="ri-user-line"></i>
                                <span>ecua1</span>
                            </div>

                            {/* Rol */}
                            <div className="filter-item">
                                <i className="ri-user-3-line"></i>
                                <span>Admin</span>
                            </div>

                            {/* Año */}
                            <div className="filter-item">
                                <i className="ri-calendar-line"></i>
                                <DropDownButton
                                    text="Calendario"
                                    icon={null}
                                    items={[
                                        { id: '2025', text: '2025' },
                                        { id: '2024', text: '2024' }
                                    ]}
                                    keyExpr="id"
                                    displayExpr="text"
                                    stylingMode="text"
                                    splitButton={false}
                                    elementAttr={{ class: 'filter-dropdown-custom' }}
                                    dropDownOptions={{
                                        width: 160
                                    }}
                                />
                            </div>

                            {/* Tipo */}
                            <div className="filter-item">
                                <i className="ri-filter-3-line"></i>
                                <DropDownButton
                                    text="Todas"
                                    icon={null}
                                    items={[
                                        { id: 'todas', text: 'Todas' },
                                        { id: 'activas', text: 'Activas' }
                                    ]}
                                    keyExpr="id"
                                    displayExpr="text"
                                    stylingMode="text"
                                    splitButton={false}
                                    elementAttr={{ class: 'filter-dropdown-custom' }}
                                    dropDownOptions={{
                                        width: 160
                                    }}
                                />
                            </div>

                        </div>

                    </div>
                </div>
            </header>

            {/* Popup Logout */}
            <Popup
                visible={popupVisible}
                onHiding={destroyModal}
                width={'350px'}
                height='350px'
                showTitle={false}
                wrapperAttr={popupAttributes}
                position="center"
            >
                <div className='popup-inner'>
                    <div className='popup-body'>
                        <div className='ico-popup-body'><i className="ri-information-line"></i></div>
                        <h2>{t('CerrarSessionAsk')}</h2>
                    </div>
                    <div className='popup-footer'>
                        <Button text={t('cancelar')} onClick={destroyModal} />
                        <Button text={t('aceptar')} onClick={handleCLoseSesion} />
                    </div>
                </div>
            </Popup>

            {/* Popup Cambio Contraseña */}
            <Popup
                ref={popupRefUser}
                visible={popupVisibleUser}
                onHiding={destroyModal}
                width={'750px'}
                height='auto'
                showTitle={false}
                wrapperAttr={popupAttributesPassword}
                position="center"
            >
                <div className='popup-cover'>
                    <div className='popup-help'>
                        <h3>{t('password.requisitos')}</h3>
                        <ul>
                            <li>{t('password.numCaracteres')}</li>
                            <li>{t('password.lettermin')}</li>
                            <li>{t('password.lettermay')}</li>
                            <li>{t('password.numRequire')}</li>
                            <li>{t('password.especialChart')}</li>
                        </ul>
                    </div>
                    <div className='popup-inner'>
                        <div className='popup-body'>
                            <div className='form-group'>
                                <label>{t('common.usuario')}:</label>
                                <TextBox value={loggedUser} onValueChanged={(e) => updateField('loggedUser', e.value)} onFocusIn={handleFocus} />
                            </div>
                            <div className='form-group'>
                                <label>{t('password.oldPassword')}:</label>
                                <TextBox mode="password" value={oldPassword} onValueChanged={(e) => updateField('oldPassword', e.value)} onFocusIn={handleFocus} />
                            </div>
                            <div className='form-group'>
                                <label>{t('password.newPassword')}:</label>
                                <TextBox mode="password" value={newPassword} onValueChanged={(e) => updateField('newPassword', e.value)} onFocusIn={handleFocus} />
                            </div>
                            <div className='form-group'>
                                <label>{t('password.confirmPassword')}:</label>
                                <TextBox mode="password" value={confirmNewPassword} onValueChanged={(e) => updateField('confirmNewPassword', e.value)} onFocusIn={handleFocus} />
                            </div>
                        </div>
                        <div className='popup-footer'>
                            <Button text={t('common.cancelar')} onClick={destroyModal} />
                            <Button text={t('common.aceptar')} onClick={handleChangeUserData} />
                        </div>
                    </div>
                </div>
                {toastVisible && <div className="messages-error">{passwordError}</div>}
            </Popup>
        </React.Fragment>
    );
}

export default AdminHeader;