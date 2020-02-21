import React from 'react';
import {
  Button,
  Collapse,
  Divider,
  Paper,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {COMMON_ITEM_CLASS, INSTRUCTIONS_ID, INSTRUCTIONS_ITEM_CLASS} from '../../constants'

export interface InstructionsProps {}

const Instructions: React.FC<InstructionsProps> = () => {
  const [expanded, setExpanded] = React.useState(false);
  const toggleExpanded = () => setExpanded(prevState => !prevState);
  return (
    <Paper
      id={INSTRUCTIONS_ID}
      tabIndex={0}
      className="instructions-container border"
    >
      <Typography variant="h5" component="h1" className="pad-1">
        Instructions
        <Button
          onClick={toggleExpanded}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'hide' : 'show'} instructions`}
          size="small"
          className={`${INSTRUCTIONS_ITEM_CLASS} ${COMMON_ITEM_CLASS}`}
        >
          <ExpandMoreIcon className={`expand${expanded ? ' open' : ''}`} />
          (Expand for full instructions)
        </Button>
      </Typography>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Typography className="pad-1" component="div">
          <strong>How to change the buttons on the QuickStrip (and the MORE Panel)</strong>
          <ol>
            <li>Put buttons you think you want to use into My Choices
              <ul>
                <li>Add an existing button
                  <ul>
                    <li>Look through the list of buttons in the Morphic Button Catalog at the bottom of the page</li>
                    <li>For buttons you want to use, click “Add to My Choices” next to those buttons</li>
                  </ul>
                </li>
                <li>Make a new button
                  <ul>
                    <li>You can also make your own buttons by using one of the three options in the Make Your Own Button panel.</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>From My Choices, drag buttons into the QuickStrip or the More Panel.
              <ul>
                <li>The buttons in My Choices are buttons you made or pulled from the Catalog but haven’t added to the QuickStrip or More Panel
                  <ul>
                    <li>Any buttons you decide not to use you can to leave there for convenience</li>
                    <li>Or you can return them to the Morphic Button Catalog.</li>
                  </ul>
                </li>
                <li>The QuickStrip will resize automatically as you add buttons.</li>
              </ul>
            </li>
            <li>When you are done - click SAVE & EXIT button (don’t confuse this with the Save button in the QuickStrip!)
              <ul>
                <li>The next time you sign in or apply your preferences you will see your new QuickStrip.</li>
              </ul>
            </li>
          </ol>
          Accessibility Note: Everything that can be done by "drag and drop” can also be done by:
          <ul>
            <li>Using the left- and right-click buttons on the mouse/touch screen</li>
            OR
            <li>Using the keyboard only, by using arrow, tab, spacebar, and return keys.</li>
          </ul>
        </Typography>
      </Collapse>
    </Paper>
  );
};

export default Instructions;
