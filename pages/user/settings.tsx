import { Container, Flex, Input, Loader, Modal, PasswordInput, Stack, UnstyledButton } from '@mantine/core';
import { GetServerSidePropsContext } from 'next';
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from 'react';
import Button from '@components/button';
import { BodyText, Heading1, Heading2, Heading3, Subheading2, Subheading3 } from '@components/typography';
import { useAuth } from 'src/utils/auth/authContext';
import styles from 'styles/user/settings.module.scss';
import Link from 'next/link';
import { TbChevronLeft, TbCircleCheck, TbTrashX } from 'react-icons/tb';
import { getProfilePicture, uploadFile } from 'src/utils/storage';
import PasswordStrength from 'src/utils/auth/forms/passwordStrength';
import { useChangePassword } from 'src/utils/auth/forms/hooks';
import { useRouter } from 'next/router';
import { Auth, withSSRContext } from 'aws-amplify';
import api from 'src/utils/api';

const emptyPhoto = "/emptyPhoto.png";
const maxFileSize = 10000000;
const allowedFileTypes = ['image/png', 'image/jpeg'];

interface IProps {
  currentProfilePhoto: string
}
interface IModalProps {
  modalOpened: boolean, 
  setModalOpened: Dispatch<SetStateAction<boolean>>, 
  sticky: boolean,
  children: ReactNode
}
type ModalTypes = "saving"|"saved"|"delete"|"deleting";
interface ModalData {
  icon: JSX.Element,
  text: string,
  btnText?: string,
  onClick?: () => void,
  subText?: string
}

const MessageModal = ({modalOpened, setModalOpened, sticky, children}: IModalProps) => {
  return(
    <Modal
        centered={true}
        radius={'xl'}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        size={'30%'}
        withCloseButton={sticky}
        closeOnClickOutside={sticky}
        closeOnEscape={sticky}
      >
        <Stack align={'center'} justify="center" mih={'34rem'} w={'75%'} ta="center" mx={'auto'}>
          {children}
        </Stack>
      </Modal>
  )
}

const Settings = ({currentProfilePhoto}: IProps) => {
  const { user, cognitoChangePassword, cognitoLogout } = useAuth();
  const changePasswordHook = useChangePassword();
  const filePickerRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [currentPhoto, setCurrentPhoto] = useState<string>(currentProfilePhoto);
  const [newPhoto, setNewPhoto] = useState<File>();
  const [newPassword, setNewPassword] = useState<{old_password: string, new_password: string}>();

  const [passwordModal, setPasswordModal] = useState(false);
  const [msgModal, setMsgModal] = useState(false);
  const [status, setStatus] = useState<ModalTypes>();

  if(!user) return null;

  const handleRemovePhoto = ()=> {
    // Show empty photo
    setCurrentPhoto(emptyPhoto);
    setNewPhoto(undefined);
  }
  const handleNewPhoto = (e: React.ChangeEvent<HTMLInputElement>)=>{
    // Check file type and size
    const file = e.currentTarget.files![0];
    if(!file) return;

    if(file.size > maxFileSize || !allowedFileTypes.includes(file.type)){
      console.log("File type/size not allowed."); //TODO: Show file criteria error
      return;
    }
    setNewPhoto(e.currentTarget.files![0]);
    setCurrentPhoto(URL.createObjectURL(e.currentTarget.files![0]));
  }
  const handleSaveChanges = async ()=> {
    setStatus("saving")
    setMsgModal(true);
    // Photo changed
    if (currentPhoto !== currentProfilePhoto) {
      if (currentPhoto === emptyPhoto) {
        // Remove picture in db
        console.log("Removed profile picture");
      } else {
        if (!newPhoto) return;
        const newKey = await uploadFile(user.attributes.email, 'profile', newPhoto);

        if (newKey instanceof Error) {
          console.log(newKey.message); //TODO: Show file upload error
        } else {
          // Update picture in db
          console.log("Updated new picture: ", newKey);
        }
      }
    }

    // Password changed
    if(newPassword){
      const result = await cognitoChangePassword(newPassword);
      if(result instanceof Error){
        console.log("Error: Could not reset password. ", result.message);
      }else{
        console.log("Password reset successfully");
      }
    }
    setNewPassword(undefined);
    setNewPhoto(undefined);
    setStatus("saved");
  }
  const handleDeleteAccount = async () => {
    setStatus("deleting");
    try {
      await Auth.deleteUser();
      await cognitoLogout();
    } catch (error) {
      console.log('Error deleting user: ', error);
    }
  }

  const profilePicture = (
    <Stack spacing={16}>
      <img
        src={currentPhoto}
        className={styles.image}
      />
      <input
        type="file"
        style={{ display: 'none' }}
        ref={filePickerRef}
        onChange={(event) =>handleNewPhoto(event)}
      />
      <Button type="secondary" color="black" size="md" style={{ width: 400 }} onClick={() => handleRemovePhoto()} disabled={currentPhoto===emptyPhoto}>
        Remove photo
      </Button>
      <Button type="primary" color="black" size="md" style={{ width: 400 }} onClick={() => filePickerRef.current?.click()}>
        Upload new photo
      </Button>
      <Subheading3 className={styles.infoText}>(JPG  or PNG, max 10MB)</Subheading3>
    </Stack>
  )
  const resetPassword = (
    <Stack spacing={16}>
      <BodyText className={styles.infoText}>********</BodyText>
      <Button type="primary" color="black" size="md" style={{ width: 300 }} onClick={() => setPasswordModal(true)}>
        Reset Password
      </Button>
    </Stack>
  )

  const userInfo: Record<string, string|JSX.Element> = {
    'Profile Photo': profilePicture,
    'Username': user.attributes.name,
    'Phone number': user.attributes.phone_number,
    'Email': user.attributes.email,
    'Password': resetPassword
  }

  const modalData: Record<ModalTypes, ModalData>= {
    saving: {
      icon: <Loader color="#9653f8" />,
      text: 'Saving Account',
    },
    saved: {
      icon: <TbCircleCheck color="#6200FF" size={32}/>,
      text: 'Account Saved',
      btnText: 'View Profile',
      onClick: ()=>{router.push('/user/profile')}
    },
    delete: {
      icon: <TbTrashX color="#141414" size={32}/>,
      text: 'Delete Account?',
      subText: 'Please note, after confirmation, this action cannot be undone',
      btnText: 'Confirm',
      onClick: ()=>{handleDeleteAccount()}
    },
    deleting: {
      icon: <Loader color="#9653f8" />,
      text: 'Deleting account',
    }
  }
  return (
    <Stack>
      {status &&
        <MessageModal modalOpened={msgModal} setModalOpened={setMsgModal} sticky={status==="delete"}>
          {modalData[status].icon}
          <Heading1 style={{ marginBottom: 50}}>{modalData[status].text}</Heading1>
          <Subheading2 style={{ textAlign: "center"}}>{modalData[status].subText}</Subheading2>
          {modalData[status].btnText && modalData[status].onClick && 
            <Button type="primary" color="purple" style={{ width: 215 }} onClick={modalData[status].onClick}>
              {modalData[status].btnText}
            </Button>
          }
        </MessageModal>
      }
      <Modal
        centered={true}
        size={'80%'}
        padding={50}
        withCloseButton={true}
        radius={'xl'}
        opened={passwordModal}
        onClose={() => setPasswordModal(false)}>
        <form onSubmit={changePasswordHook.onSubmit((values) => {
          setNewPassword({old_password: values.old_password, new_password: values.new_password});
          setPasswordModal(false);
        })}>
          <Stack align={'flex-start'} spacing={36} w={'63%'} style={{ margin: '0 auto' }}>

            <Heading3>Reset Password</Heading3>

            <PasswordInput label="Enter current password" radius={10} size="lg" {...changePasswordHook.getInputProps('old_password')} w={'100%'} />
            <div style={{width: '100%'}}>
              <Input.Label mb={10}>
                <Subheading2>Enter new password</Subheading2>
              </Input.Label>
              <PasswordStrength
                value={changePasswordHook.values.new_password}
                onChange={(value: string) => changePasswordHook.setFieldValue('new_password', value)}
              />
            </div>
            <PasswordInput label="Confirm password" radius={10} size="lg" {...changePasswordHook.getInputProps('confirm_password')} w={'100%'} />

            <Button type="primary" color="black" style={{width: "100%"}}>
              Reset Password
            </Button>
          </Stack>
        </form>
      </Modal>
      
      {/* Back Button */}
      <Link href='/user/profile'>
        <UnstyledButton className={styles.backButton}>
          <TbChevronLeft size={18}/>
          <Subheading2>Back</Subheading2>
        </UnstyledButton>
      </Link>

      <Flex justify="space-between">
        {/* User Information */}
        <Stack spacing={48}>
          <Heading1>Settings</Heading1>
          {Object.entries(userInfo).map(([label, item])=> (
            <Flex align="flex-start" gap={100} key={label}>
              <Heading2 style={{minWidth: '12.5rem'}}>{label}</Heading2>
              {typeof (item) === "string" ?
                <BodyText className={styles.infoText}>{item}</BodyText> 
                :
                <>{item}</>
              }
            </Flex>
          ))}
        </Stack>
        {/* Save / Delete Account */}
        <Container w={'30%'} p={0} m={0}>
          <Stack spacing={48} pos="sticky" top={"15%"}>
            <Button type="primary" color="purple" size="lg" style={{ width: '100%' }} onClick={()=>handleSaveChanges()} disabled={currentPhoto===currentProfilePhoto && !newPassword}>
              Save
            </Button>
            <UnstyledButton className={styles.infoCard} onClick={()=>{setStatus("delete"); setMsgModal(true)}}>
              <Flex align="center" gap={8}>
                <TbTrashX size={20}/>
                <Subheading2>Delete account</Subheading2>
              </Flex>
              <Subheading2>Please note, after confirmation, this action cannot be undone</Subheading2>
            </UnstyledButton>
          </Stack>
        </Container>
      </Flex>
    </Stack>
  );
};

export default Settings;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const SSR = withSSRContext(context);
  const { name } = (await SSR.Auth.currentAuthenticatedUser()).attributes;
  // get filepath of current profile picture from db
  const { message: user } = await api.user.get(`/getUserByUsername/${name}`);
  // get file from s3 bucket
  const currentProfilePhoto = await getProfilePicture(user.profilePicture);
  return {
    props: {
      currentProfilePhoto
    }
  }
};