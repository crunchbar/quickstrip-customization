import * as React from 'react';
import {shallow} from 'enzyme';
import Quickstrip, {QuickstripProps} from './Quickstrip';

const props: QuickstripProps = {
  quickstripList: [],
  handleMenuOpen: () => {},
};

describe('<Quickstrip />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Quickstrip {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
