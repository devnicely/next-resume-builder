import { PageProps } from '~/utils/template';
import Simple from './resumetemplate/simple/Simple';
import SimpleCoverSheet from './covertemplate/simple/SimpleCoverSheet';
import SimpleResume from './resume/simplesimple/SimpleResume';
import { TemplateType } from '~/constants';

export type TemplateMeta = {
  id: string;
  name: string;
  preview: string;
  component: React.FC<PageProps>;
  type: TemplateType
};

const templateMap: Record<string, TemplateMeta> = {

  simplecoversheet: {
    id: 'simplecoversheet',
    name: 'Simple CoverSheet',
    preview: '/images/templates/covers/1.jpg',
    component: SimpleCoverSheet,
    type: TemplateType.COVER_TEMPLATE
  },

  simple: {
    id: 'simple',
    name: 'Simple Resume Template',
    preview: '/images/templates/resumes/1.jpg',
    component: Simple,
    type: TemplateType.RESUME_TEMPLATE
  },

  // simple1: {
  //   id: 'simple',
  //   name: 'Flower Template',
  //   preview: '/images/templates/1fbcad262951ef93da881801a.jpeg',
  //   component: Simple,
  //   type: TemplateType.RESUME_TEMPLATE
  // },
 
  simplecoversheet_simple: {
    id: 'simplecoversheet_simple',
    name: 'SimpleResume',
    preview: '/images/templates/1fbcad262951ef93da881801a.jpeg',
    component: SimpleResume,
    type: TemplateType.RESUME
  },
};

export default templateMap;
