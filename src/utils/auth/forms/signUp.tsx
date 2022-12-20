import Button from '@components/button';
import { Subheading2 } from '@components/typography';
import {
  Input,
  PasswordInput,
  Stack,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Dispatch, SetStateAction, useState } from 'react';
import { useAuth } from '../authContext';
import { AuthProcessI, FormField, SignUp1_Credentials, SignUp2_Credentials, SignUpCredentials } from '../dataTypes';
import PasswordStrength from './passwordStrength';
import 'react-phone-number-input/style.css'
import PhoneInput, { Value, isPossiblePhoneNumber } from 'react-phone-number-input'


interface IProps {
  setFormType: Dispatch<SetStateAction<AuthProcessI>>,
  setAuthError: Dispatch<SetStateAction<string | undefined>>
  setUserCred: Dispatch<SetStateAction<SignUpCredentials>>
}

const SignUpForm = ({ setAuthError, setFormType, setUserCred }: IProps) => {
  const { cognitoRegister } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [credentials, setCredentials] = useState<SignUpCredentials>({
    username: '',
    email: '',
    phone_number: undefined,
    password: ''
  });

  const signUp1_initialValues: SignUp1_Credentials = {
    username: '',
    phone_number: '',
    email: '',
  }
  const signUp1_hook = useForm<SignUp1_Credentials>({
    initialValues: signUp1_initialValues,
    validate: { //TODO: Check that user does not already exist
      username: (value) => (value.length > 0 ? null : 'Required'),
      phone_number: (value: Value | undefined) =>
        value && isPossiblePhoneNumber(value) ? null : 'Invalid telephone number',
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    }
  });
  const signUp2_initialValues: SignUp2_Credentials = {
    password: '',
    confirm_password: ''
  }
  const signUp2_hook = useForm<SignUp2_Credentials>({
    initialValues: signUp2_initialValues,
    validate: {
      password: (value) => (
        value.length > 8 &&
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            value
          )
          ? null
          : value.length < 8
            ? 'Must be at least 8 characters'
            : 'Must contain uppercase, lowercase, number and special case characters'
      ),
      confirm_password: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    }
  });


  const handleSignUp = async (values: SignUpCredentials) => {
    const res = await cognitoRegister({ ...values });
    if (res instanceof Error) {
      setAuthError(res.message);
      console.log(res.message);
    } else {
      setAuthError(undefined);
      setUserCred({ ...credentials, password: values.password })
      setFormType('confirm');
    }
  }
  const formData1: Record<keyof SignUp1_Credentials, FormField> =
  {
    username: {
      type: 'text',
      label: 'Username',
      placeholder: 'John',
    },
    phone_number: {
      type: 'text',
      label: 'Phone number',
      placeholder: '+852',
    },
    email: {
      type: 'text',
      label: 'Email address',
      placeholder: 'johndoe@gmail.com',
    }
  }
  const formData2: Record<keyof SignUp2_Credentials, FormField> = {
    password: {
      type: 'password',
      label: 'Password',
      placeholder: 'Ajd18sjbny?'
    },
    confirm_password: {
      type: 'password',
      label: 'Confirm Password',
      placeholder: ''
    }
  }
  const inputFields = {
    text: TextInput,
    password: PasswordInput
  }

  const data = step === 1 ? {
    formHook: signUp1_hook,
    formData: formData1,
  } : {
    formHook: signUp2_hook,
    formData: formData2
  }
  
  return (
    <form
      key={step}
      onSubmit={data.formHook.onSubmit((values) => {
        setCredentials(() => ({ ...credentials, ...values }))
        setUserCred(() => ({ ...credentials, ...values }))
        step == 1 ? setStep(2) : handleSignUp({ ...credentials, ...values });
      }
      )}>
      <Stack spacing={30}>
        {
          Object.entries(data.formData).map(([name, attributes]) => {
            const UserInput = inputFields[attributes.type];
            return (
              <div key={name}>
                <Input.Label mb={10}>
                  <Subheading2>{attributes.label}</Subheading2>
                </Input.Label>
                {step == 1 ?
                  name !== "phone_number" && <UserInput
                    placeholder={attributes.placeholder}
                    {...signUp1_hook.getInputProps(name)}
                    size='lg'
                    radius={10}
                  />
                  :
                  name !== "password" && <UserInput
                    placeholder={attributes.placeholder}
                    {...signUp2_hook.getInputProps(name)}
                    size='lg'
                    radius={10}
                  />
                }
                {name === "phone_number" &&
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={signUp1_hook.values.phone_number}
                    onChange={(value) => signUp1_hook.setFieldValue('phone_number', value)}
                    international
                    defaultCountry='HK'
                  />
                }
                {name === 'password' &&
                  <PasswordStrength
                    value={signUp2_hook.values.password}
                    onChange={(value: string) => signUp2_hook.setFieldValue('password', value)}
                  />
                }
              </div>
            )
          })
        }
        <Button
          disabled={step == 1 ? !(signUp1_hook.isTouched() && signUp1_hook.isValid()) : !(signUp2_hook.isTouched() && signUp2_hook.isValid())}
          size='lg'
          style={{ borderRadius: '40px', width: '450px' }}
          type="primary"
          color="purple"
        >
          Next
        </Button>
      </Stack>
    </form>
  )
}

export default SignUpForm;