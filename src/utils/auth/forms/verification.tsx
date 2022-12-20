import { useForm } from '@mantine/form';
import { useAuth } from '../authContext';
import { Input, Stack, TextInput } from '@mantine/core';
import Button from "@components/button";
import { Subheading2 } from '@components/typography';
import { AuthProcessI, ConfirmationCredentials } from "../dataTypes";
import { Dispatch, SetStateAction } from 'react';

interface IProps {
  setFormType: Dispatch<SetStateAction<AuthProcessI>>,
  setAuthError: Dispatch<SetStateAction<string | undefined>>
  username: string,
  email?: string,
  phone_number?: string
}

export const Verification = ({ setFormType, setAuthError, username, email, phone_number }: IProps) => {
  const { cognitoConfirmRegistration, cognitoResendCode } = useAuth();
  const formattedPhone = phone_number && '*'.repeat(phone_number.length-3) + phone_number.slice(-3);
  const formattedEmail = email && (email.split('@')[0]).slice(0,3) + '*'.repeat(email.split('@')[0].length-3) +'@'+ email.split('@')[1];
  const confirmHook = useForm<ConfirmationCredentials>({
    initialValues: {
      code: '',
    },
    validate: {
      code: (value) => (value.length > 5 ? null : 'Required'),
    },
  });

  return (
    <form
      onSubmit={confirmHook.onSubmit(async (values) => {
        const res = await cognitoConfirmRegistration(username, values.code);
        if (res instanceof Error) {
          setAuthError(res.message);
        } else {
          setAuthError(undefined);
          setFormType('verified');
        }
      })}>
      <Stack spacing={30}>
        <div>
          <Input.Label mb={10}>
            <Subheading2>Enter the 6-digit code sent to {email && formattedEmail} {phone_number && formattedPhone}</Subheading2>
          </Input.Label>
          <TextInput
            placeholder='123456'
            {...confirmHook.getInputProps('code')}
            size='lg'
            radius={10}
          />
        </div>

        <div>
          <Subheading2 style={{marginBottom: '10px'}}>Didn’t receive the code?</Subheading2>
          <Button
            size='lg'
            style={{ borderRadius: '40px', width: '450px' }}
            type="secondary"
            color="black"
            onClick={async (e) => {
              e.preventDefault(); 
              email && await cognitoResendCode(email)
            }}
          >
            Send code
        </Button>
        </div>
        
        <Button
          disabled={!(confirmHook.isTouched() && confirmHook.isValid())}
          size='lg'
          style={{ borderRadius: '40px', width: '450px' }}
          type="primary"
          color="purple"
        >
          {phone_number && 'Next'}
          {email && 'Create Account'}
        </Button>
      </Stack>
    </form>
  )
}
