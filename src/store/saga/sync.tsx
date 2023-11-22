import debounce from 'lodash/debounce';
import { select, takeLatest } from 'redux-saga/effects';
import { Resume } from '../../schema';

import { AppDispatch, RootState } from '~/store/index';
import { addItem, setResume, setResumeState } from '../resume/resumeSlice';

const DEBOUNCE_WAIT = 1000;
// const debouncedSync = debounce(
//   (resume: Resume, dispatch: AppDispatch) => addRecord(resume).then((resume) => dispatch(setResume(resume))),
//   DEBOUNCE_WAIT,
// );

function* handleSync(dispatch: AppDispatch) {
  const resume: Resume = yield select((state: RootState) => state.resume.present);
  //debouncedSync(resume, dispatch);
}

function* syncSaga(dispatch: AppDispatch) {
    yield takeLatest([setResumeState], () =>
      handleSync(dispatch),
    );
  }

  export default syncSaga;
