import { Subheading3 } from '@components/typography';
import { Input, PasswordInput } from '@mantine/core';

interface IProps {
  value: string, 
  onChange: (value: string) => void 
}

const requirements = [
  { re: /[0-9]/, label: '1 number' },
  { re: /[a-z]/, label: '1 lowercase letter' },
  { re: /[A-Z]/, label: '1 uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: '1 special character' },
];
const PasswordRequirement = ({ meets, label }: { meets: boolean; label: string }) => {
  return (
    <Subheading3 color={meets ? '#6200FF' : '#A1A1A1'}>
      {label}
    </Subheading3>
  );
}

const PasswordStrength = ({ value, onChange }: IProps) => {
  const regExpChecks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
  ));

  return (
    <div>
      <PasswordInput
        value={value}
        onChange={(e)=>{
          onChange(e.target.value)
        }}
        size='lg'
        radius={10}
        placeholder="Ajd18sjbny?"
      />
      <Input.Description mt={10} style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem 1.625rem'
      }}>
        <PasswordRequirement label="8 characters minimum" meets={value.length > 7}/>
        {regExpChecks}
      </Input.Description>
    </div>
  );
}

export default PasswordStrength;