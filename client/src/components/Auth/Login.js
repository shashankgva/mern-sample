import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "../../axios-custom";
import { connect } from "react-redux";
import { login } from "../../store/actions/auth";
import propTypes from "prop-types";

const Login = ({ login, isAuthenticated }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = loginData;

  const onChange = e =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    login({ email, password });
  };

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <div>
        <h1 className='large text-primary'>Login</h1>
        <p className='lead'>
          <i className='fas fa-user' /> Login
        </p>
        <form className='form' onSubmit={e => onSubmit(e)}>
          <div className='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={email}
              onChange={e => onChange(e)}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='password'
              value={password}
              onChange={e => onChange(e)}
              minLength={6}
            />
          </div>
          <input
            type='submit'
            className='btn btn-primary'
            defaultValue='Register'
          />
        </form>
        <p className='my-1'>
          Dont have an account? <Link to='/register'>Sign Up</Link>
        </p>
      </div>
    </Fragment>
  );
};

Login.propTypes = {
  login: propTypes.func.isRequired,
  isAuthenticated: propTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
