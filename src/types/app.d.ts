import React from 'react';

export type SidebarSection = {
  id: string;
  kind?: string; // cover or resume?
  icon?: React.ReactElement;
  component: React.ReactElement;
};
