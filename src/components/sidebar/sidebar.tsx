import {
  Navbar,
  NavbarProps,
  NavLink,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { FiCompass } from 'react-icons/fi';
import { HiOutlineUser } from 'react-icons/hi';

import Sponsor from '../sponsor';
import styles from './sidebar.module.scss';

const ACCOUNT_INFO = {
  name: 'Assan Kozhin',
  level: 99,
  avatar:
    'https://www.cityu.edu.hk/sro/AboutStudentResidence/ResidenceHalls/SR06/SR06_301A_56279462_KOZHIN,Assan.jpg',
};

const Sidebar = (props: Partial<NavbarProps>) => {
  const path = useRouter().asPath.split('/')[1];
  return (
    <Navbar
      hidden
      hiddenBreakpoint={'sm'}
      width={{ base: 200 }}
      className={styles.container}
      pt="md"
      {...props}>
      <Navbar.Section>
        <Sponsor {...ACCOUNT_INFO} />
      </Navbar.Section>
      <Navbar.Section my="md">
        <Text weight={700} size={24}>
          99999
        </Text>
      </Navbar.Section>
      <Navbar.Section grow w="100%">
        <NavLink
          className={[
            styles.navButton,
            path === 'create' ? styles.selected : '',
          ].join(' ')}
          icon={<FiCompass size={24} />}
          label="Proposals"
        />
        <NavLink
          className={[
            styles.navButton,
            path === 'profile' ? styles.selected : '',
          ].join(' ')}
          icon={<HiOutlineUser size={24} />}
          label="Profile"
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default Sidebar;
