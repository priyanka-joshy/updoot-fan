import { Stack, Text } from '@mantine/core';
import {
  Dropzone as DropzoneMantine,
  DropzoneProps,
  IMAGE_MIME_TYPE,
} from '@mantine/dropzone';
import Image from 'next/image';
import {
  IoIosAddCircle,
  IoIosCheckmarkCircle,
  IoIosCloseCircle,
} from 'react-icons/io';

const Dropzone = (props: Partial<DropzoneProps> & { value?: File | null }) => {
  return (
    <div>
      <DropzoneMantine
        {...props}
        accept={IMAGE_MIME_TYPE}
        onDrop={props.onDrop ?? ((files) => console.log(files))}>
        <Stack align="center">
          {!props.value ? (
            <>
              <DropzoneMantine.Accept>
                <IoIosCheckmarkCircle size={50} fill="gray" />
              </DropzoneMantine.Accept>
              <DropzoneMantine.Reject>
                <IoIosCloseCircle size={50} fill="gray" />
              </DropzoneMantine.Reject>
              <DropzoneMantine.Idle>
                <IoIosAddCircle size={50} fill="gray" />
              </DropzoneMantine.Idle>
              <Stack align="center">
                <Text size="xl" inline color="gray">
                  {props.title}
                </Text>
                <Text size="sm" color="gray" inline mt={7}>
                  {props.placeholder}
                </Text>
              </Stack>
            </>
          ) : (
            <Image
              src={URL.createObjectURL(props.value)}
              height="100%"
              width="100%"
              objectFit="contain"
            />
          )}
        </Stack>
      </DropzoneMantine>
    </div>
  );
};

export default Dropzone;
