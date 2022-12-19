import { Flex, Input, InputProps, Stack, UnstyledButton } from '@mantine/core';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { BodyText } from '@components/typography';
import styles from './styles.module.scss';
import { TbSearch } from 'react-icons/tb';

interface IProps {
  content: {
    text?: string;
    image?: string;
  }[];
}

const Dropdown = (props: InputProps & IProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputWidth, setInputWidth] = useState<number>();
  const [inputText, setInputText] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [modalOpen, setModalOpen] = useState(false);

  useLayoutEffect(() => {
    setInputWidth(inputRef.current?.offsetWidth);
    const updateWidth = () => setInputWidth(inputRef.current?.offsetWidth);
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (selectedIndex !== undefined)
      setInputText(props.content[selectedIndex].text ?? '');
  }, [selectedIndex]);

  return (
    <>
      {modalOpen && (
        <div className={styles.overlay} onClick={() => setModalOpen(false)} />
      )}
      <div className={styles.container}>
        <Input
          {...props}
          icon={<TbSearch />}
          ref={inputRef}
          value={inputText}
          onFocus={() => setModalOpen(true)}
          onChange={(event) => setInputText(event.target.value)}
        />
        {modalOpen && (
          <Stack
            spacing={12}
            className={styles.modal}
            style={{ width: inputWidth }}>
            {props.content.map(
              (data, index) =>
                props.content[index].text
                  ?.toLowerCase()
                  ?.includes(inputText.toLowerCase()) && (
                  <UnstyledButton
                    onClick={() => {
                      setSelectedIndex(index);
                      setModalOpen(false);
                    }}
                    className={[
                      styles.option,
                      index === selectedIndex ? styles.selected : '',
                    ].join(' ')}>
                    <Flex align="center" gap={10}>
                      <img src={data.image} className={styles.image} />
                      <BodyText color="inherit">{data.text}</BodyText>
                    </Flex>
                  </UnstyledButton>
                )
            )}
          </Stack>
        )}
      </div>
    </>
  );
};

export default Dropdown;
