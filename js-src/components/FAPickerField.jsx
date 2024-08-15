import React, {Component, cloneElement} from 'react';
import classNames from 'classnames';
import { inject } from 'lib/Injector';
import PropTypes from 'prop-types';
import FAPickerIcon from '../components/FAPickerIcon.jsx';
import { PaginatedList } from 'react-paginated-list';
import FAPickerRemove from '../components/FAPickerRemove.jsx';
import FAPickerExpand from '../components/FAPickerExpand.jsx';
import ReactTooltip from 'react-tooltip';

class FAPickerField extends Component {

    constructor(props) {
        super(props);

        //for recent list
        let recentIconList;

        //create or get the array for favorites
        if (localStorage.getItem("ss-fa-picker-recent") === null) {
            recentIconList = [];
        }else{
            recentIconList = JSON.parse(localStorage.getItem("ss-fa-picker-recent"));
        }

        this.state = {
            value: props.value ? props.value : "",
            iconList: fullIconList ? fullIconList : null,
            filteredList: fullIconList ? fullIconList.filter((icon) => {
                return icon.iconFamily === 'classic' && icon.iconStyle !== 'brands';
            }) : null,
            iconVersion: iconVersion ? iconVersion : null,
            iconTotal: iconAmount ? iconAmount : null,
            isSharpDisabled: props.data.isSharpDisabled ? props.data.isSharpDisabled : false,
            activeFilterStyle: "all",
            activeFilterFamily: "classic",
            searchValue: null,
            pro: props.data.pro ? props.data.pro : false,
            iconHolderDisplay: "hide",
            recentList: recentIconList,
            recentListHolderToggle: false,
            taskLink: props.data.taskLink ? props.data.taskLink : false,
            buttons: FAButtons ? FAButtons : null,
        };

        this.handleChange = this.handleChange.bind(this);
        //handle clicking on a filter all, bold, etc
        this.handleFilterStyleClick = this.handleFilterStyleClick.bind(this);
        //handle search icons
        this.searchIcons = this.searchIcons.bind(this);
        //handle toggling icon holder
        this.toggleIconHolder = this.toggleIconHolder.bind(this);
        //handle clicking on recent icon list button
        this.handleClickRecentList = this.handleClickRecentList.bind(this);
        // handle clicking on the family type
        this.handleFilterFamilyClick = this.handleFilterFamilyClick.bind(this);
    }

    /**
     * handle when a new icon is selected
     * the icon click event passes to this handler
     */
    handleChange({value}) {
        const { onAutofill, name } = this.props;
        let {recentList} = this.state;
        let recentIndex = -1;

        //if item clicked is not in the array add
        //to the begin of array.
        recentIndex = recentList.indexOf(value);
        if (recentIndex == -1 && value !== "") {
            //add new item to the start of the recent array
            recentList.unshift(value);

            //if there is more than 12 items in the recent array
            //delete the last one
            if (recentList.length >= 25) {
                recentList.splice(24, 1);
            }

            //set the local storage
            localStorage.setItem("ss-fa-picker-recent", JSON.stringify(recentList));
        }

        //update the state
        this.setState({
            value: value,
            recentList: recentList,
            recentListHolderToggle: false,
        });

        const newValue = value;

        if (typeof onAutofill === 'function') {
            onAutofill(`${name}`, newValue);
        }
    }

    /**
     * handles what happens when the recent list
     * button is clicked
     */
    handleClickRecentList() {
        const {recentListHolderToggle} = this.state;
        let recentIconList;

        //create or get the array for favorites
        if (localStorage.getItem("ss-fa-picker-recent") === null) {
            recentIconList = [];
        }else{
            recentIconList = JSON.parse(localStorage.getItem("ss-fa-picker-recent"));
        }

        //update the state
        this.setState({
            recentList: recentIconList,
            recentListHolderToggle: recentListHolderToggle == false ? true : false,
        });
    }

    /**
     * handles filtering down the list
     * when all, bold, etc is clicked
     */
    handleFilterStyleClick(value) {
        this.setState({
            filteredList: [],
        },
        () => {
            // update the filtered list as we want to always have a reference to the full list
            // also clear the search field
            this.setState({
                filteredList: this.filterByStyle(value),
                activeFilterStyle: value,
                searchValue: "",
                recentListHolderToggle: false,
            })
        });
    }

    handleFilterFamilyClick(value) {
        // determine if all should be clicked when family is switched
        const newActiveFilterStyle = this.state.buttons[value].length > 1 ? 'all' : this.state.buttons[value][0];

        this.setState({
            filteredList: [],
        },
        () => {
            // update the filtered list as we want to always have a reference to the full list
            // also clear the search field
            this.setState({
                filteredList: this.filterByFamily(value),
                activeFilterFamily: value,
                // set filter type to all
                activeFilterStyle: newActiveFilterStyle,
                searchValue: "",
                recentListHolderToggle: false,
            });
        });
    }

    /**
     * Filter down the list based on the selected style
     *
     * @param {string} value the type to filter too
     * @returns {array} of new icons filter down by type
     */
    filterByStyle(value) {
        let newList = "";

        newList = this.state.iconList.filter((icon) => {
            if (value == "all") {
                return icon.iconFamily === this.state.activeFilterFamily && icon.iconStyle !== 'brands';
            } else {
                return icon.iconStyle.includes(value) && icon.iconFamily === this.state.activeFilterFamily;
            }
        });

        return newList;
    }

    /**
     * get the icon list filtered by family
     * @param {string} value
     * @returns array
     */
    filterByFamily(value) {
        let newList = "";

        // filter the new list
        newList = this.state.iconList.filter((icon) => {
            return icon.iconFamily === value && icon.iconStyle !== 'brands';
        });

        return newList;
    }

    /**
     * Search the icons for the desired icons
     * @param {string} value the value to filter the icons by
     */
    searchIcons(value) {
        let newList = "";

        //check to see if we have a value to filter by
        if (value === "") {
            //filter list by active filter
            newList = this.filterByStyle(this.state.activeFilterStyle);
        } else if (this.state.activeFilterFamily !== 'classic') {
            newList = this.filterByFamily(this.state.activeFilterFamily).filter(icon => icon.searchName.includes(value));
        } else {
            // filter the filterlist by the searchName as we don't want far,fab to be
            // determining factors
            // this is filtering by type
            newList = this.filterByStyle(this.state.activeFilterStyle).filter(icon => icon.searchName.includes(value));
        }

        // update the filtered list as we want to always have a reference to the full list
        this.setState({
            filteredList: newList,
            searchValue: value,
        });
    }

    /**
     * Adds disabled to the style menu item if it needs to be disbaled
     * @param {string} value the styles menu item clicked
     * @returns {string} of classes
     */
    getStyleMenuClasses(value) {
        const {buttons, activeFilterFamily, activeFilterStyle} = this.state;
        let classes = [];

        // if brands disable all
        if (activeFilterStyle === 'brands' && value !== 'brands') {
            return 'disabled';
        }

        // disable if not in list and list length is less than or equal to 1
        if (buttons[activeFilterFamily].length > 1 && value === 'all') {
        } else {
            if (!buttons[activeFilterFamily].includes(value.toLowerCase()) && value !== 'brands') {
                classes.push('disabled');
            }
        }

        // if style filter is active, set as active
        if (activeFilterStyle == value) {
            classes.push('active');
        }

        // if all is active
        if (activeFilterStyle === 'all' && value === 'all') {
            classes.push('active');
        }

        return classes.join(' ');
    }

    /**
     * Get the Family menu classes
     * @param {string} value the family menu item clicked
     * @returns string
     */
    getFamilyMenuClasses(value) {
        const {activeFilterFamily, isSharpDisabled, activeFilterStyle} = this.state;
        let classes = '';

        // if brands unclick all families
        if (activeFilterStyle === 'brands') {
            return classes;
        }

        //should this be active?
        if (activeFilterFamily == value) {
            classes = 'active-family';
        }

        // disbale sharp if user disabled it
        if (isSharpDisabled && value.includes('sharp')) {
            classes = 'disabled';
        }

        return classes;
    }

    /**
     * Toggle the icon holder
     */
    toggleIconHolder() {
        let classname = (this.state.iconHolderDisplay === "hide") ? "show" : "hide";
        let families = ['brands'];
        let activeIcon = this.state.value;
        let activeFamily = null;

        // get the families
        Object.keys(this.state.buttons).map((family, index) => {
            families.push(family);
        });

        // if holder is being open
        if (classname == 'show' && activeIcon) {
            families.forEach(element => {
                if (activeIcon.includes(element)) {
                    activeFamily = element;
                }
            });
        }

        // if we have an active family already atempt to switch tabs
        if (activeFamily) {
            if (activeFamily === 'brands') {
                this.handleFilterStyleClick(activeFamily);
            } else {
                this.handleFilterFamilyClick(activeFamily);
            }
        }

        //set the state
        this.setState({
            iconHolderDisplay: classname,
        });
    }

    render() {
        const {value,filteredList,iconVersion,iconTotal,searchValue,iconHolderDisplay,recentList,recentListHolderToggle,taskLink,buttons} = this.state;
        const {FieldGroup} = this.props;
        const newProps = {
            ...this.props,
            className: classNames('fapicker-field')
          };
        let brandsFound = false;

        const recentIconRenderedList = recentList.map((icon) =>
            <FAPickerIcon className={this.state.value == icon ? 'active' : null} fullIconName={icon} onChange={this.handleChange}/>
        );

        // translations
        const allTranslated = ss.i18n._t('FontAwesomeIconPicker.ALL', 'All');

        // handle creating the family buttons
        const familyToggle = Object.keys(buttons).map((button, index) =>
            <span onClick={() => this.handleFilterFamilyClick(button)} className={'family-select__button ' + this.getFamilyMenuClasses(button)}>{button.replace('-', ' ')}</span>
        );

        const styleToggle = buttons.classic.map((style) =>
            <li onClick={() => this.handleFilterStyleClick(style)} class={this.getStyleMenuClasses(style)}>{style.replace('-', ' ')}</li>
        ).filter((button) => {
            // if we find brands, note it and remove from this bar
            if (button.props.children === 'brands') {
                brandsFound = true;

                return false;
            }

            return true;
        });

        let noIconWarning;
        if (filteredList.length == 0 && (!iconVersion || !iconTotal)) {
            noIconWarning = <p className='alert alert-warning'>
                <span>Please run the following <a href={taskLink} target="_blank">task</a> to generate the data for the field.</span>
            </p>;
        }

        // move brands button, if found, to the top bar
        let brandsButton = '';
        if (brandsFound) {
            brandsButton = <span onClick={() => this.handleFilterStyleClick('brands')} className={'family-select__button ' + this.getStyleMenuClasses('brands')}>Brands</span>;
        }

        return (
            <FieldGroup {...newProps}>
                <ReactTooltip />
                <div className={classNames(iconHolderDisplay == "hide" ? "" : "expand", "fapicker-icons")}>
                    <div class="fapicker-icons__search-holder">
                        <span class="fapicker-icons__holder__icon">
                            <FAPickerRemove currentValue={value} onChange={this.handleChange} />
                            <i class={value} data-tip={value}></i>
                        </span>
                        <input type="text" value={searchValue} className={classNames(iconHolderDisplay, "text")} placeholder="Filter..." onChange={(e) => this.searchIcons(e.target.value)}/>
                        <span className={classNames(iconHolderDisplay, "fapicker-icons__recent-icon-button")} data-tip="Recently used icons" onClick={() => this.handleClickRecentList()}><i class="fas fa-redo"></i></span>
                        <div className={classNames(recentListHolderToggle == true ? "list-open" : "hide", iconHolderDisplay, "fapicker-icons__recent-icon-list")}>
                            {recentIconRenderedList}
                        </div>
                    </div>

                    <div className={classNames(iconHolderDisplay, 'family-select-holder')}>
                        {familyToggle}
                        {brandsButton}
                    </div>

                    <ul className={classNames(iconHolderDisplay, "fapicker-icons__type-selector")}>
                        <li onClick={() => this.handleFilterStyleClick('all')} class={this.getStyleMenuClasses('all')}>{allTranslated}</li>
                        {styleToggle}
                    </ul>

                    <div className={classNames(iconHolderDisplay, "fapicker-icons__holder")}>
                        <div>
                            <PaginatedList
                                list={filteredList}
                                itemsPerPage={100}

                                renderList={(icons, key) => (
                                    icons.map((icon, id) => {
                                        return <FAPickerIcon className={(this.state.value == icon.fullName ? 'active' : null)} iconValue={icon} onChange={this.handleChange}/>
                                    })
                                )}
                            />
                        </div>
                    </div>

                    <div class="fapicker-icons__bottom">
                        <span className={classNames(iconHolderDisplay, "small version")}>Version <strong>{iconVersion}</strong></span>
                        <span className={classNames(iconHolderDisplay, "small icons")}><strong>{iconTotal}</strong> Icons</span>
                        <FAPickerExpand toggleIconHolder={this.toggleIconHolder} currentValue={iconHolderDisplay} />
                    </div>
                </div>
                { noIconWarning }
            </FieldGroup>
        )
    }
}

FAPickerField.defaultProps = {
    extraClass: '',
    value: ''
};

FAPickerField.propTypes = {
    extraClass: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    children: PropTypes.array.isRequired,
    onAutofill: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
    readOnly: PropTypes.bool
};

//export default FAPickerField;
export { FAPickerField as Component };

export default inject(
    ['FieldGroup']
  )(FAPickerField);
