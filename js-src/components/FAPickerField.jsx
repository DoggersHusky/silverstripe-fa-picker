import React, {Component, cloneElement} from 'react';
import classNames from 'classnames';
import { inject } from 'lib/Injector';
import PropTypes from 'prop-types';
import FAPickerIcon from '../components/FAPickerIcon.jsx';
import PaginationList from 'react-pagination-list';
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
            filteredList: props.data.iconList ? props.data.iconList : null,
            iconVersion: props.data.iconVersion ? props.data.iconVersion : null,
            iconTotal: props.data.iconTotal ? props.data.iconTotal : null,
            activeFilterType: "all",
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

    /**
     * filter down the list based on the selected type
     */
    filterByType(value) {
        let newList = "";

        //determine if we should default back to the list
        if (value == "all") {
            newList = this.state.iconList;
        }else{
            //filter the new list
            newList = this.state.iconList.filter(icon => icon.type.includes(value) );
        }

        return newList;
    }

    searchIcons(value) {
        let newList = "";

        //check to see if we have a value to filter by
        if (value === "") {
            //filter list by active filter
            newList = this.filterByType(this.state.activeFilterType);

        }else{
            // filter the filterlist by the shortname as we don't want far,fab to be 
            // determining factors
            newList = this.filterByType(this.state.activeFilterType).filter(icon => icon.shortName.includes(value) );
        }
        
        //update the filtered list as we want to always have a reference to the full list
        this.setState({
            filteredList: newList,
            searchValue: value,
        });
    }

    getTypeMenuClasses(value) {
        let classes = [];

        //should this be active?
        if (this.state.activeFilterType == value) {
            classes.push('active');
        }

        //should pro classes be disabled
        if (value == 'fal' || value == 'fad') {
            if (this.state.pro !== true) {
                classes.push('disabled');
            }
        }

        return classes.join(' ');
    }

    toggleIconHolder() {
        let classname = (this.state.iconHolderDisplay === "hide") ? "show" : "hide";
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
        const listItems = filteredList.map((icon) =>
            <FAPickerIcon className={this.state.value == icon.fullName ? 'active' : null} iconValue={icon} onChange={this.handleChange}/>
        );
        const recentIconRenderedList = recentList.map((icon) =>
            <FAPickerIcon className={this.state.value == icon ? 'active' : null} fullIconName={icon} onChange={this.handleChange}/>
        );
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
            
                    <ul className={classNames(iconHolderDisplay, "fapicker-icons__type-selector")}>
                        <li onClick={() => this.handleFilterTypeClick('all')} class={this.getTypeMenuClasses('all')}>All</li>
                        <li onClick={() => this.handleFilterTypeClick('fas')} class={this.getTypeMenuClasses('fas')}>Solid</li>
                        <li onClick={() => this.handleFilterTypeClick('far')} class={this.getTypeMenuClasses('far')}>Regular</li>
                        <li onClick={() => this.handleFilterTypeClick('fal')} class={this.getTypeMenuClasses('fal')}>Light</li>
                        <li onClick={() => this.handleFilterTypeClick('fad')} class={this.getTypeMenuClasses('fad')}>Duotone</li>
                        <li onClick={() => this.handleFilterTypeClick('fab')} class={this.getTypeMenuClasses('fab')}>Brands</li>
                    </ul>
            
                    <div className={classNames(iconHolderDisplay, "fapicker-icons__holder")}>
                        <PaginationList 
                            data={filteredList}
                            pageSize={100}
                            renderItem={(icon, key) => (
                                <FAPickerIcon className={this.state.value == icon.fullName ? 'active' : null} iconValue={icon} onChange={this.handleChange}/>
                            )}
                        />
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