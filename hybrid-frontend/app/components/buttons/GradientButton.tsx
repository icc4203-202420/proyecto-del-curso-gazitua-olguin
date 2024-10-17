import React from 'react';
import { Button, ButtonProps } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps extends ButtonProps {
  colors?: string[];
}

const GradientButton: React.FC<GradientButtonProps> = ({
  colors = ['#FF9800', '#FF9801'], 
  children,
  ...buttonProps
}) => {
  return (
    <Button
      ViewComponent={LinearGradient}
      linearGradientProps={{
        colors,
        start: { x: 0, y: 0.5 },
        end: { x: 1, y: 0.5 },
      }}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

export default GradientButton;
