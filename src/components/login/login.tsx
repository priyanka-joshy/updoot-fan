import { useState } from 'react';
import { useForm } from '@mantine/form';
import {
  Button,
  Container,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useAuth } from '../../utils/auth/authContext';
interface LoginCredentials {
  email: string,
  password: string
}
interface SignUpCredentials extends LoginCredentials {
  name: string;
  phone_number: string;
  confirm_password: string;
}
interface ConfirmationCredentials {
  email: string,
  code: string
}
type AuthProcessI = 'signup' | 'confirm' | 'login';

const Login = () => {
  const { cognitoLogin, cognitoRegister, cognitoConfirmRegistration } = useAuth();
  const [formType, setFormType] = useState<AuthProcessI>('signup');
  const [authError, setAuthError] = useState<string>();

  const signUpForm = useForm<SignUpCredentials>({
    initialValues: {
      email: '',
      password: '',
      confirm_password: '',
      name: '',
      phone_number: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (
        value.length > 8 && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value) ? null : (value.length < 8 ? 'Must be at least 8 characters' : 'Must contain uppercase, lowercase, number and special case characters')),
      confirm_password: (value, values) => (value !== values.password ? 'Passwords did not match' : null),
      phone_number: (value) => (value.length >= 8 ? null : 'Invalid telephone number'),
      name: (value) => (value.length > 0 ? null : 'Required'),
    },
  });
  const confirmForm = useForm<ConfirmationCredentials>({
    initialValues: {
      email: '',
      code: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      code: (value) => (value.length > 0 ? null : 'Required'),
    }
  });
  const loginForm = useForm<LoginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (
        value.length > 8 && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value) ? null : (value.length < 8 ? 'Must be at least 8 characters' : 'Must contain uppercase, lowercase, number and special case characters')),
    },
  });

  const titles: Record<AuthProcessI, [string, string]> = {
    signup: ['Register', 'Please enter your details to continue.'],
    confirm: ['Two Factor Authentication', 'A verification code has been sent to your email.'],
    login: ['Sign Into App', '']
  }

  return (
    <div>
      <Container style={{ maxWidth: '325px' }}>
        <Text fw={700} fz={20} mb="md" color={'#4f4f4f'}>{titles[formType][0]}</Text>
        <Text fz={14} mb="sm" color={'#4f4f4f'}>{titles[formType][1]}</Text>
        <Stack>
          {formType === 'signup' &&
            <form onSubmit={signUpForm.onSubmit(async (values) => {
              const res = await cognitoRegister({ ...values });
              if (res instanceof Error) {
                setAuthError(res.message)
              } else {
                setAuthError(undefined);
                setFormType('confirm');
              }
            })}>
              <Stack>
                <TextInput placeholder="Name" {...signUpForm.getInputProps('name')} />
                <TextInput placeholder="Email" {...signUpForm.getInputProps('email')} />
                <PasswordInput placeholder="Enter Password" {...signUpForm.getInputProps('password')} />
                <PasswordInput placeholder="Confirm Password" {...signUpForm.getInputProps('confirm_password')} />
                <TextInput placeholder="Phone Number" {...signUpForm.getInputProps('phone_number')} />
                {authError && <Text color="red" fz={14}>{authError}</Text>}
                <Button color="dark" type="submit">
                  Sign Up
                </Button>
              </Stack>
            </form>
          }
          {formType === 'confirm' &&
            <form onSubmit={confirmForm.onSubmit(async (values) => {
              const res = await cognitoConfirmRegistration({ ...values });
              if (res instanceof Error) {
                setAuthError(res.message)
              } else {
                setAuthError(undefined);
                setFormType('login');
              }
            })}>
              <Stack>
                <TextInput placeholder="Email" {...confirmForm.getInputProps('email')} />
                <TextInput placeholder="Please enter the code here" {...confirmForm.getInputProps('code')} />
                {authError && <Text color="red" fz={14}>{authError}</Text>}
                <Button color="dark" type="submit">
                  Verify
                </Button>
              </Stack>
            </form>
          }
          {formType === 'login' &&
            <form onSubmit={loginForm.onSubmit(async (values) =>{
              const res = await cognitoLogin(values);
              if(res instanceof Error){
                setAuthError(res.message);
              }else{
                setAuthError(undefined);
              }
            })}>
              <Stack>
                <TextInput placeholder="Email" {...loginForm.getInputProps('email')} />
                <PasswordInput placeholder="Enter Password" {...loginForm.getInputProps('password')} />
                {authError && <Text color="red" fz={14}>{authError}</Text>}
                <Button color="dark" type="submit">
                  Log In
                </Button>
              </Stack>
            </form>
          }
          {formType !== "confirm" &&
            <Button color="dark" variant="outline" onClick={() => {
              formType === 'signup' ? setFormType('login') : setFormType('signup');
              setAuthError(undefined)
            }}>
              {formType === 'signup' ? 'Log In' : 'Sign Up'}
            </Button>
          }
        </Stack>
      </Container>
    </div>
  );
};

export default Login;

