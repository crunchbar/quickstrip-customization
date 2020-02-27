import * as React from 'react';
import {
  Chip,
  Button,
  FormControlLabel,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Switch,
  Typography,
} from '@material-ui/core';
import ScaleText from 'react-scale-text';
import {ListItemInterface} from '../../interfaces';
import SearchBar from '../SearchBar/SearchBar';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
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
  isDropDisabled?: boolean;
  isInMorePanel: (id: string) => boolean;
  isInQuickstripList: (id: string) => boolean;
  isInHoldingBox: (id: string) => boolean;
}

const AllChoicesList: React.FC<AllChoicesListProps> = ({
  list,
  checked,
  onToggle,
  isDropDisabled = false,
  isInMorePanel,
  isInQuickstripList,
  isInHoldingBox,
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState(ASCENDING);
  const [sortedList, setSortedList] = React.useState<ListItemInterface[]>([]);
  const [filteredList, setFilteredList] = React.useState<ListItemInterface[]>([]);
  const [hideSelected, setHideSelected] = React.useState(false)
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
    <Paper id={ALL_CHOICES_ID} tabIndex={0} className={`all-choices-container vertical-space-1 border${hideSelected ? ' hideSelected' : ''}`}>
      <Droppable droppableId={ALL_CHOICES_ID} isDropDisabled={isDropDisabled}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef}>
            <Grid container>
              <Grid item xs className={classes.mobileOrder}>
                <SearchBar
                  id={ALL_CHOICES_SEARCH_FIELD_ID}
                  className="pad-1"
                  inputClassName={commonClassName}
                  label="Filter"
                  placeholder="Search for Buttons"
                  value={searchValue}
                  onChange={setSearchValue} />
              </Grid>
              <Grid item xs={12} sm={12} md>
                <Typography align="center" variant="h5" component="h1" className="pad-1">
                  Morphic Button Catalog
                </Typography>
              </Grid>
              <Grid item xs className={classes.mobileOrder}>
                <div className="all-choices-sort-button-container">
                  <FormControlLabel
                    value="start"
                    control={
                      <Switch
                        checked={hideSelected}
                        onChange={e => setHideSelected(e.target.checked)}
                        color="primary"
                        inputProps={{
                          'aria-label': 'Hide selected buttons primary checkbox',
                          className: `${commonClassName} switch-input`,
                        }}
                      />
                    }
                    label="Hide selected buttons"
                    labelPlacement="start"
                  />
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
              {filteredList.map(({description, label, learnMoreLink, id}) => {
                const isChecked = checked.indexOf(id) !== -1;
                if (isChecked && hideSelected) {
                  return <React.Fragment key={id} />;
                }
                const handleClick = (e: any) => {
                  const t: any = e.nativeEvent!.target.parentElement.parentElement;
                  if (!isChecked) {
                    const buttonLikeEl = t.querySelector('.button-like');
                    buttonLikeEl.classList.add('flyUp');
                    setTimeout(() => {
                      buttonLikeEl.classList.remove('flyUp');
                      if (hideSelected) {
                        onToggle(id);
                      }
                    }, hideSelected ? 200 : 750);
                  } else {
                    return;
                  }
                  if (!hideSelected) {
                    onToggle(id);
                  }
                  if (hideSelected && t.nextSibling) {
                    t.nextSibling.focus();
                  }
                };
                return (
                  <ListItem
                    className={commonClassName}
                    key={id}
                    role={undefined}
                    dense
                    tabIndex={0}
                    onKeyPress={e => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        handleClick(e);
                      }
                    }}
                  >
                    <ListItemIcon>
                      {isChecked ? <div className="add-spacer" /> : (
                        <Button
                          className="add-button"
                          onClick={handleClick}
                          startIcon={<ArrowUpwardIcon />}
                          variant="outlined"
                          size="small"
                        >
                          Add to My Choices
                        </Button>
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <div className="all-choices-list-item">
                          <div
                            className="button-like"
                            onClick={handleClick}
                            style={{cursor: isChecked ? 'auto': 'pointer'}}
                          >
                            <ScaleText maxFontSize={16}>{label}</ScaleText>
                          </div>
                          <div className="secondary-text">
                            {isInHoldingBox(id) && <Chip label="In My Choices" className="my-choices-chip" size="small" />}
                            {isInQuickstripList(id) && <Chip label="In QuickStrip" className="quickstrip-chip" size="small" />}
                            {isInMorePanel(id) && <Chip label="In More Panel" className="more-panel-chip" size="small" />}
                            <div dangerouslySetInnerHTML={{__html: description}} />
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
                );
              })}
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
