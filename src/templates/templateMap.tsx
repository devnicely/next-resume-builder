import { PageProps } from '~/utils/template';

import Simple from './resume/simple/Simple';
import Gengar from './resume/simple/Simple';
import Glalie from './resume/simple/Simple';
import Kakuna from './resume/simple/Simple';
import Leafish from './resume/simple/Simple';
import Onyx from './resume/simple/Simple';
import Pikachu from './resume/simple/Simple';


export type TemplateMeta = {
  id: string;
  name: string;
  preview: string;
  component: React.FC<PageProps>;
};

const templateMap: Record<string, TemplateMeta> = {
  kakuna: {
    id: 'kakuna',
    name: 'Kakuna',
    preview: '/images/templates/kakuna.jpg',
    component: Kakuna,
  },
  onyx: {
    id: 'onyx',
    name: 'Onyx',
    preview: '/images/templates/onyx.jpg',
    component: Onyx,
  },
  pikachu: {
    id: 'pikachu',
    name: 'Pikachu',
    preview: '/images/templates/pikachu.jpg',
    component: Pikachu,
  },
  gengar: {
    id: 'gengar',
    name: 'Gengar',
    preview: '/images/templates/gengar.jpg',
    component: Gengar,
  },
  castform: {
    id: 'simple',
    name: 'Simple',
    preview: '/images/templates/castform.jpg',
    component: Simple,
  },
  glalie: {
    id: 'glalie',
    name: 'Glalie',
    preview: '/images/templates/glalie.jpg',
    component: Glalie,
  },
  leafish: {
    id: 'leafish',
    name: 'Leafish',
    preview: '/images/templates/leafish.jpg',
    component: Leafish,
  },
};

export default templateMap;
