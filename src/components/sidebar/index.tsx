import { Container, Flex, Navbar, NavbarProps, NavLink, Text } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiCompass } from 'react-icons/fi';
import { HiOutlineUser, HiOutlineLogout, HiOutlineUserGroup } from 'react-icons/hi';
import { WiStars } from 'react-icons/wi';
import { AiOutlinePieChart, AiOutlineEye } from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';
import { TbCalendarTime } from 'react-icons/tb';
import { RiChatCheckLine } from 'react-icons/ri';
import { CiBank } from 'react-icons/ci';
import { getDashboardType, handleUserType } from 'src/utils/auth/handleUserAccess';
import { useAuth } from '../../utils/auth/authContext';

import UserCard from '../userInfo';
import styles from './styles.module.scss';

type UserRole = 'fan' | 'staff';
interface ISidebarLink {
  link: string,
  icon: JSX.Element
}
const ACCOUNT_INFO = {
  name: 'Carrie Pan',
  level: 9000,
  avatar:
    'data:image/jpeg;base64,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',
};

const SideBar = (props: Partial<NavbarProps>) => {
  const { user, cognitoLogout } = useAuth();
  if (!user) return null;

  const currentUserGroup = handleUserType(user).group;
  const [mode, setMode] = useState<UserRole>(currentUserGroup);
  const router = useRouter();
  const currentPath = router.pathname;
  
  const sidebarData: Record<UserRole, Record<string, ISidebarLink>> = {
    fan: {
      'Proposals': {link: '/user/proposals', icon: <FiCompass size={24} />},
      'Profile': {link: '/user/profile', icon: <HiOutlineUser size={24} />},
    },
    staff: {
      'Overview': {link: '/admin', icon: <AiOutlinePieChart size={24} />},
      'Campaigns': {link: '', icon: <TbCalendarTime size={24} />},
      'Approval': {link: '/admin/approval', icon: <RiChatCheckLine size={24} />},
      'Financial': {link: '/admin/financial', icon: <CiBank size={24} />},
      'Community': {link: '', icon: <HiOutlineUserGroup size={24} />},
    }
  }

  const SidebarLink = ({label, link, icon}:  ISidebarLink & {label: string}) => {
    return (
      <Link href={link}>
        <NavLink
          className={`${styles.navButton} ${currentPath === link ? styles.selected : ''}`}
          icon={icon}
          label={label}
        />
      </Link>
    )
  }

  const handleSwitchView = () => {
    const userView = mode === 'staff' ? 'fan' : 'staff';
    setMode(userView);
    router.push(getDashboardType(userView));
  }
  
  return (
    <Navbar
      hidden
      hiddenBreakpoint={'sm'}
      width={{ base: 200 }}
      className={styles.container}
      pt="md"
      {...props}>
      {mode === "fan" &&
        <>
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
        </>
      }
      <Navbar.Section grow w="100%">
        <Container px={0} mb={currentUserGroup === "fan" && mode === "fan"? 200: 'md'}>
          {Object.entries(sidebarData[mode]).map(([label, { link, icon }]) => {
            return <SidebarLink {...{ label, link, icon }} key={label}/>
          })}
        </Container>

        {currentUserGroup === 'staff' &&
          <Container px={0} my={100}>
            <SidebarLink 
              label='Settings' 
              link='' 
              icon={<IoSettingsOutline size={24} />}
            />
            <NavLink
              className={styles.navButton} 
              label='Switch View' 
              icon={<AiOutlineEye size={24} />} 
              onClick={() => handleSwitchView()} 
            />
          </Container>
        }

        <NavLink
          className={styles.navButton}
          label='Sign Out' 
          icon={<HiOutlineLogout size={24} />} 
          onClick={() => cognitoLogout()} 
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default SideBar;
