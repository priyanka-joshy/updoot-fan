import { Dispatch, SetStateAction } from 'react';
import { PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '../authContext';
import Button from '@components/button';
import { LoginCredentials } from '../dataTypes';
import styles from '@components/authForm/styles.module.scss';

interface IProps {
  setAuthError: Dispatch<SetStateAction<string | undefined>>;
}

export const Login = ({ setAuthError }: IProps) => {
  const { cognitoLogin } = useAuth();

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
  return (
    <form
      onSubmit={loginHook.onSubmit(async (values) => {
        const res = await cognitoLogin(values);
        if (res instanceof Error) {
          setAuthError(res.message);
        } else {
          setAuthError(undefined);
        }
      })}>
      <Stack spacing={30}>
        <TextInput
          label="Email address"
          {...loginHook.getInputProps('email')}
          size="lg"
          radius={10}
        />
        <PasswordInput
          label="Password"
          {...loginHook.getInputProps('password')}
          size="lg"
          radius={10}
        />
        <Button
          className={styles.authButton}
          disabled={!(loginHook.isTouched() && loginHook.isValid())}
          size="lg"
          type="primary"
          color="purple">
          Login
        </Button>
      </Stack>
    </form>
  );
};
