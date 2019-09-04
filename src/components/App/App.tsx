import * as React from 'react';
import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeProvider} from '@material-ui/styles';
import blue from '@material-ui/core/colors/blue';
import {ReactComponent as Logo} from '../../assets/logo.svg';
import Container from '@material-ui/core/Container';
import DragDropContainer, {DragDropContainerProps} from '../DragDropContainer/DragDropContainer';
import settings from '../../data/settings.json';
import keyboardHandler from '../../utils/keyboardHandler';
import {downloadSiteConfig, settingsToAllChoicesList} from '../../utils/utils';
import Instructions from '../Instructions/Instructions';
import JSON5 from 'json5';
// @ts-ignore
import siteConfigString from '../../data/siteconfig.json5';

const siteConfigObj = JSON5.parse(siteConfigString);

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
    downloadSiteConfig: buttonList => downloadSiteConfig(siteConfigString, siteConfigObj, buttonList),
    userButtonList: siteConfigObj.qss.buttonList,
  };
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false}>
        <header className="app-header">
          <Logo />
          v0.21.0
        </header>
        <Instructions />
        <DragDropContainer {...dragDropContainerProps} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
