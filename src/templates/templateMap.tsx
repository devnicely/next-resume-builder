import { PageProps } from '~/utils/template';

import Simple from './template/simple/Simple';
import SimpleCoverSheet from './cover/simple/SimpleCoverSheet';
import SimpleResume from './resume/SimpleResume';


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
 
  simplecoversheet: {
    id: 'simplecoversheet',
    name: 'Simple CoverSheet',
    preview: '/images/templates/covers/1.jpg',
    component: SimpleCoverSheet,
  },

  simpleresume: {
    id: 'simpleresume',
    name: 'SimpleResume',
    preview: '/images/templates/1fbcad262951ef93da881801a.jpeg',
    component: SimpleResume,
  },
};


export default templateMap;
