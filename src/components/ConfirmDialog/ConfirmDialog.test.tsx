import * as React from 'react';
import {shallow} from 'enzyme';
import ConfirmDialog, {ConfirmDialogProps} from './ConfirmDialog';

const props: ConfirmDialogProps = {
  open: true,
  onClose: () => {},
  onSubmit: () => {},
  description: 'description',
};

describe('<ConfirmDialog />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<ConfirmDialog {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
