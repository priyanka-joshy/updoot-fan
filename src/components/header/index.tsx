import {
  Header as HeaderMantine,
  HeaderProps,
  UnstyledButton,
  Flex,
  Divider,
  Loader,
} from '@mantine/core';
import { TbBell, TbPlus, TbSearch, TbSettings, TbWallet } from 'react-icons/tb';
import Button from '@components/button';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import UpdootSVG from 'public/updoot.svg';
import LogoSVG from 'public/logo.svg';
import { useAuth } from 'src/utils/auth/authContext';
import api from 'src/utils/api';
import { getProfilePicture } from 'src/utils/storage';

const Header = (props: Partial<HeaderProps>) => {
  const router = useRouter();
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string>();

  if (!user) return null;

  const headerLinks: Record<string, JSX.Element> = {
    wallet: <TbWallet size={'1.5rem'} />,
    proposals: <TbSearch size={'1.5rem'} />,
    notifications: <TbBell size={'1.5rem'} />,
    settings: <TbSettings size={'1.5rem'} />,
  };

  useEffect(() => {
    const getData = async () => {
      const { message: userInfo } = await api.user.get(
        `/getUserByUsername/${user.attributes.name}`
      );
      const currentProfilePhoto = await getProfilePicture(
        userInfo.profilePicture
      );
      setProfilePicture(currentProfilePhoto);
    };

    getData();
  }, []);

  return (
    <HeaderMantine height={70} className={styles.container} {...props}>
      <Flex align={'center'} gap={'sm'}>
        <LogoSVG className={styles.updoot} />
        <UpdootSVG className={styles.updoot} />
      </Flex>

      <div className={styles.utilContainer}>
        {Object.entries(headerLinks).map(([link, icon]) => (
          <Link href={`/user/${link}`} key={link}>
            <UnstyledButton>{icon}</UnstyledButton>
          </Link>
        ))}
        <Button color="black" onClick={() => router.push('proposals/create')}>
          <TbPlus style={{ verticalAlign: 'middle' }} />
        </Button>
        <Divider
          orientation="vertical"
          color="black"
          style={{ margin: '0.4rem 0' }}
        />
        <UnstyledButton>
          {profilePicture ? (
            <img
              style={{
                width: '40px',
                borderRadius: '50%',
                border: '1px solid #CCCCCC',
              }}
              src={profilePicture}
              alt="Profile Picture"
            />
          ) : (
            <Loader color="grey" />
          )}
        </UnstyledButton>
      </div>
    </HeaderMantine>
  );
};

export default Header;
