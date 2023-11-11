import { PageProps } from '~/utils/template';

import Simple from './resume/simple/Simple';
import SimpleCoverSheet from './cover/simple/SimpleCoverSheet';


export type TemplateMeta = {
  id: string;
  name: string;
  preview: string;
  component: React.FC<PageProps>;
};

const templateMap: Record<string, TemplateMeta> = {
  simple: {
    id: 'simple',
    name: 'Simple',
    preview: '/images/templates/kakuna.jpg',
    component: Simple,
  },
  onyx: {
    id: 'onyx',
    name: 'Onyx',
    preview: '/images/templates/onyx.jpg',
    component: Simple,
  },

  simplecoversheet: {
    id: 'simplecoversheet',
    name: 'Simple CoverSheet',
    preview: '/images/templates/covers/1.jpg',
    component: SimpleCoverSheet,
  }
};


export default templateMap;
