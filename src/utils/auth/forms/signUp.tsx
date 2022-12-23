import Button from '@components/button';
import {
  Input,
  PasswordInput,
  Stack,
  TextInput
} from '@mantine/core';
import { Dispatch, SetStateAction, useState } from 'react';
import { useAuth } from '../authContext';
import { AuthProcessI, SignUpCredentials } from '../dataTypes';
import PasswordStrength from './passwordStrength';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { useSignUp } from './hooks';
import styles from '@components/authForm/styles.module.scss'
import { signUp1_formData, signUp2_formData } from './formData';


interface IProps {
  setFormType: Dispatch<SetStateAction<AuthProcessI>>,
  setAuthError: Dispatch<SetStateAction<string | undefined>>
  userCred: SignUpCredentials,
  setUserCred: Dispatch<SetStateAction<SignUpCredentials>>
}

const SignUpForm = ({ setAuthError, setFormType, userCred, setUserCred }: IProps) => {
  const { cognitoRegister } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const { signUp1_hook, signUp2_hook} = useSignUp();

  const handleSignUp = async (values: SignUpCredentials) => {
    const res = await cognitoRegister({ ...values });
    if (res instanceof Error) {
      setAuthError(res.message);
    } else {
      setAuthError(undefined);
      setFormType('confirm');
    }
  }

  const signUp1_form = (
    <form
      onSubmit={signUp1_hook.onSubmit(async (values) => {
        setUserCred({ ...userCred, ...values });
        setStep(2);
      })}>
      <Stack>
        {Object.entries(signUp1_formData).map(([name, attributes]) => (
          <div key={name}>
            {name !== "phone_number" ?
              <TextInput
                label={attributes.label}
                placeholder={attributes.placeholder}
                {...signUp1_hook.getInputProps(name)}
                size='lg'
                radius={10}
              /> :
              <div>
                <Input.Label>{attributes.label}</Input.Label>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={signUp1_hook.values.phone_number}
                  onChange={(value) => signUp1_hook.setFieldValue(name, value)}
                  international
                  defaultCountry='HK'
                />
              </div>
            }
          </div>
        ))}
        <Button
          disabled={!(signUp1_hook.isTouched() && signUp1_hook.isValid())}
          size='lg'
          className={styles.authButton}
          type="primary"
          color="purple"
        >
          Next
        </Button>
      </Stack>
    </form>
  )
  const signUp2_form = (
    <form
      onSubmit={signUp2_hook.onSubmit(async (values) => {
        setUserCred({ ...userCred, password: values.password });
        handleSignUp({...userCred, password: values.password})
      })}>
      <Stack>
        <PasswordStrength
          value={signUp2_hook.values.password}
          onChange={(value: string) => signUp2_hook.setFieldValue('password', value)}
        />
        <PasswordInput 
          label={signUp2_formData.confirm_password.label}
          placeholder={signUp2_formData.confirm_password.placeholder}
          {...signUp2_hook.getInputProps('confirm_password')}
          size='lg'
          radius={10}
        />
        <Button
          disabled={!(signUp2_hook.isTouched() && signUp2_hook.isValid())}
          size='lg'
          className={styles.authButton}
          type="primary"
          color="purple"
        >
          Next
        </Button>
      </Stack>
    </form>
  )
  const signUpForms: Record<1 | 2, JSX.Element> = {
    1: signUp1_form,
    2: signUp2_form
  }

  return signUpForms[step];
}

export default SignUpForm;