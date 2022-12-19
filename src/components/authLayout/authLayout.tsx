import { ReactNode } from 'react';
import {
  Text,
  Title,
} from '@mantine/core';
import UpdootLogo from 'public/mainLogo.svg';
import styles from './authLayout.module.scss';

const AuthLayout = (
  props: {
    children: ReactNode;
  }
) => {
  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.authPage}>
        <UpdootLogo className={styles.logo} />
        <div className={styles.card}>
          <div className={styles.formContainer}>
          {props.children}
          </div>
          <div className={styles.imageContainer}>
            <Title order={2} align="center">Welcome aboard!</Title>
            <img
              src='/astronaut.png'
              height='auto'
              width='100%'
            />
          </div>
        </div>
      </div>
      <footer>
        <Text>© 2022</Text>
        <Text weight={600}>&nbsp;Updoot</Text>
        <Text>. All rights reserved</Text>
      </footer>
    </div>
  );
};

export default AuthLayout;
