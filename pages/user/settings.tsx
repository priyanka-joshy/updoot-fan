import { Flex, Input, Modal, PasswordInput, Stack, UnstyledButton } from '@mantine/core';
import { GetServerSidePropsContext } from 'next';
import { useRef, useState } from 'react';
import Button from '@components/button';
import { BodyText, Heading1, Heading2, Heading3, Subheading2, Subheading3 } from '@components/typography';
import { useAuth } from 'src/utils/auth/authContext';
import styles from 'styles/user/settings.module.scss';
import Link from 'next/link';
import { TbChevronLeft, TbTrashX } from 'react-icons/tb';
import { uploadFile } from 'src/utils/storage';
import PasswordStrength from 'src/utils/auth/forms/passwordStrength';
import { useChangePassword } from 'src/utils/auth/forms/hooks';

const emptyPhoto = "/emptyPhoto.png";
const maxFileSize = 10000000;
const allowedFileTypes = ['image/png', 'image/jpeg'];

interface IProps {
  currentProfilePhoto: string
}

const Settings = ({currentProfilePhoto}: IProps) => {
  const { user, cognitoChangePassword } = useAuth();
  const changePasswordHook = useChangePassword();
  const [passwordModal, setPasswordModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState<File>();
  const [currentPhoto, setCurrentPhoto] = useState<string>(currentProfilePhoto);
  const [newPassword, setNewPassword] = useState<{old_password: string, new_password: string}>();
  const filePickerRef = useRef<HTMLInputElement>(null);

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
    setCurrentPhoto(currentProfilePhoto); //Set to new profile picture
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

  return (
    <Stack>
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

            <Button type="primary" color="black" size="md">
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
        <Stack w={'30%'} spacing={48}>
          <Button type="primary" color="purple" size="lg" style={{ width: '100%' }} onClick={()=>handleSaveChanges()} disabled={currentPhoto===currentProfilePhoto && !newPassword}>
            Save
          </Button>
          <UnstyledButton className={styles.infoCard} onClick={()=>alert("Delete account")}>
            <Flex align="center" gap={8}>
              <TbTrashX size={20}/>
              <Subheading2>Delete account</Subheading2>
            </Flex>
            <Subheading2>Please note, after confirmation, this action cannot be undone</Subheading2>
          </UnstyledButton>
        </Stack>
      </Flex>
    </Stack>
  );
};

export default Settings;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // get filepath of current profile picture from db
  const photoURL = 'https://cdn.dribbble.com/users/9578072/screenshots/16902417/media/ceea4b54f32875615939394374c2c108.png?compress=1&resize=1600x1200&vertical=top';
  // const currentProfilePhoto = await getUploadedFile(photoURL);
  
  return {
    props: {
      currentProfilePhoto: photoURL
      // currentProfilePhoto: currentProfilePhoto instanceof Error? emptyPhoto : currentProfilePhoto
    }
  }
}