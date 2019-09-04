import * as React from 'react';
import {shallow} from 'enzyme';
import AllChoicesList, {AllChoicesListProps} from './AllChoicesList';
import allChoices from '../../data/allChoicesList.json';

const props: AllChoicesListProps = {
  list: allChoices,
  checked: [],
  onToggle: () => {}
};

describe('<AllChoicesList />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<AllChoicesList {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
