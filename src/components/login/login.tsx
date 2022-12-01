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
  email: string;
  password: string;
}
interface SignUpCredentials extends LoginCredentials {
  name: string;
  phone_number: string;
  confirm_password: string;
}
interface ConfirmationCredentials {
  email: string;
  code: string;
}
interface PasswordReset {
  code: string;
  password: string;
  confirm_password: string;
}
type AuthProcessI =
  | 'signup'
  | 'confirm'
  | 'login'
  | 'forgotPassword'
  | 'submitPassword';

const Login = () => {
  const {
    cognitoLogin,
    cognitoRegister,
    cognitoConfirmRegistration,
    cognitoForgotPassword,
    cognitoSubmitNewPassword,
  } = useAuth();
  const [formType, setFormType] = useState<AuthProcessI>('signup');
  const [authError, setAuthError] = useState<string>();
  const [userEmail, setUserEmail] = useState<string>();

  // Form validation and Initial values
  const signupHook = useForm<SignUpCredentials>({
    initialValues: {
      email: '',
      password: '',
      confirm_password: '',
      name: '',
      phone_number: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length > 8 &&
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
          value
        )
          ? null
          : value.length < 8
          ? 'Must be at least 8 characters'
          : 'Must contain uppercase, lowercase, number and special case characters',
      confirm_password: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
      phone_number: (value) =>
        value.length >= 8 ? null : 'Invalid telephone number',
      name: (value) => (value.length > 0 ? null : 'Required'),
    },
  });
  const confirmHook = useForm<ConfirmationCredentials>({
    initialValues: {
      email: '',
      code: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      code: (value) => (value.length > 0 ? null : 'Required'),
    },
  });
  const loginHook = useForm<LoginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length > 8 &&
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
          value
        )
          ? null
          : value.length < 8
          ? 'Must be at least 8 characters'
          : 'Must contain uppercase, lowercase, number and special case characters',
    },
  });
  const forgotPasswordHook = useForm<{ email: string }>({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
  const submitPasswordHook = useForm<PasswordReset>({
    initialValues: {
      code: '',
      password: '',
      confirm_password: '',
    },
    validate: {
      code: (value) => (value.length > 0 ? null : 'Required'),
      password: (value) =>
        value.length > 8 &&
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
          value
        )
          ? null
          : value.length < 8
          ? 'Must be at least 8 characters'
          : 'Must contain uppercase, lowercase, number and special case characters',
      confirm_password: (value, values) =>
        value.length > 8 && value === values.password
          ? null
          : value.length > 8
          ? 'Passwords did not match'
          : 'Required',
    },
  });
  // Form titles
  const titles: Record<AuthProcessI, [string, string]> = {
    signup: ['Register', 'Please enter your details to continue.'],
    confirm: [
      'Two Factor Authentication',
      'A verification code has been sent to your email.',
    ],
    login: ['Sign Into App', ''],
    forgotPassword: [
      'Reset Password',
      'A verification code will be sent to your email.',
    ],
    submitPassword: ['Reset Password', ''],
  };
  // Toggle between LogIn and SignUp
  const toggleAuthButton = (
    <Button
      color="dark"
      variant="outline"
      onClick={() => {
        formType === 'signup' ? setFormType('login') : setFormType('signup');
        setAuthError(undefined);
      }}>
      {formType === 'signup' ? 'Log In' : 'Sign Up'}
    </Button>
  );
  // Forgot password button
  const forgotPasswordButton = (
    <Text
      fz={14}
      td="underline"
      style={{ textUnderlineOffset: '3px', cursor: 'pointer' }}
      onClick={() => {
        setFormType('forgotPassword');
        setAuthError(undefined);
      }}>
      Forgot password?
    </Text>
  );

  const signupForm = (
    <>
      <form
        onSubmit={signupHook.onSubmit(async (values) => {
          const res = await cognitoRegister({ ...values });
          if (res instanceof Error) {
            setAuthError(res.message);
          } else {
            setAuthError(undefined);
            setFormType('confirm');
          }
        })}>
        <Stack>
          <TextInput placeholder="Name" {...signupHook.getInputProps('name')} />
          <TextInput
            placeholder="Email"
            {...signupHook.getInputProps('email')}
          />
          <PasswordInput
            placeholder="Enter Password"
            {...signupHook.getInputProps('password')}
          />
          <PasswordInput
            placeholder="Confirm Password"
            {...signupHook.getInputProps('confirm_password')}
          />
          <TextInput
            placeholder="Phone Number"
            {...signupHook.getInputProps('phone_number')}
          />
          {authError && (
            <Text color="red" fz={14}>
              {authError}
            </Text>
          )}
          <Button color="dark" type="submit">
            Sign Up
          </Button>
        </Stack>
      </form>
      {toggleAuthButton}
    </>
  );
  const confirmForm = (
    <form
      onSubmit={confirmHook.onSubmit(async (values) => {
        const res = await cognitoConfirmRegistration({ ...values });
        if (res instanceof Error) {
          setAuthError(res.message);
        } else {
          setAuthError(undefined);
          setFormType('login');
        }
      })}>
      <Stack>
        <TextInput
          placeholder="Email"
          {...confirmHook.getInputProps('email')}
        />
        <TextInput
          placeholder="Please enter the code here"
          {...confirmHook.getInputProps('code')}
        />
        {authError && (
          <Text color="red" fz={14}>
            {authError}
          </Text>
        )}
        <Button color="dark" type="submit">
          Verify
        </Button>
      </Stack>
    </form>
  );
  const loginForm = (
    <>
      <form
        onSubmit={loginHook.onSubmit(async (values) => {
          const res = await cognitoLogin(values);
          if (res instanceof Error) {
            setAuthError(res.message);
          } else {
            setAuthError(undefined);
          }
        })}>
        <Stack>
          <TextInput
            placeholder="Email"
            {...loginHook.getInputProps('email')}
          />
          <PasswordInput
            placeholder="Enter Password"
            {...loginHook.getInputProps('password')}
          />
          {authError && (
            <Text color="red" fz={14}>
              {authError}
            </Text>
          )}
          <Button color="dark" type="submit">
            Log In
          </Button>
        </Stack>
      </form>
      {toggleAuthButton}
      {forgotPasswordButton}
    </>
  );
  const forgotPasswordForm = (
    <form
      onSubmit={forgotPasswordHook.onSubmit(async (values) => {
        const res = await cognitoForgotPassword(values.email);
        if (res instanceof Error) {
          setAuthError(res.message);
        } else {
          setAuthError(undefined);
          setUserEmail(values.email);
          setFormType('submitPassword');
        }
      })}>
      <Stack>
        <TextInput
          placeholder="Email"
          {...forgotPasswordHook.getInputProps('email')}
        />
        {authError && (
          <Text color="red" fz={14}>
            {authError}
          </Text>
        )}
        <Button color="dark" type="submit">
          Continue
        </Button>
      </Stack>
    </form>
  );
  const submitPasswordForm = (
    <form
      onSubmit={submitPasswordHook.onSubmit(async (values) => {
        if (!userEmail) return;
        const res = await cognitoSubmitNewPassword({
          email: userEmail,
          code: values.code,
          password: values.password,
        });
        if (res instanceof Error) {
          setAuthError(res.message);
        } else {
          setAuthError(undefined);
          setUserEmail(undefined);
          setFormType('login');
        }
      })}>
      <Stack>
        <TextInput
          placeholder="Enter verification code"
          {...submitPasswordHook.getInputProps('code')}
        />
        <PasswordInput
          placeholder="Enter new password"
          {...submitPasswordHook.getInputProps('password')}
        />
        <PasswordInput
          placeholder="Confirm new password"
          {...submitPasswordHook.getInputProps('confirm_password')}
        />
        {authError && (
          <Text color="red" fz={14}>
            {authError}
          </Text>
        )}
        <Button color="dark" type="submit">
          Submit
        </Button>
      </Stack>
    </form>
  );
  // Forms for each auth process
  const authForms: Record<AuthProcessI, JSX.Element> = {
    signup: signupForm,
    confirm: confirmForm,
    login: loginForm,
    forgotPassword: forgotPasswordForm,
    submitPassword: submitPasswordForm,
  };
  return (
    <div>
      <Container size={325} px={0}>
        <Text fw={700} fz={20} mb="md" color={'#4f4f4f'}>
          {titles[formType][0]}
        </Text>
        <Text fz={14} mb="sm" color={'#4f4f4f'}>
          {titles[formType][1]}
        </Text>
        <Stack>{authForms[formType]}</Stack>
      </Container>
    </div>
  );
};

export default Login;
