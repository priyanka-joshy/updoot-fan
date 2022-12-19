import { CognitoUser } from "@aws-amplify/auth";

type UserRole = 'fan' | 'staff';
interface UserAttributes {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  phone_number: string;
  phone_number_verified: boolean;
}
interface CognitoUserExt extends CognitoUser {
  attributes: UserAttributes;
  signInUserSession: {
    accessToken: {
      jwtToken: string,
      payload: {
        "cognito:groups": UserRole[] | undefined
      }
    }
  }
}

interface LoginCredentials {
  email: string;
  password: string;
}
interface SignUp1_Credentials {
  username: string,
  phone_number: string,
  email: string
}
interface SignUp2_Credentials {
  password: string,
  confirm_password: string;
}
interface SignUpCredentials extends SignUp1_Credentials {
  password: string
}
interface ResetPassword {
  email: string,
  code: string,
  password: string
}

interface ConfirmationCredentials {
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
  | 'verified'
  | 'login'
  | 'forgotPassword'
  | 'submitPassword';

interface FormField {
  type: 'text' | 'password',
  label: string,
  placeholder: string,
}

export type {
  CognitoUserExt,
  LoginCredentials,
  SignUp1_Credentials,
  SignUp2_Credentials,
  SignUpCredentials,
  ConfirmationCredentials,
  ResetPassword,
  PasswordReset,
  AuthProcessI,
  FormField
}