import * as React from 'react';
import {shallow} from 'enzyme';
import HoldingBox, {HoldingBoxProps} from './HoldingBox';

const props: HoldingBoxProps = {
  holdingBoxChunks: [],
  handleMenuOpen: () => {},
};

describe('<HoldingBoxDND />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<HoldingBox {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
