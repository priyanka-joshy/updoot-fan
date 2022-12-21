import { useForm } from '@mantine/form';
import { useAuth } from '../authContext';
import { Stack, TextInput } from '@mantine/core';
import Button from "@components/button";
import { Subheading2 } from '@components/typography';
import { AuthProcessI, ConfirmationCredentials, SignUpCredentials } from "../dataTypes";
import { Dispatch, SetStateAction } from 'react';
import styles from '@components/authForm/styles.module.scss';

interface IProps {
  setFormType: Dispatch<SetStateAction<AuthProcessI>>,
  setAuthError: Dispatch<SetStateAction<string | undefined>>
  type: 'phone_number' | 'email'
  userCred: SignUpCredentials
}

export const Verification = ({ setFormType, setAuthError, userCred, type }: IProps) => {
  const { cognitoConfirmRegistration, cognitoResendCode } = useAuth();
  const {email, phone_number, username} = userCred;
  const formattedPhone = (type==='phone_number' && phone_number && phone_number!=='') && '*'.repeat(phone_number.length-3) + phone_number.slice(-3);
  const formattedEmail = (type==='email' && email!=='') && (email.split('@')[0]).slice(0,3) + '*'.repeat(email.split('@')[0].length-3) +'@'+ email.split('@')[1];

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
        const res = await cognitoConfirmRegistration(email, values.code);
        if (res instanceof Error) {
          setAuthError(res.message);
        } else {
          setAuthError(undefined);
          type==="email" && setFormType('verified');
        }
      })}>
      <Stack spacing={30}>
          <TextInput
            label={`Enter the 6-digit code sent to ${type==="phone_number"? formattedPhone: formattedEmail}`}
            placeholder='123456'
            {...confirmHook.getInputProps('code')}
            size='lg'
            radius={10}
          />

        <div>
          <Subheading2 style={{marginBottom: '10px'}}>Didn’t receive the code?</Subheading2>
          <Button
            size='lg'
            className={styles.authButton}
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
          className={styles.authButton}
          type="primary"
          color="purple"
        >
          {type==="phone_number"? 'Next': 'Create Account'}
        </Button>
      </Stack>
    </form>
  )
}
