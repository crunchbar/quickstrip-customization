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
          <br />
          <br />
          If you just want to <strong>re-arrange or move buttons</strong> on or between the <strong>QuickStrip</strong> or <strong>More Panel</strong>
          <ul>
            <li>Simply drag the buttons to where you want them.</li>
            <li>Drag any buttons you don’t want to the <strong>My Choices</strong> box - or to the <strong>Morphic Button Catalog</strong></li>
            <li>(You can also move the buttons about completely using the keyboard. See accessibility note below.)</li>
          </ul>
          If you want to <strong>explore</strong> or <strong>add new buttons</strong> 
          <ol>
            <li>Start with the <strong>Morphic Button Catalog</strong> at the bottom of this page
              <ul>
                <li>Each button is described - including a link to learn more about the button or see a video of the button in use.</li>
                <li>Click the button on each one you want to include in your <strong>QuickStrip</strong> or <strong>More Panel</strong> -  The button will move up to the <strong>My Choices</strong> box</li>
                <li>Keep exploring til you have found and moved all of the new buttons of interest up to the My Choices Box.</li>
              </ul>
            </li>
            <li>Make your own button(s) if you like
              <ul>
                <li>You can also make your own buttons using one of the three options in the <strong>Make Your Own Button</strong> panel</li>
                <li>"<strong>Make Your Own</strong>" buttons can open applications, open web pages, or type key combinations or strings.</li>
              </ul>
            </li>
            <li>Now decide which buttons you want on your QuickStrip or More Panel.
              <ul>
                <li>You can now drag the buttons around between your <strong>QuickStrip</strong> the <strong>More Panel</strong> and the <strong>My Choices</strong> box.</li>
                <li>The QuickStrip will resize automatically as you add buttons.</li>
              </ul>
            </li>
            <li>Finally - you can change the behavior of the QuickStrip using the [put button name here]
              <ul>
                <li>You can change the size of the strip, whether it is shown or hidden when you start the computer, and more.</li>
              </ul>
            </li>
            <li>When you have things as you want them - click SAVE & EXIT button (don’t confuse this with the Save button in the QuickStrip!)
              <ul>
                <li>The next time you sign in or apply your preferences you will see your new QuickStrip.</li>
              </ul>
            </li>
          </ol>
          NOTES:
          <ul>
            <li>You can have different QuickStrips for use at different time. Just save them all using different names.</li>
            <li>You can also save different QuickStrips of different preference sets - if you have them.</li>
            <li>Anything you leave in the My Choices box will be there next time you sign in.  If you no longer want them drag them back to the Button Catalog.</li>
          </ul>
          Accessibility Note: Everything that can be done by "drag and drop” can also be done:
          <ul>
            <li>Without Drag and drop — using the left- and right-click buttons on the mouse or touch screen</li>
            OR
            <li>Using the keyboard only — by using arrow, tab, spacebar, and return keys.</li>
          </ul>
        </Typography>
      </Collapse>
    </Paper>
  );
};

export default Instructions;
