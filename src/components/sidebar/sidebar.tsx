import {
  Navbar,
  NavbarProps,
  NavLink,
  Text,
} from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiCompass } from 'react-icons/fi';
import { HiOutlineUser } from 'react-icons/hi';

import Sponsor from '../usercard';
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
        <Link href="/proposals">
          <NavLink
            className={[
              styles.navButton,
              path === 'proposals' ? styles.selected : '',
            ].join(' ')}
            icon={<FiCompass size={24} />}
            label="Proposals"
          />
        </Link>
        <Link href="/profile">
          <NavLink
            className={[
              styles.navButton,
              path === 'profile' ? styles.selected : '',
            ].join(' ')}
            icon={<HiOutlineUser size={24} />}
            label="Profile"
          />
        </Link>
      </Navbar.Section>
    </Navbar>
  );
};

export default Sidebar;
