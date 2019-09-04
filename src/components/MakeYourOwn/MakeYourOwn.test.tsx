import * as React from 'react';
import {shallow} from 'enzyme';
import MakeYourOwn, {MakeYourOwnProps} from './MakeYourOwn';

const props: MakeYourOwnProps = {
};

describe('<MakeYourOwn />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<MakeYourOwn {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
