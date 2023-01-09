import {
  FormField,
  SignUp1_Credentials,
  SignUp2_Credentials,
} from '../dataTypes';

const signUp1_formData: Record<keyof SignUp1_Credentials, FormField> = {
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
  },
};
const signUp2_formData: Record<keyof SignUp2_Credentials, FormField> = {
  password: {
    type: 'password',
    label: 'Password',
    placeholder: 'Ajd18sjbny?',
  },
  confirm_password: {
    type: 'password',
    label: 'Confirm Password',
    placeholder: '',
  },
};
const signUp1_initialValues: SignUp1_Credentials = {
  username: '',
  phone_number: '',
  email: '',
};

const signUp2_initialValues: SignUp2_Credentials = {
  password: '',
  confirm_password: '',
};

export {
  signUp1_formData,
  signUp2_formData,
  signUp1_initialValues,
  signUp2_initialValues,
};
