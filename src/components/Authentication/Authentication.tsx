import {FC} from 'react';
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult  } from "firebase/auth";
import { auth, provider } from '../../firebase/firebase';

import { useState, useEffect, useRef } from 'react';
import { createUser } from "./AuthenticationSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import './Authentication.scss';

const Authentication: FC = () => {
    const navigate = useNavigate();
    const route = useSearchParams();
    const location = useLocation();

    const [isLoginWindowShow, setIsLoginWindowShow] = useState<boolean>(false);
    const [isRegisterWindowShow, setIsRegisterWindowShow] = useState<boolean>(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
    
    const [inputMail, setInputMail] = useState<string>('sdfasdfgs');
    const [inputPass, setInputPass] = useState<string>('');

    const [isLoginByEmail, setIsLoginByEmail] = useState<boolean>(false);
    const [isLoginByGoogle, setIsLoginByGoogle] = useState<boolean>(false);
    const [isLoginByFb, setIsLoginByFb] = useState<boolean>(false);

    const [isRegisterByEmail, setIsRegisterByEmail] = useState<boolean>(false);
    const [isRegisterByGoogle, setIsRegisterByGoogle] = useState<boolean>(false);
    const [isRegisterByFb, setIsRegisterByFb] = useState<boolean>(false);

    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    

    const [loading, setLoading] = useState<boolean>(false);

    const loginByEmailPassInput = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (localStorage.getItem('user')) navigate("/");
        if (sessionStorage.getItem('loading') === 'true') setLoading(true);
    }, []);

    useEffect(() => {
        console.log(loading);
    }, [loading])

    useEffect(() => {
        isAuthorized && navigate('/');
    }, [isAuthorized]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsAuthorized(true);
                sessionStorage.clear();
                setLoading(false);
                if (user.uid && user.email) {
                    const userToSave = { uid: user.uid, email: user.email };
                    localStorage.setItem('user', JSON.stringify(userToSave));
                    dispatch(createUser(userToSave));
                }
                getRedirectResult(auth)
                    .then()
            } else {
                localStorage.clear();
                sessionStorage.clear();
                console.log('try to login');
                setIsAuthorized(false);
            }
            setInputMail('');
            setInputPass('');
        });
      
        return () => {
          unsubscribe(); // Отписываемся от слушателя при размонтировании компонента
        };
    }, [isAuthorized]);

    const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, inputMail, inputPass)
        .then(({user}) => {
            setIsAuthorized(true);
            // setIsRegisterOpen(false);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        signInWithEmailAndPassword(auth, inputMail, inputPass)
            .then(({user}) => {
                setIsAuthorized(true);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    const handleSignInByGoogle = async() => {
        setIsLoginWindowShow(false); 
        setIsRegisterWindowShow(true); 
        setIsRegisterByGoogle(true);
        
        sessionStorage.setItem('loading', 'true');        
        setLoading(true);

        signInWithRedirect(auth, provider)
    }

    const handleMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMail(e.currentTarget.value);
    }

    const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPass(e.currentTarget.value);
    }

    const handleHidePass = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (loginByEmailPassInput.current) {
            loginByEmailPassInput.current.type === 'password' ? loginByEmailPassInput.current.type = 'text' : loginByEmailPassInput.current.type = 'password';
        } 
    }

    const closePopup = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsRegisterOpen(false);
        setInputMail(''); 
        setInputPass(''); 
    }

    // const SignUp = () => {
    //     return (
    //         <div 
    //             className={isRegisterOpen ? "authorization active" : "authorization"} 
    //             onMouseDown={closePopup}>
    //             <div 
    //                 className={isRegisterOpen ? "authorization__inner active" : "authorization__inner"} 
    //                 onMouseDown={e => e.stopPropagation()}>
    //                 <h2>Регистрация</h2>
    //                 <div className="authorization__forms-wrapper">
    //                     <form className="authorization__form form-email">
    //                         <label className="form-email__label-username">
    //                             <span>Электронная почта</span>
    //                             <div className="form-email__input-wrapper">
    //                                 <input 
    //                                     className="form-email__input-username" 
    //                                     type="email"
    //                                     name="email"
    //                                     autoComplete="email"
    //                                     onChange={handleMailChange}
    //                                     value={inputMail}/>
    //                             </div>
    //                         </label>
    //                         <label className="form-email__label-password">
    //                             <span>Пароль</span>
    //                             <div className="form-email__input-wrapper">
    //                                 <input      
    //                                     className="form-email__input-password" 
    //                                     type="text"
    //                                     name="password"
    //                                     autoComplete="password"
    //                                     onChange={handlePassChange}
    //                                     value={inputPass}/>
    //                             </div>
    //                         </label>
    //                         <button 
    //                             className="form-email__submit"
    //                             onClick={handleCreateUser}>зарегистрироваться</button>
    //                     </form>
    //                     <div className="form__divider">
    //                         <span>ИЛИ</span>
    //                     </div>
    //                     <div className="login__social-networks">
    //                         <h3 className="login__social-title">Войти как пользователь:</h3>
    //                         <ul className="login__social-list">
    //                             <li className="login__social-item">
    //                                 <button className="login__social-btn google">Google Account</button>
    //                             </li>
    //                             <li className="login__social-item">
    //                                 <button className="login__social-btn facebook">Facebook Account</button>
    //                             </li>
    //                         </ul>
    //                     </div>
    //                 </div>
    //                 {/* <button 
    //                     className="authorization__signup-link"
    //                     onClick={() => setIsAuthWindowShow(true)}>Я уже зарегистрирован</button> */}
    //             </div>
    //         </div>
    //     )
    // }

    // const Login = () => {
    //     return (
    //         <div 
    //             className={isAuthWindowShow ? "authorization active" : "authorization"}
    //             onMouseDown={closePopup}>
    //             <div 
    //                 className={isAuthWindowShow ? "authorization__inner active" : "authorization__inner"} 
    //                 onMouseDown ={e => e.stopPropagation()}>
    //                 <h2>Вход</h2>
    //                 <form className="authorization__form form-email">
    //                     <label className="form-email__label-username">
    //                         <span>Электронная почта</span>
    //                         <div className="form-email__input-wrapper">
    //                             <input 
    //                                 className="form__input-username" 
    //                                 type="email"
    //                                 name="email"
    //                                 autoComplete="email"
    //                                 onChange={handleMailChange}
    //                                 value={inputMail}/>
    //                         </div>
    //                     </label>
    //                     <label className="form-email__label-password">
    //                         <span>Пароль</span>
    //                         <div className="form-email__input-wrapper">
    //                             <input      
    //                                 className="form-email__input-password" 
    //                                 type="text"
    //                                 name="password"
    //                                 autoComplete="current-password"
    //                                 onChange={handlePassChange}
    //                                 value={inputPass}/>
    //                         </div>
    //                     </label>
    //                     <button 
    //                         className="form-email__submit"
    //                         onClick={handleLogin}>Войти</button>
    //                 </form>
    //                 <button 
    //                     className="authorization__signup-link"
    //                     onClick={() => setIsRegisterOpen(true)}>Зарегестрироваться</button>
    //             </div>
    //         </div>
    //     )
    // }

    const SignUpByEmail = () => {
        return (
            <div className="authorization__window">
                <h1 className="authorization__window-title">Зареєструватись</h1>
                <p className="authorization__window-subtitle">Зареєструйтесь, щоб зберігати та переглядати ваші улюблені рецепти</p> 
                <form 
                    className="authorization__window-form form-register"
                    onSubmit={handleCreateUser}>
                    <div className="form-email__label-wrapper">
                        <label className="form-email__label">
                            <span>Ваша електронна пошта</span>
                            <div className="form-email__input-wrapper">
                                <input 
                                    className="form-email__input" 
                                    type="email"
                                    name="email"
                                    autoComplete="current-email"
                                    required
                                    placeholder="youremail@example.com"
                                    onChange={handleMailChange}
                                    value={inputMail}/>
                            </div>
                        </label>
                    </div>
                    <div className="form-email__label-wrapper">
                        <label className="form-email__label">
                            <span>Ваш пароль</span>
                            <div className="form-email__input-wrapper input-password__wrapper">
                                <input      
                                    className="form-email__input input-password" 
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="&#10625; &#10625; &#10625; &#10625; &#10625; &#10625; &#10625;"
                                    onChange={handlePassChange}
                                    value={inputPass}
                                    ref={loginByEmailPassInput}/>
                                <button 
                                className="input-password__hide-btn" 
                                title="hide-show password"
                                onClick={(e) => handleHidePass(e)}></button>
                            </div>
                        </label>
                    </div>
                    <div className="form-email__label-wrapper remeber-me__wrapper"> 
                        <label className="form-email__label remeber-me__label">
                            <input      
                                className="form-email__checkbox" 
                                type="checkbox"
                                name="stay loged in"/>
                            <span className="remeber-me__checkbox-default"></span>
                            <span className="remeber-me__checkbox-checked"></span>
                            <span>Запам'ятати мене</span>
                        </label>
                    </div>
                    <button className="form-email__submit" type="submit">Зареєструватись</button>
                </form>
            </div>
        )
    }

    const LoginByEmail = () => {
        return (
            <div className="authorization__window">
                <h1 className="authorization__window-title">Увійти через електронну пошту</h1>
                <form 
                    className="authorization__window-form form-email"
                    onSubmit={handleLogin}>
                    <div className="form-email__label-wrapper">
                        <label className="form-email__label">
                            <span>Ваша електронна пошта</span>
                            <div className="form-email__input-wrapper">
                                <input 
                                    className="form-email__input" 
                                    type="email"
                                    name="email"
                                    autoComplete="current-email"
                                    required
                                    placeholder="youremail@example.com"
                                    onChange={handleMailChange}
                                    value={inputMail}/>
                            </div>
                        </label>
                    </div>
                    <div className="form-email__label-wrapper">
                        <label className="form-email__label">
                            <span>Ваш пароль</span>
                            <div className="form-email__input-wrapper input-password__wrapper">
                                <input      
                                    className="form-email__input input-password" 
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="&#10625; &#10625; &#10625; &#10625; &#10625; &#10625; &#10625;"
                                    onChange={handlePassChange}
                                    value={inputPass}
                                    ref={loginByEmailPassInput}/>
                                <button 
                                className="input-password__hide-btn" 
                                title="hide-show password"
                                onClick={(e) => handleHidePass(e)}></button>
                            </div>
                        </label>
                    </div>
                    <div className="form-email__label-wrapper remeber-me__wrapper"> 
                        <label className="form-email__label remeber-me__label">
                            <input      
                                className="form-email__checkbox" 
                                type="checkbox"
                                name="stay loged in"/>
                            <span className="remeber-me__checkbox-default"></span>
                            <span className="remeber-me__checkbox-checked"></span>
                            <span>Запам'ятати мене</span>
                        </label>
                    </div>
                    <button className="form-email__submit" type="submit">Увійти</button>
                </form>
            </div>
        )
    }

    const LoginByGoogle = () => {
        return (
            <div className="authorization__forms-wrapper">
                <form className="authorization__form form-email">
                    <label className="form-email__label-username">
                        <span>GOOOOOOOOOOGLE</span>
                        <div className="form-email__input-wrapper">
                            <input 
                                className="form-email__input-username" 
                                type="email"
                                name="email"
                                autoComplete="email"
                                onChange={handleMailChange}
                                value={inputMail}/>
                        </div>
                    </label>
                    <label className="form-email__label-password">
                        <span>Пароль</span>
                        <div className="form-email__input-wrapper">
                            <input      
                                className="form-email__input-password" 
                                type="text"
                                name="password"
                                autoComplete="password"
                                onChange={handlePassChange}
                                value={inputPass}/>
                        </div>
                    </label>
                    <button className="form-email__submit" >зарегистрироваться</button>
                </form>
                <div className="form__divider">
                    <span>ИЛИ</span>
                </div>
                <div className="login__social-networks">
                    <h3 className="login__social-title">Войти как пользователь:</h3>
                    <ul className="login__social-list">
                        <li className="login__social-item">
                            <button className="login__social-btn google">Google Account</button>
                        </li>
                        <li className="login__social-item">
                            <button className="login__social-btn facebook">Facebook Account</button>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    const ChoiceAuthWindow = () => {
        return (
            <>
                <div className={isRegisterOpen ? "authentication__block login" : "authentication__block login active"}>
                    <h1 className="authentication__block-title">Увійти</h1>
                    <ul className="authentication__block-list">
                        <li className="authentication__block-item">
                            <button 
                                className="authentication__block-btn"
                                onClick={() => {setIsRegisterWindowShow(false); setIsLoginWindowShow(true); setIsLoginByEmail(true)}}>
                                <span className="authentication__block-text">
                                    Увійти через Email
                                    <span className="authentication__block-decorative block-email"></span>
                                </span>
                            </button>
                            
                        </li>
                        <li className="authentication__block-item">
                            <button 
                                className="authentication__block-btn"
                                onClick={() => {setIsRegisterWindowShow(false); setIsLoginWindowShow(true); setIsLoginByGoogle(true)}}>
                                <span className="authentication__block-text">
                                    Увійти через Google
                                    <span className="authentication__block-decorative block-google"></span>
                                </span>
                            </button>
                        </li>
                        <li className="authentication__block-item">
                            <button 
                                className="authentication__block-btn"
                                onClick={() => {setIsRegisterWindowShow(false); setIsLoginWindowShow(true); setIsLoginByFb(true)}}>
                                <span className="authentication__block-text">
                                    Увійти через Facebook
                                    <span className="authentication__block-decorative block-facebook"></span>
                                </span>
                            </button>
                        </li>
                    </ul>
                    <div className="authentication__change-form">
                        <span>Не маєте аккаунта?</span>
                        <button onClick={() => setIsRegisterOpen(true)}>Зареєструйтесь</button>
                    </div>
                </div>
                <div className={isRegisterOpen ? "authentication__block register active" : "authentication__block register"}>
                    <h1 className="authentication__block-title">Зареєструватись</h1>
                    <ul className="authentication__block-list">
                        <li className="authentication__block-item">
                            <button 
                                className="authentication__block-btn"
                                onClick={() => {setIsLoginWindowShow(false); setIsRegisterWindowShow(true); setIsRegisterByEmail(true)}}>
                                <span className="authentication__block-text">
                                    Зареєструватись через Email
                                    <span className="authentication__block-decorative block-email"></span>
                                </span>
                            </button>
                            
                        </li>
                        <li className="authentication__block-item">
                            <button 
                                className="authentication__block-btn"
                                onClick={handleSignInByGoogle}>
                                <span className="authentication__block-text">
                                    Зареєструватись через Google
                                    <span className="authentication__block-decorative block-google"></span>
                                </span>
                            </button>
                        </li>
                        <li className="authentication__block-item">
                            <button 
                                className="authentication__block-btn"
                                onClick={() => {setIsLoginWindowShow(false); setIsRegisterWindowShow(true); setIsRegisterByFb(true)}}>
                                <span className="authentication__block-text">
                                    Зареєструватись через Facebook
                                    <span className="authentication__block-decorative block-facebook"></span>
                                </span>
                            </button>
                        </li>
                    </ul>
                    <div className="authentication__change-form">
                        <span>Маєте аккаунт?</span>
                        <button onClick={() => setIsRegisterOpen(false)}>Увійти</button>
                    </div>
                </div>
            </>
        )
    }

    const windowForAuth = (isLoginByEmail && LoginByEmail()) || (isRegisterByEmail && SignUpByEmail()) || (isRegisterByGoogle && LoginByGoogle());

    return (
        <div className="authentication__wrapper">
            {loading ? <div>Loading...</div> : isLoginWindowShow || isRegisterWindowShow ? windowForAuth : ChoiceAuthWindow()} 
        </div>
    )
}

export default Authentication;
