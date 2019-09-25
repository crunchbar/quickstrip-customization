import * as React from 'react';
import {shallow} from 'enzyme';
import Spacers from './Spacers';

describe('<Spacers />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Spacers />);
    expect(wrapper).toMatchSnapshot();
  });
});
