import React from 'react';
import { SolarNovaLogo, SolarNovaLogoProps } from './SolarNovaLogo';

export type MepLogoProps = SolarNovaLogoProps;

export const MepLogo: React.FC<MepLogoProps> = (props) => {
  return <SolarNovaLogo {...props} />;
};

export { SolarNovaLogo };

