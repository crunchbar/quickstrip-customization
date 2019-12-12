import React from 'react';
import {
  Collapse,
  Divider,
  IconButton,
  Paper,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export interface InstructionsProps {}

const Instructions: React.FC<InstructionsProps> = () => {
  const [expanded, setExpanded] = React.useState(false);
  const toggleExpanded = () => setExpanded(prevState => !prevState);
  return (
    <Paper className="instructions-container border">
      <Typography variant="h5" component="h1" className="pad-1">
        Instructions
        <IconButton
          className={`expand${expanded ? ' open' : ''}`}
          onClick={toggleExpanded}
          aria-expanded={expanded}
          aria-label="show instructions"
          size="small"
        >
          <ExpandMoreIcon />
        </IconButton>
        <small>(Expand for full instructions)</small>
      </Typography>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Typography className="pad-1" component="div">
          You can change all of the function buttons on the QuickStrip (and the MORE Panel) as you prefer.
          <ol>
            <li>Look through the list of features in the "All Choices List” at the bottom of the page - and check all that you might be interested in.
              <ul>
                <li>When you check items in the "All Choices List" they will show up within "My Choices" so they are handy for exploring and putting into your QuickStrip or More Panel.</li>
                <li>(There is an option on the “all Choices list” at the top that hides all those buttons you already have above - so that only new ones you don’t already have will appear in the “All Choices list”.)</li>
              </ul>
            </li>
            <li>You can then drag buttons back and forth between My Choices and the QuickStrip (or the MORE Panel) till you get what you want there.
              <ul>
                <li>The QuickStrip will automatically make room and resize for any number of buttons you want to add.</li>
                <li>The items you have in your “My Choices” list will stay there if you want to leave some there for convenience if you do not want them in your QuickStrip or MORE panel right now.  Or you can return them to the “All Choices List”.</li>
              </ul>
            </li>
            <li>The strip will resize automatically if you need it to to accommodate a large number of buttons.   Or you can resize the QuickStrip yourself using the + and - buttons.</li>
            <li>When you are done - click SAVE.
              <ul>
                <li>The next time you sign in or apply your preferences you will see your new QuickStrip.  If you want to see it right now - click on the “My Saved Settings” button and reapply your settings now.</li>
              </ul>
            </li>
          </ol>
          Accessibility Note: Everything that can be done by "drag and drop” can also be done by 1) using the left- and right-click buttons on the mouse/touch screen,  OR  2) by using the keyboard only, by using arrow key, tab, spacebar and return keys.
        </Typography>
      </Collapse>
    </Paper>
  );
};

export default Instructions;
