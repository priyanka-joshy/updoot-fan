import {
  Button as ButtonMantine,
  FileButton,
  FileButtonProps,
  Group,
  Text,
} from '@mantine/core';

import styles from './styles.module.scss';

interface IProps extends Partial<FileButtonProps> {
  title?: string;
  value?: File | null;
  placeholder: string;
}

const FilePicker = (props: IProps) => {
  const Button = (buttonProps: { onClick: () => void }) => {
    return (
      <Group noWrap>
        <Text
          style={{ color: props.value ? undefined : '#A1A1A1' }}
          className={styles.filename}>
          {props.value?.name ?? props.placeholder}
        </Text>
        <ButtonMantine {...buttonProps} variant="light" color="dark">
          {props.title ?? 'Select file'}
        </ButtonMantine>
      </Group>
    );
  };
  return (
    <div>
      <FileButton onChange={props.onChange ?? ((file) => console.log(file))}>
        {Button}
      </FileButton>
    </div>
  );
};

export default FilePicker;
