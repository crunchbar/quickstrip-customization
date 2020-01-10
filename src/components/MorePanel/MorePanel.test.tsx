import * as React from 'react';
import {shallow} from 'enzyme';
import MorePanel from './MorePanel';

describe('<MorePanel />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<MorePanel />);
    expect(wrapper).toMatchSnapshot();
  });
});
