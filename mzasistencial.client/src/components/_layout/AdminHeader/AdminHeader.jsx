import React, { useEffect, useMemo, useRef, useReducer } from 'react';
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

function AdminHeader() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const popupRefUser = useRef(null);

    const [state, dispatch] = useReducer(headerReducer, initialState);

    const { 
        username, popupVisible, popupVisibleUser, loggedUser, 
        oldPassword, newPassword, confirmNewPassword, 
        toastVisible, passwordError 
    } = state;

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('username'));
        const activeUser = AuthService.getUser();
        const usuarioActual = JSON.parse(localStorage.getItem('UsuarioActual') || '{}');
        const nombreUsuario = usuarioActual?.usuario || storedUser || '';
        const perfilId = usuarioActual?.perfilId;
        const nombrePerfil = perfilId === 1 ? 'Administrador' : perfilId === 2 ? 'Usuario' : perfilId === 4 ? 'Supervisor' : 'Usuario';
        dispatch({ type: 'INIT_USER', username: nombreUsuario, usuarioActivo: activeUser });
        dispatch({ type: 'SET_FIELD', field: 'nombrePerfil', value: nombrePerfil });
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
        { id: 'password', text: 'Cambiar contraseña', icon: 'key' },
    ];

    const handleActionClick = (e) => {
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
                                <span>{username || 'Usuario'}</span>
                            </div>

                            {/* Rol */}
                            <div className="filter-item">
                                <i className="ri-user-3-line"></i>
                                <span>{state.nombrePerfil || 'Usuario'}</span>
                            </div>

                            {/* Año */}
                            <div className="filter-item">
                                <i className="ri-calendar-line"></i>
                                <DropDownButton
                                    text={t('Calendario')}
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
                                    dropDownOptions={{ width: 160 }}
                                />
                            </div>

                            {/* Tipo */}
                            <div className="filter-item">
                                <i className="ri-filter-3-line"></i>
                                <DropDownButton
                                    text={t('Todas')}
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
                                    dropDownOptions={{ width: 160 }}
                                />
                            </div>

                            {/* Menú cambiar contraseña */}
                            <div className="filter-item">
                                <DropDownButton
                                    text="⚙"
                                    stylingMode="text"
                                    splitButton={false}
                                    showArrowIcon={false}
                                    items={actions}
                                    keyExpr="id"
                                    displayExpr="text"
                                    onItemClick={handleActionClick}
                                    elementAttr={{ class: 'filter-dropdown-custom header-user-menu' }}
                                    dropDownOptions={{ width: 180 }}
                                />
                            </div>

                            {/* ─── Botón Cerrar Sesión ────────────────────────────── */}
                            <div className="filter-item">
                                <button
                                    type="button"
                                    onClick={handleShowLogout}
                                    title="Cerrar sesión"
                                    style={{
                                        display:        'flex',
                                        alignItems:     'center',
                                        gap:            6,
                                        background:     '#e53935',
                                        color:          '#fff',
                                        border:         'none',
                                        borderRadius:   6,
                                        padding:        '6px 14px',
                                        fontSize:       13,
                                        fontWeight:     600,
                                        cursor:         'pointer',
                                        letterSpacing:  '0.3px',
                                        transition:     'background 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#b71c1c'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#e53935'}
                                >
                                    <i className="ri-logout-box-r-line" style={{ fontSize: 16 }}></i>
                                    Cerrar sesión
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            {/* ─── Popup Logout con estilo propio ─────────────────────────── */}
            <Popup
                visible={popupVisible}
                onHiding={destroyModal}
                width={380}
                height="auto"
                showTitle={false}
                wrapperAttr={popupAttributes}
                position="center"
                hideOnOutsideClick={true}
            >
                <div style={{
                    display:       'flex',
                    flexDirection: 'column',
                    alignItems:    'center',
                    padding:       '32px 28px 24px',
                    gap:           16,
                    textAlign:     'center',
                }}>
                    {/* Icono */}
                    <div style={{
                        width:          64,
                        height:         64,
                        borderRadius:   '50%',
                        background:     '#fff3e0',
                        display:        'flex',
                        alignItems:     'center',
                        justifyContent: 'center',
                        marginBottom:   4,
                    }}>
                        <i className="ri-logout-box-r-line" style={{ fontSize: 32, color: '#e53935' }}></i>
                    </div>

                    {/* Título */}
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#212121' }}>
                        ¿Cerrar sesión?
                    </h3>

                    {/* Subtítulo */}
                    <p style={{ margin: 0, fontSize: 14, color: '#757575', lineHeight: 1.5 }}>
                        Se cerrará la sesión actual y serás redirigido al inicio de sesión.
                    </p>

                    {/* Botones */}
                    <div style={{ display: 'flex', gap: 12, marginTop: 8, width: '100%' }}>
                        <button
                            type="button"
                            onClick={destroyModal}
                            style={{
                                flex:         1,
                                padding:      '10px 0',
                                border:       '1px solid #e0e0e0',
                                borderRadius: 6,
                                background:   '#fff',
                                color:        '#444',
                                fontSize:     14,
                                fontWeight:   600,
                                cursor:       'pointer',
                                transition:   'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleCLoseSesion}
                            style={{
                                flex:         1,
                                padding:      '10px 0',
                                border:       'none',
                                borderRadius: 6,
                                background:   '#e53935',
                                color:        '#fff',
                                fontSize:     14,
                                fontWeight:   600,
                                cursor:       'pointer',
                                transition:   'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#b71c1c'}
                            onMouseLeave={e => e.currentTarget.style.background = '#e53935'}
                        >
                            Cerrar sesión
                        </button>
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
                                <TextBox value={loggedUser} onValueChanged={(e) => dispatch({ type: 'SET_FIELD', field: 'loggedUser', value: e.value })} onFocusIn={handleFocus} />
                            </div>
                            <div className='form-group'>
                                <label>{t('password.oldPassword')}:</label>
                                <TextBox mode="password" value={oldPassword} onValueChanged={(e) => dispatch({ type: 'SET_FIELD', field: 'oldPassword', value: e.value })} onFocusIn={handleFocus} />
                            </div>
                            <div className='form-group'>
                                <label>{t('password.newPassword')}:</label>
                                <TextBox mode="password" value={newPassword} onValueChanged={(e) => dispatch({ type: 'SET_FIELD', field: 'newPassword', value: e.value })} onFocusIn={handleFocus} />
                            </div>
                            <div className='form-group'>
                                <label>{t('password.confirmPassword')}:</label>
                                <TextBox mode="password" value={confirmNewPassword} onValueChanged={(e) => dispatch({ type: 'SET_FIELD', field: 'confirmNewPassword', value: e.value })} onFocusIn={handleFocus} />
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