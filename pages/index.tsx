import { useRouter } from 'next/router';
import { Loader } from '@mantine/core';
import AuthLayout from '../src/components/authLayout';
import AuthForm from '../src/components/authForm';
import { useAuth } from '../src/utils/auth/authContext';
import { handleUserType } from 'src/utils/auth/handleUserAccess';


const Home = () => {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  if (authLoading || user) {
    user && router.push(handleUserType(user).dashboardLink);
    return (
      <div className='authLoader'>
        <Loader color="violet" size="lg" />
      </div>
    );
  }


  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  );
};

export default Home;
