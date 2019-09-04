import * as React from 'react';
import {shallow} from 'enzyme';
import Instructions, {InstructionsProps} from './Instructions';

const props: InstructionsProps = {};

describe('<Instructions />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Instructions {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
