// components/controllers/AuthInputController.tsx
import React from 'react';
import { Input, InputProps } from '@rneui/themed';

interface AuthInputControllerProps extends InputProps {
  value: string;
  setValue: (text: string) => void;
}

const AuthInputController: React.FC<AuthInputControllerProps> = ({
  value,
  setValue,
  ...inputProps
}) => (
  <Input
    {...inputProps}
    onChangeText={setValue}
    value={value}
  />
);

export default AuthInputController;
