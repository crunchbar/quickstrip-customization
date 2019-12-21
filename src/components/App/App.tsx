import * as React from 'react';
import {CookiesProvider} from 'react-cookie';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import blue from '@material-ui/core/colors/blue';
import {ReactComponent as Logo} from '../../assets/logo.svg';
import Container from '@material-ui/core/Container';
import DragDropContainer, {DragDropContainerProps} from '../DragDropContainer/DragDropContainer';
import settings from '../../data/settings.json';
import keyboardHandler from '../../utils/keyboardHandler';
import {settingsToAllChoicesList} from '../../utils/utils';
import Instructions from '../Instructions/Instructions';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

const App: React.FC = () => {
  React.useEffect(() => {
    document.addEventListener('keydown', keyboardHandler, true);
    return function cleanup() {
      document.removeEventListener('keydown', keyboardHandler, true);
    };
  });
  const dragDropContainerProps: DragDropContainerProps = {
    allChoicesList: settingsToAllChoicesList(settings),
  };
  return (
    <CookiesProvider>
      <ThemeProvider theme={theme}>
        <Container maxWidth={false}>
          <header className="app-header">
            <Logo />
            v1.7.0
          </header>
          <Instructions />
          <DragDropContainer {...dragDropContainerProps} />
        </Container>
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default App;
