import * as React from 'react';
import {shallow} from 'enzyme';
import DragDropContainer, {DragDropContainerProps} from './DragDropContainer';

const props: DragDropContainerProps = {
  allChoicesList: [],
  downloadSiteConfig: () => {},
};

describe('<DragDropContainer />', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<DragDropContainer {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
