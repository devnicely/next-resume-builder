import { PageProps } from '~/utils/template';

import Castform from './Leafish/Leafish';
import Gengar from './Leafish/Leafish';
import Glalie from './Leafish/Leafish';
import Kakuna from './Leafish/Leafish';
import Leafish from './Leafish/Leafish';
import Onyx from './Leafish/Leafish';
import Pikachu from './Leafish/Leafish';



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
    id: 'castform',
    name: 'Castform',
    preview: '/images/templates/castform.jpg',
    component: Castform,
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
