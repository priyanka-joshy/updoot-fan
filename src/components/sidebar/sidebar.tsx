import { Flex, Navbar, NavbarProps, NavLink, Text } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiCompass } from 'react-icons/fi';
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';
import { WiStars } from 'react-icons/wi';
import { useAuth } from '../../utils/auth/authContext';


import UserCard from '../usercard';
import styles from './sidebar.module.scss';

const ACCOUNT_INFO = {
  name: 'Assan Kozhin',
  level: 99,
  avatar:
    'https://www.cityu.edu.hk/sro/AboutStudentResidence/ResidenceHalls/SR06/SR06_301A_56279462_KOZHIN,Assan.jpg',
};

const Sidebar = (props: Partial<NavbarProps>) => {
  const [mode, setMode] = useState<'user' | 'admin'>('user');
  const path = useRouter().asPath.split('/')[2];
  const { cognitoLogout } = useAuth();
  return (
    <Navbar
      hidden
      hiddenBreakpoint={'sm'}
      width={{ base: 200 }}
      className={styles.container}
      pt="md"
      {...props}>
      <Navbar.Section>
        <UserCard {...ACCOUNT_INFO} />
      </Navbar.Section>
      <Navbar.Section my="md">
        <Flex align="center" pos="relative" left="-10%">
          <WiStars color="#6200FF" size={36} />
          <Text weight={700} size={24}>
            99999
          </Text>
        </Flex>
      </Navbar.Section>
      <Navbar.Section grow w="100%">
        <Link href="/user/proposals">
          <NavLink
            className={[
              styles.navButton,
              path === 'proposals' ? styles.selected : '',
            ].join(' ')}
            icon={<FiCompass size={24} />}
            label="Proposals"
          />
        </Link>
        <Link href="/user/profile">
          <NavLink
            className={[
              styles.navButton,
              path === 'profile' ? styles.selected : '',
            ].join(' ')}
            icon={<HiOutlineUser size={24} />}
            label="Profile"
          />
        </Link>
        <NavLink
          className={styles.navButton}
          mt={200}
          icon={<HiOutlineLogout size={24} />}
          label="Sign Out"
          onClick={()=>cognitoLogout()}
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default Sidebar;
