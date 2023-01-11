import { Subheading2 } from '@components/typography';
import { Flex, FlexProps } from '@mantine/core';
import styles from './styles.module.scss';
interface badgeProps extends FlexProps {
  profilePicture: string;
  username?: string;
  role: 'Fan' | 'Staff' | 'Manager';
}
const UserBadge = (props: badgeProps) => {
  return (
    <Flex align={'center'} gap="sm">
      <div className={styles.container}>
        <img
          className={styles.logo}
          src={props.profilePicture}
          alt="Profile Picture"
        />
        {
          {
            Fan: <img src={'/General.png'} className={styles.badge} />,
            Manager: <img src={'/Sponsor.png'} className={styles.badge} />,
            Staff: <img src={'/Business.png'} className={styles.badge} />,
          }[props.role]
        }
      </div>
      {props.username ? <Subheading2>{props.username}</Subheading2> : null}
    </Flex>
  );
};

export default UserBadge;
