import * as React from 'react';
import {shallow} from 'enzyme';
import QuickstripItem, {QuickstripItemProps} from './QuickstripItem';

const props: QuickstripItemProps = {
  item: {
    description: '',
    label: '',
    id: '',
  },
  index: 1,
};

describe('<QuickstripItem />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<QuickstripItem {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
