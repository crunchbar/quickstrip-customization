import * as React from 'react';
import {shallow} from 'enzyme';
import SearchBar, {SearchBarProps} from './SearchBar';

const props: SearchBarProps = {
  label: 'label',
  placeholder: 'placeholder',
  value: '',
  onChange: () => {},
};

describe('<SearchBar />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<SearchBar {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
