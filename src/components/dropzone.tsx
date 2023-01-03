import { Stack, Text } from '@mantine/core';
import {
  Dropzone as DropzoneMantine,
  DropzoneProps,
  IMAGE_MIME_TYPE,
} from '@mantine/dropzone';
import Image from 'next/image';
import { BiImageAdd } from 'react-icons/bi';
import {
  IoIosAddCircle,
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
} from 'react-icons/io';
import { TbFileUpload, TbPictureInPicture } from 'react-icons/tb';
import Button from './button';

const Dropzone = (
  props: Partial<DropzoneProps> & { value?: File | null } & {
    type?: string;
  }
) => {
  return (
    <div>
      <DropzoneMantine
        {...props}
        accept={IMAGE_MIME_TYPE}
        onDrop={props.onDrop ?? ((files) => console.log(files))}>
        {!props.value ? (
          <Stack align="center" spacing={'xl'} style={{ padding: '1rem' }}>
            <DropzoneMantine.Accept>
              <IoIosCheckmarkCircle size={50} fill="gray" />
            </DropzoneMantine.Accept>
            <DropzoneMantine.Reject>
              <IoIosCloseCircle size={50} fill="gray" />
            </DropzoneMantine.Reject>
            <DropzoneMantine.Idle>
              {props.type === 'file' ? (
                <TbFileUpload size={50} color="gray" />
              ) : (
                <BiImageAdd size={50} color="gray" />
              )}
            </DropzoneMantine.Idle>
            <Stack align="center" spacing="xl">
              <Text size="xl" inline color="gray">
                {props.title}
              </Text>
              <Button type="secondary" color="black" size="sm">
                Can't Drag? Upload Here
              </Button>
              <Text size="sm" color="gray" inline mt={7}>
                {props.placeholder}
              </Text>
            </Stack>
          </Stack>
        ) : (
          <Stack>
            <Image
              src={URL.createObjectURL(props.value)}
              height="100%"
              width="100%"
              objectFit="contain"
            />
          </Stack>
        )}
      </DropzoneMantine>
    </div>
  );
};

export default Dropzone;
