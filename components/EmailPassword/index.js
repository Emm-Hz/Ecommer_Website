import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { resetPasswordStart, resetUserState } from '../../redux/user/user.actions';
import './styles.scss'

import AuthWrapper from '../AuthWrapper';
import FormInput from '../forms/FormInput';
import Button from '../forms/Button';

const mapState = ({ user }) => ({
    resetPassword: user.resetPasswordSuccess,
    userErr: user.userErr
});

function EmailPassword() {

    const dispatch = useDispatch();
    const history = useHistory();
    const { resetPassword,userErr } = useSelector(mapState);
    const [email,setEmail] = useState('');
    const [errors,setErrors] = useState([]);

    useEffect(() => {
        if (resetPassword) {
            dispatch(resetUserState());
            history.push('/login');
        }
    }, [resetPassword,history,dispatch])

    useEffect(() => {
        if (Array.isArray(userErr) && userErr.length > 0) {
            setErrors(userErr);
        }
    }, [userErr])
    
    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(resetPasswordStart({ email }));
    }

    const configAuthWrapper = {
        headline: 'Email Password'
    }

    return (
        <AuthWrapper {...configAuthWrapper}>
            <div className="fromWrap">

                {errors.length > 0 && (
                    <ul>
                        {errors.map((e,index) => {
                            return (
                                <li key={index}>
                                    {e}
                                </li>
                            );
                        })}
                    </ul>
                )}

                <form onSubmit={handleSubmit}>
                    <FormInput
                        type='email'
                        name='email'
                        value={email}
                        placeholder='Correo'
                        handleChange={e => setEmail(e.target.value)}
                    />
                    <Button type='submit'>Email Password</Button> 
                </form>
            </div>
        </AuthWrapper>
    )
}

export default EmailPassword;
