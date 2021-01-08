import React, {Component, cloneElement} from 'react';
import classNames from 'classnames';
import { inject } from 'lib/Injector';
import PropTypes from 'prop-types';
import FAPickerIcon from '../components/FAPickerIcon.jsx';
import PaginationList from 'react-pagination-list';

class FAPickerField extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            value: props.value ? props.value : "",
            iconList: props.data.iconList ? props.data.iconList : null,
            filteredList: props.data.iconList ? props.data.iconList : null,
            iconVersion: props.data.iconVersion ? props.data.iconVersion : null,
            iconTotal: props.data.iconTotal ? props.data.iconTotal : null,
            activeFilterType: "all",
            searchValue: null,
        };

        this.handleChange = this.handleChange.bind(this);
        //handle clicking on a filter all, bold, etc
        this.handleFilterTypeClick = this.handleFilterTypeClick.bind(this);
        //handle search icons
        this.searchIcons = this.searchIcons.bind(this);
    }

    /**
     * when the component did mount
     */
    componentDidMount() {
        console.log('hello world');
    }

    /**
     * handle when a new icon is selected
     * the icon click event passes to this handler
     */
    handleChange({value}) {
        const { onAutofill, name } = this.props;
        this.setState({
            value: value,
        });

        const newValue = value;

        if (typeof onAutofill === 'function') {
            onAutofill(`${name}`, newValue);
        }
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

    render() {
        const {value,filteredList,iconVersion,iconTotal,searchValue} = this.state;
        const {FieldGroup} = this.props;
        const newProps = {
            ...this.props,
            className: classNames('fapicker-field')
          };
        const listItems = filteredList.map((icon) =>
            <FAPickerIcon className={this.state.value == icon.fullName ? 'active' : null} iconValue={icon} onChange={this.handleChange}/>
        );
        return (
            <FieldGroup {...newProps}>
                <div class="fapicker-icons">
                    <div class="fapicker-icons__search-holder">
                        <span class="fapicker-icons__holder__icon"><i class={value}></i></span><input type="text" value={searchValue} class="text" placeholder="Filter..." onChange={(e) => this.searchIcons(e.target.value)}/>
                    </div>
            
                    <ul class="fapicker-icons__type-selector">
                        <li onClick={() => this.handleFilterTypeClick('all')} class={this.state.activeFilterType == 'all' ? 'active': null}>All</li>
                        <li onClick={() => this.handleFilterTypeClick('fas')} class={this.state.activeFilterType == 'fas' ? 'active': null}>Solid</li>
                        <li onClick={() => this.handleFilterTypeClick('far')} class={this.state.activeFilterType == 'far' ? 'active': null}>Regular</li>
                        <li onClick={() => this.handleFilterTypeClick('fal')} class={this.state.activeFilterType == 'fal' ? 'active': null}>Light</li>
                        <li onClick={() => this.handleFilterTypeClick('fad')} class={this.state.activeFilterType == 'fad' ? 'active': null}>Duotone</li>
                        <li onClick={() => this.handleFilterTypeClick('fab')} class={this.state.activeFilterType == 'fab' ? 'active': null}>Brands</li>
                    </ul>
            
                    <div class="fapicker-icons__holder">
                        <PaginationList 
                            data={filteredList}
                            pageSize={100}
                            renderItem={(icon, key) => (
                                <FAPickerIcon className={this.state.value == icon.fullName ? 'active' : null} iconValue={icon} onChange={this.handleChange}/>
                            )}
                        />
                    </div>
            
                    <div class="fapicker-icons__bottom">
                        <span class="small version">Version <strong>{iconVersion}</strong></span>
                        <span class="small icons"><strong>{iconTotal}</strong> Icons</span>
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