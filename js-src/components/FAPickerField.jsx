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
            iconList: props.data.iconList ? props.data.iconList : null,
            filteredList: props.data.iconList ? props.data.iconList.filter((icon) => {
                return !icon.iconFamily.includes('sharp') || !icon.iconStyle.includes('brands');
            }) : null,
            iconVersion: props.data.iconVersion ? props.data.iconVersion : null,
            iconTotal: props.data.iconTotal ? props.data.iconTotal : null,
            isSharpDisabled: props.data.isSharpDisabled ? props.data.isSharpDisabled : false,
            activeFilterType: "all",
            activeFilterFamily: "classic",
            searchValue: null,
            pro: props.data.pro ? props.data.pro : false,
            iconHolderDisplay: "hide",
            recentList: recentIconList,
            recentListHolderToggle: false,
        };

        this.handleChange = this.handleChange.bind(this);
        //handle clicking on a filter all, bold, etc
        this.handleFilterTypeClick = this.handleFilterTypeClick.bind(this);
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
    handleFilterTypeClick(value) {
        // update the filtered list as we want to always have a reference to the full list
        // also clear the search field
        this.setState({
            filteredList: this.filterByType(value),
            activeFilterType: value,
            searchValue: "",
            recentListHolderToggle: false,
        });
    }

    handleFilterFamilyClick(value) {
        console.log('clicked: handleFilterFamilyClick');
        console.log(value);

        // update the filtered list as we want to always have a reference to the full list
        // also clear the search field
        this.setState({
            filteredList: this.filterByFamily(value),
            activeFilterFamily: value,
            // set filter type to all
            activeFilterType: 'all',
            searchValue: "",
            recentListHolderToggle: false,
        });
    }

    /**
     * Filter down the list based on the selected type
     *
     * @param {string} value the type to filter too
     * @returns {array} of new icons filter down by type
     */
    filterByType(value) {
        let newList = "";
        // account for brands
        let activeFilterFamily = (this.state.activeFilterFamily != 'classic' && value == 'brands') ?  'classic' : this.state.activeFilterFamily;
        // account for brands
        value = (value == "all" && this.state.activeFilterType == 'brands') ? 'brands' : value;

        console.log('triggered: filterByType');
        console.log('value: ' + value);
        console.log('family: ' + activeFilterFamily);

        // set the state
        this.setState({
            activeFilterFamily: activeFilterFamily,
            activeFilterType: 'brands',
        });

        // determine if we should default back to the list
        if (activeFilterFamily == 'sharp') {
            // filter the new list to only show sharp icons and the type selected
            newList = this.state.iconList.filter((icon) => {
                if (value == "all") {
                    return icon.iconFamily.includes('sharp');
                } else {
                    return icon.iconStyle.includes(value) && icon.iconFamily.includes('sharp');
                }
            });
        } else if (activeFilterFamily == 'duotone') {
            // filter the new list to only show duotone icons and the type selected
            newList = this.state.iconList.filter((icon) => {
                if (value == "all") {
                    return icon.iconFamily.includes('duotone')
                } else {
                    return icon.iconStyle.includes(value)
                }
            });
        } else {
            //filter the new list to exclude sharp and return only classic icons
            newList = this.state.iconList.filter((icon) => {
                if (value == "all") {
                    return !icon.iconFamily.includes('sharp') || !icon.iconStyle.includes('brands')
                } else {
                    return icon.iconStyle.includes(value) && (!icon.iconFamily.includes('sharp'))
                }

            });
        }

        return newList;
    }

    filterByFamily(value) {
        let newList = "";

        // filter the new list
        newList = this.state.iconList.filter((icon) => {
            return icon.iconFamily.includes(value);
        });

        return newList;
    }

    /**
     * Search the icons for the desired icons
     *
     * @param {string} value the value to filter the icons by
     */
    searchIcons(value) {
        let newList = "";

        console.log('triggered: searchIcons');
        console.log('value: ' + value);
        console.log('family: ' + this.state.activeFilterFamily);

        //check to see if we have a value to filter by
        if (value === "") {
            //filter list by active filter
            newList = this.filterByType(this.state.activeFilterType);
        } else if (this.state.activeFilterFamily !== 'classic') {
            newList = this.filterByFamily(this.state.activeFilterFamily).filter(icon => icon.searchName.includes(value));
        } else {
            // filter the filterlist by the searchName as we don't want far,fab to be
            // determining factors
            // this is filtering by type
            newList = this.filterByType(this.state.activeFilterType).filter(icon => icon.searchName.includes(value));
        }

        //update the filtered list as we want to always have a reference to the full list
        this.setState({
            filteredList: newList,
            searchValue: value,
        });
    }

    /**
     * Adds disabled to the type menu item if it needs to be disbaled
     *
     * @param {string} value the class to check
     * @returns {string} of classes
     */
    getTypeMenuClasses(value) {
        let classes = [];

        console.log('Menu generating');

        // should this be active?
        if (this.state.activeFilterType == value) {
            classes.push('active');
        }

        // account for brands
        if (this.state.activeFilterType == 'brands' && this.state.activeFilterFamily == 'classic') {
            classes.push('active');
        }

        // should pro classes be disabled
        if (value == 'light' || value == 'duotone' || value == 'thin') {
            if (this.state.pro !== true) {
                classes.push('disabled');
            }
        }

        // should this be disable for sharp?
        if (value == 'brands' || value == 'duotone' || value == 'thin') {
            if (this.state.activeFilterFamily == 'sharp') {
                classes.push('disabled');
            }
        }

        // should this be disable for duotone?
        if (value == 'regular' || value == 'light' || value == 'thin' || value == 'brands' || value == 'solid' || value == 'all' || value == 'duotone') {
            if (this.state.activeFilterFamily == 'duotone' || this.state.activeFilterType == 'brands') {
                classes.push('disabled');
            }
        }

        return classes.join(' ');
    }

    getFamilyMenuClasses(value) {
        let classes = '';

        //should this be active?
        if (this.state.activeFilterFamily == value && this.state.activeFilterType != 'brands') {
            classes = 'active-family';
        }

        // if we have brands click, which is not a family but being treated as one, activate button
        if (this.state.activeFilterType == 'brands' && value == 'brands') {
            classes = 'active-family';
        }

        return classes;
    }

    /**
     * Toggle the icon holder
     */
    toggleIconHolder() {
        console.log('icon holder has been open with toggleIconHolder');
        let classname = (this.state.iconHolderDisplay === "hide") ? "show" : "hide";
        let families = ['classic', 'sharp', 'brands'];
        let activeIcon = this.state.value;
        let activeFamily = '';

        // if holder is being open
        if (classname == 'show' && activeIcon) {
            console.log('active icon: ' + this.state.value);

            families.forEach(element => {
                if (activeIcon.includes(element)) {
                    activeFamily = element;
                }
            });

            console.log('active family: ' + activeFamily);
        }

        if (activeFamily == 'brands') {
            this.handleFilterTypeClick(activeFamily)
        } else {
            this.handleFilterFamilyClick(activeFamily)
        }


        //set the state
        this.setState({
            iconHolderDisplay: classname,
        });
    }

    render() {
        const {value,filteredList,iconVersion,iconTotal,searchValue,iconHolderDisplay,recentList,recentListHolderToggle} = this.state;
        const {FieldGroup} = this.props;
        const newProps = {
            ...this.props,
            className: classNames('fapicker-field')
          };

        const recentIconRenderedList = recentList.map((icon) =>
            <FAPickerIcon className={this.state.value == icon ? 'active' : null} fullIconName={icon} onChange={this.handleChange}/>
        );

        //translations
        const allTranslated = ss.i18n._t('FontAwesomeIconPicker.ALL', 'All');
        const solidTranslated = ss.i18n._t('FontAwesomeIconPicker.SOLID', 'Solid');
        const regularTranslated = ss.i18n._t('FontAwesomeIconPicker.REGULAR', 'Regular');
        const lightTranslated = ss.i18n._t('FontAwesomeIconPicker.LIGHT', 'Light');
        const duotoneTranslated = ss.i18n._t('FontAwesomeIconPicker.DUOTONE', 'Duotone');
        const brandsTranslated = ss.i18n._t('FontAwesomeIconPicker.BRANDS', 'Brands');
        const thinTranslated = ss.i18n._t('FontAwesomeIconPicker.THIN', 'Thin');

        let familyToggle;
        if (!this.state.isSharpDisabled && this.state.pro) {
            familyToggle = <div className={classNames(iconHolderDisplay, 'family-select-holder')}>
                <span onClick={() => this.handleFilterFamilyClick('classic')} className={'family-select__button ' + this.getFamilyMenuClasses('classic')}>Classic</span>
                <span onClick={() => this.handleFilterFamilyClick('sharp')} className={'family-select__button ' + this.getFamilyMenuClasses('sharp')}>Sharp</span>
                {/* the below is actually a type, but because fontawesome treats it as a family, we moved it to the family bar */}
                <span onClick={() => this.handleFilterTypeClick('brands')} className={'family-select__button ' + this.getFamilyMenuClasses('brands')}>{brandsTranslated}</span>
            </div>
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

                    {familyToggle}

                    <ul className={classNames(iconHolderDisplay, "fapicker-icons__type-selector")}>
                        <li onClick={() => this.handleFilterTypeClick('all')} class={this.getTypeMenuClasses('all')}>{allTranslated}</li>
                        <li onClick={() => this.handleFilterTypeClick('solid')} class={this.getTypeMenuClasses('solid')}>{solidTranslated}</li>
                        <li onClick={() => this.handleFilterTypeClick('regular')} class={this.getTypeMenuClasses('regular')}>{regularTranslated}</li>
                        <li onClick={() => this.handleFilterTypeClick('light')} class={this.getTypeMenuClasses('light')}>{lightTranslated}</li>
                        <li onClick={() => this.handleFilterTypeClick('thin')} class={this.getTypeMenuClasses('thin')}>{thinTranslated}</li>
                        <li onClick={() => this.handleFilterTypeClick('duotone')} class={this.getTypeMenuClasses('duotone')}>{duotoneTranslated}</li>
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
