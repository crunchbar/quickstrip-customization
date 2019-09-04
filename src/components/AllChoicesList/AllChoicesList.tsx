import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import ScaleText from 'react-scale-text';
import Typography from '@material-ui/core/Typography';
import {ListItemInterface} from '../../interfaces';
import SearchBar from '../SearchBar/SearchBar';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import {
  ALL_CHOICES_ID,
  ALL_CHOICES_ITEM_CLASS,
  ALL_CHOICES_SEARCH_FIELD_ID,
  ASCENDING,
  COMMON_ITEM_CLASS,
  DESCENDING,
} from '../../constants/constants';
import {filterListByValue, orderByAscLabel, orderByDescLabel} from '../../utils/utils';
import {Droppable} from 'react-beautiful-dnd';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
  mobileOrder: {
    [theme.breakpoints.down('sm')]: {
      order: 1,
    },
  },
}));

export interface AllChoicesListProps {
  list: ListItemInterface[];
  checked: string[];
  onToggle: (id: string) => void;
}

const AllChoicesList: React.FC<AllChoicesListProps> = ({
  list,
  checked,
  onToggle,
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState(ASCENDING);
  const [sortedList, setSortedList] = React.useState<ListItemInterface[]>([]);
  const [filteredList, setFilteredList] = React.useState<ListItemInterface[]>([]);
  const classes = useStyles();
  React.useEffect(() => {
    const orderFunction = sortOrder === ASCENDING
      ? orderByAscLabel
      : orderByDescLabel;
    setSortedList(orderFunction(list));
  }, [list, sortOrder]);
  React.useEffect(() => {
    setFilteredList(filterListByValue(sortedList, searchValue))
  }, [searchValue, sortedList]);
  const commonClassName = `${COMMON_ITEM_CLASS} ${ALL_CHOICES_ITEM_CLASS}`;
  const toggleSortOrder = () => setSortOrder(
    prevState => prevState === ASCENDING ? DESCENDING : ASCENDING);
  return (
    <Paper id={ALL_CHOICES_ID} tabIndex={0} className="all-choices-container vertical-space-1">
      <Droppable droppableId={ALL_CHOICES_ID}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef}>
            <Grid container>
              <Grid item xs className={classes.mobileOrder}>
                <SearchBar
                  id={ALL_CHOICES_SEARCH_FIELD_ID}
                  className="pad-1"
                  inputClassName={commonClassName}
                  label="Filter"
                  placeholder="Search for choices"
                  value={searchValue}
                  onChange={setSearchValue} />
              </Grid>
              <Grid item xs={12} sm={12} md>
                <Typography align="center" variant="h5" component="h1" className="pad-1">
                  All Choices List
                </Typography>
              </Grid>
              <Grid item xs className={classes.mobileOrder}>
                <div className="all-choices-sort-button-container">
                  <Button
                    className={commonClassName}
                    variant="contained"
                    size="small"
                    onClick={toggleSortOrder}
                  >
                    <SortByAlphaIcon className={`${classes.leftIcon} ${classes.iconSmall}`} />
                    Sort
                  </Button>
                </div>
              </Grid>
            </Grid>
            <List className={classes.root}>
              {filteredList.map(({description, label, learnMoreLink, id}) => (
                <ListItem className={commonClassName} key={id} role={undefined} dense button onClick={() => onToggle(id)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(id) !== -1}
                      tabIndex={-1}
                      disableRipple
                      color="primary"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <div className="all-choices-list-item">
                        <div className="button-like">
                          <ScaleText maxFontSize={16}>{label}</ScaleText>
                        </div>
                        <div className="secondary-text">
                          {description}&nbsp;
                          {learnMoreLink && (
                            <Link
                              href={learnMoreLink}
                              variant="body2"
                              target="_blank"
                              rel="noopener"
                              onClick={(e: React.MouseEvent) => e.stopPropagation()}
                              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
                            >
                              Learn More
                            </Link>
                          )}
                        </div>
                      </div>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <div className={`all-choices-remove-wrapper ${snapshot.isDraggingOver ? 'show' : ''}`}>
              {snapshot.isDraggingOver && (
                <div>
                  Put back in All Choices List
                </div>
              )}
            </div>
            {searchValue && (
              <div className="all-choices-clear-filters-btn">
                <Button
                  className={commonClassName}
                  variant="outlined"
                  color="primary"
                  onClick={() => setSearchValue('')}
                >
                  Clear Search Filter
                </Button>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Paper>
  );
}

export default AllChoicesList;
