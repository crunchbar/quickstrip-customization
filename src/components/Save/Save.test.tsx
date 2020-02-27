import * as React from 'react';
import {shallow} from 'enzyme';
import Save from './Save';

describe('<Save />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Save />);
    expect(wrapper).toMatchSnapshot();
  });
});
