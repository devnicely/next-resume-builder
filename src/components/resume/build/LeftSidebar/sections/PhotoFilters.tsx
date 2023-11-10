import { Slider } from '~/components/common/slider';
import { Checkbox } from '~/components/common/checkbox';
import { Toggle } from '~/components/common/toggle-button';
import { CircleDashed } from 'lucide-react';
import get from 'lodash/get';
import { useTranslation } from 'next-i18next';
import { Photo, PhotoShape } from '~/schema';

import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { setResumeState } from '~/store/resume/resumeSlice';
import { Label } from '~/components/common/label';

const PhotoFilters = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const photo: Photo = useAppSelector((state) => get(state.resume.present, 'basics.photo'));
  const size: number = get(photo, 'filters.size', 128);
  const shape: PhotoShape = get(photo, 'filters.shape', 'square');
  const grayscale: boolean = get(photo, 'filters.grayscale', false);
  const border: boolean = get(photo, 'filters.border', false);

  const handleChangeSize = (size: number | number[]) =>
    dispatch(setResumeState({ path: 'basics.photo.filters.size', value: size }));

  const handleChangeShape = (shape: PhotoShape) => {

    dispatch(setResumeState({ path: 'basics.photo.filters.shape', value: shape }));
  }


  const handleSetGrayscale = (value: boolean) => 
    dispatch(setResumeState({ path: 'basics.photo.filters.grayscale', value }));

  const handleSetBorder = (value: boolean) => dispatch(setResumeState({ path: 'basics.photo.filters.border', value }));

  return (
    <div className="flex flex-col gap-2 p-5 dark:bg-zinc-900">
      <div>
        <h4 className="font-medium ml-2">Size (in px)</h4>
        <div className="mx-2">
          <Slider
            min={32}
            max={512}
            step={2}
            defaultValue={[size]}
            onValueChange={(value: number[]) => handleChangeSize(value)}
            className={"mt-2"}
          />
          <Label className={"mt-2 -ml-0.5"}>12</Label><Label className={"mt-2 -mr-1.5 float-right"}>512</Label>
        </div>
      </div>

      <div className="border-t border-gray-300"></div>

      <div>
        <h4 className="font-medium">Effects</h4>

        <div className="flex item-center mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="grayscale"
              color="secondary"
              defaultChecked={grayscale}
              onCheckedChange={(value) => handleSetGrayscale(value)}
            />
            <label
              htmlFor="grayscale"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Grayscale
            </label>
          </div>

          <div className="flex items-center space-x-2 mx-4">
            <Checkbox
              id="border"
              color="white" 
              defaultChecked={border} 
              onCheckedChange={(value) => handleSetBorder(value)}
            />
            <label
              htmlFor="border"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Border
            </label>
          </div>
        </div>


      </div>

      <div className="border-t border-gray-300"></div>

      <div className="flex flex-col gap-2">
        <h4 className="font-medium">Shape</h4>
        <div className='flex justify-center'>
          <Toggle variant="outline" pressed={shape == 'square' ? true : false} className="w-14 mx-2" onClick={() => handleChangeShape('square')}>
            <img src={"/icon/Rectangle 25.svg"} />
          </Toggle>
          <Toggle variant="outline" pressed={shape == 'rounded-square' ? true : false} className="w-14 mx-2" onClick={() => handleChangeShape('rounded-square')}>
            <img src={"/icon/Rectangle 26.svg"} />
          </Toggle>
          <Toggle variant="outline" pressed={shape == 'circle' ? true : false} className="w-14 mx-2" onClick={() => handleChangeShape('circle')}>
            <img src={"/icon/Rectangle 27.svg"} />
          </Toggle>
        </div>
      </div>
    </div>
  );
};

export default PhotoFilters;
