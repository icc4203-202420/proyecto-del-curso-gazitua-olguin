// FormInputController.tsx
import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Input, InputProps } from '@rneui/themed';

// Tipos para las propiedades del componente
interface FormInputControllerProps extends InputProps {
  name: string;
  control: Control<any>;
  rules?: any;
  defaultValue?: string;
}

const FormInputController: React.FC<FormInputControllerProps> = ({
  name,
  control,
  rules = {},
  defaultValue = '',
  ...inputProps
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          {...inputProps}
          onChangeText={onChange}
          value={value}
          errorMessage={error?.message}
        />
      )}
    />
  );
};

export default FormInputController;
