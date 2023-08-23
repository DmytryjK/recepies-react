import Authentication from "./components/Authentication/Authentication";
import { NavLink } from "react-router-dom";
import Logo from '../../assets/icons/logo.svg';
import './AuthorizationPage.scss';

type AuthorizationPageProps = {
    register?: boolean;
    login?: boolean;
};

const AuthorizationPage: React.FC<AuthorizationPageProps> = ({register, login}) => {
    return (
        <section className="authorization">
            <div className="authorization__image"></div>
            <div className="authorization__content">
                <nav className="authorization__nav">
                    <NavLink className="authorization__logo" 
                        to="/">
                        <img src={Logo} alt="" />
                    </NavLink>
                    <NavLink className="authorization__nav-link" 
                        to="/">
                        Назад
                    </NavLink>
                </nav>
                <Authentication register={register} login={login} />
            </div>
        </section>
    )
}

export default AuthorizationPage;
