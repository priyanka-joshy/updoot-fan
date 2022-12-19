import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  CognitoUserExt, 
  LoginCredentials, 
  ResetPassword, 
  SignUpCredentials
} from './dataTypes'
// amplify authentication
import { Amplify, Auth } from 'aws-amplify';
import { CognitoUser } from "@aws-amplify/auth";
import awsExports from '../../../src/aws-exports';
Amplify.configure(awsExports);

interface AuthContextI {
  user: CognitoUserExt | null,
  authLoading: boolean,
  cognitoLogin: ({ email, password }: LoginCredentials) => Promise<Error | undefined>,
  cognitoLogout: () => Promise<void>,
  cognitoRegister: ({ email, password, username, phone_number }: SignUpCredentials) => Promise<CognitoUser | Error>,
  cognitoConfirmRegistration: (username: string, code: string) => Promise<any>,
  cognitoForgotPassword: (email: string) =>  Promise<any>
  cognitoSubmitNewPassword: ({ email, code, password }: ResetPassword) => Promise<string | Error>
}

// auth context
export const AuthContext = createContext<AuthContextI | null>(null);

// auth provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useCognitoAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

// hook to access auth context
export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (authContext === null) {
    throw new Error("useAuth error");
  }
  return authContext;
}

const useCognitoAuth = () => {
  const [user, setUser] = useState<CognitoUserExt | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        setUser(currentUser);
        setAuthLoading(false);
      } catch (error) {
        console.log(error);
        setAuthLoading(false);
      }
    }
    getCurrentUser();
  }, [])

  const cognitoLogin = async ({ email, password }: LoginCredentials) => {
    try {
      const user = await Auth.signIn(email, password);
      setUser(user);
    } catch (error) {
      return error as Error;
    }
  }

  const cognitoLogout = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      }
      console.log("Log out error: ", error);
    }
  }

  const cognitoRegister = async ({ email, password, username, phone_number }: SignUpCredentials) => {
    try {
      const { user } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          name: username,
          phone_number
        },
      });
      return user;
    } catch (error) {
      return error as Error;
    }
  }
  const cognitoConfirmRegistration = async (username: string, code: string) => {
    try {      
      const res = await Auth.confirmSignUp(username, code);
      return res;
    } catch (error) {
      return error as Error;
    }
  }

  const cognitoForgotPassword = async (email: string) => {
    try {
      const data = await Auth.forgotPassword(email);
      return data;
    } catch (error) {
      return error as Error;
    }
  }
  const cognitoSubmitNewPassword = async ({email, code, password}: ResetPassword) => {
    try {
      const data = await Auth.forgotPasswordSubmit(email, code, password);
      return data;
    } catch (error) {
      return error as Error;
    }
  }

  return { 
    user, 
    authLoading,
    cognitoLogin, 
    cognitoLogout, 
    cognitoRegister, 
    cognitoConfirmRegistration, 
    cognitoForgotPassword,
    cognitoSubmitNewPassword
  };
}