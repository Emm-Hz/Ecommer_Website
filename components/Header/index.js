import React from 'react';
import { Link } from 'react-router-dom';
import { signOutUserStart } from '../../redux/user/user.actions';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItemsCount } from '../../redux/Cart/cart.selectors';
import './styles.scss';

import Logo from '../../assets/logo/buho-logo-green.png'

const mapState = (state) => ({
    currentUser: state.user.currentUser,
    totalNumCartItems: selectCartItemsCount(state)
});

function Header(props) {

    const dispatch = useDispatch();
    const { currentUser, totalNumCartItems } = useSelector(mapState);

    const signOut = () => {
        dispatch(signOutUserStart())
    }

    return (
        <header className="header">
            <div className="wrap">
                <div className="logo">
                    <Link to="/">
                        <img src={Logo} alt="MyLog" />
                    </Link>
                </div>

                <nav>
                    <ul>
                        <li>
                            <Link to='/search'>
                                Buscar
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="login">

                <ul>

                    <li>
                        <Link to="/cart">
                            Carrito({totalNumCartItems})
                        </Link>
                    </li>

                    {currentUser && [
                            <li>
                                <Link to="/dashboard">
                                    Perfil
                                </Link>
                            </li>,
                            <li>
                                <span onClick={() => signOut()}>
                                    Logout
                                </span>
                            </li>     
                    ]}

                    {!currentUser && [
                            <li>
                                <Link to="/registration">
                                    Registrarse
                                </Link>
                            </li>,
                            <li>
                                <Link to="/login">
                                    Ingresar
                                </Link>
                            </li>       
                    ]}
                </ul>
                    
                </div>
            </div>
        </header>
    )
};

Header.defaultProps = {
    currentUser: null
};



export default Header;