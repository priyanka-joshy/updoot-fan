import React, { Dispatch, SetStateAction } from 'react'
import { Input, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '../authContext';
import Button from '@components/button';
import { Subheading2 } from '@components/typography';
import { LoginCredentials } from '../dataTypes';


interface IProps {
  setAuthError: Dispatch<SetStateAction<string | undefined>>
}

export const Login = ({setAuthError}: IProps) => {
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
        <div>
          <Input.Label mb={10}>
            <Subheading2>Email address</Subheading2>
          </Input.Label>
          <TextInput
            {...loginHook.getInputProps('email')}
            size='lg'
            radius={10}
          />
        </div>
        <div>
          <Input.Label mb={10}>
            <Subheading2>Password</Subheading2>
          </Input.Label>
          <PasswordInput
            {...loginHook.getInputProps('password')}
            size='lg'
            radius={10}
          />
        </div>
        <Button
          disabled={!(loginHook.isTouched() && loginHook.isValid())}
          size='lg'
          style={{ borderRadius: '40px', width: '450px' }}
          type="primary"
          color="purple"
        >
          Login
        </Button>
      </Stack>
    </form>
  )
}
