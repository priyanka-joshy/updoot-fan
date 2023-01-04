import { useState } from 'react';
import { Stack } from '@mantine/core';
import Button from '@components/button';
import { Heading1, Subheading3 } from '@components/typography';
import { AuthProcessI, SignUpCredentials } from 'src/utils/auth/dataTypes';
import SignUpForm from 'src/utils/auth/forms/signUp';
import { Verification } from 'src/utils/auth/forms/verification';
import { Login } from 'src/utils/auth/forms/login';
import { ForgotPassword } from 'src/utils/auth/forms/forgotPassword';
import styles from './styles.module.scss';

const AuthForm = () => {
  const [formType, setFormType] = useState<AuthProcessI>('login');
  const [authError, setAuthError] = useState<string>();
  const [userCred, setUserCred] = useState<SignUpCredentials>({
    username: '',
    phone_number: '',
    email: '',
    password: '',
  });

  // Form titles
  const titles: Record<AuthProcessI, string> = {
    signup: 'Create your Updoot Account',
    confirm: 'Create your Updoot Account',
    verified: 'Your account has been created',
    login: 'Login to your account',
    forgotPassword: 'Reset Password',
  };
  // Toggle between LogIn and SignUp
  const toggleAuthButton = (
    <Button
      size="md"
      className={styles.authButton}
      type="secondary"
      color="black"
      onClick={() => {
        formType === 'signup' ? setFormType('login') : setFormType('signup');
        setAuthError(undefined);
      }}>
      {formType === 'signup' ? 'Log In' : 'Sign Up'}
    </Button>
  );
  // Forgot password button
  const forgotPasswordButton = (
    <Subheading3
      className={styles.authLink}
      onClick={() => {
        setFormType('forgotPassword');
        setAuthError(undefined);
      }}>
      Forgot password?
    </Subheading3>
  );

  const accountCreated = (
    <Button
      size="lg"
      className={styles.authButton}
      style={{ marginTop: '40px' }}
      type="primary"
      color="purple"
      onClick={() => setFormType('login')}>
      Login now
    </Button>
  );
  // Forms for each auth process
  const authForms: Record<AuthProcessI, JSX.Element | (() => JSX.Element)> = {
    signup: (
      <>
        <SignUpForm
          setAuthError={setAuthError}
          setFormType={setFormType}
          userCred={userCred}
          setUserCred={setUserCred}
        />
        {toggleAuthButton}
      </>
    ),
    confirm: (
      <Verification
        type="email"
        userCred={userCred}
        setAuthError={setAuthError}
        setFormType={setFormType}
      />
    ),
    verified: accountCreated,
    login: (
      <>
        <Login setAuthError={setAuthError} />
        {toggleAuthButton}
        {forgotPasswordButton}
      </>
    ),
    forgotPassword: (
      <ForgotPassword setFormType={setFormType} setAuthError={setAuthError} />
    ),
  };
  return (
    <Stack spacing={30}>
      {/* <pre>{JSON.stringify(userCred, null, 2)}</pre> */}
      <Heading1 color="#333333" style={{ textAlign: 'center' }}>
        {titles[formType]}
      </Heading1>

      <>{authForms[formType]}</>
      {authError && <Subheading3 color="#FF0055">{authError}</Subheading3>}

      <Subheading3
        color="#a1a1a1"
        style={{ width: '87%', margin: '0 auto', textAlign: 'center' }}>
        By signing up, you agree to our Terms of Service and Privacy Policy.
      </Subheading3>
    </Stack>
  );
};

export default AuthForm;
