import React, {Component, cloneElement} from 'react';
import classNames from 'classnames';
import { inject } from 'lib/Injector';
import PropTypes from 'prop-types';
import FAPickerIcon from '../components/FAPickerIcon.jsx';

class FAPickerField extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            value: props.value ? props.value : "",
            iconList: props.data.iconList ? props.data.iconList : null,
            filteredList: props.data.iconList ? props.data.iconList : null,
        };

        this.handleChange = this.handleChange.bind(this);
        //handle clicking on a filter all, bold, etc
        this.handleFilterClick = this.handleFilterClick.bind(this);
    }

    /**
     * when the component did mount
     */
    componentDidMount() {
        console.log('hello world');
    }

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
    handleFilterClick(value) {
        //filter the new list
        let newList = this.state.iconList.filter(icon => icon.fullName.includes(value) );
        //update the filtered list as we want to always have a reference to the full list
        this.setState({
            filteredList: newList,
        });
    }

    render() {
        const {value,filteredList} = this.state;
        const {FieldGroup} = this.props;
        const newProps = {
            ...this.props,
            className: classNames('fapicker-field')
          };
        const listItems = filteredList.map((icon) =>
            <FAPickerIcon className="fapicker-icons__holder__icon" iconValue={icon.fullName} onChange={this.handleChange}/>
        );
        return (
            <FieldGroup {...newProps}>
                <div class="fapicker-icons">
                    <div class="fapicker-icons__search-holder">
                        <span class="fapicker-icons__holder__icon"><i class={value}></i></span><input type="text" class="text" placeholder="Filter..."/>
                    </div>
            
                    <ul class="fapicker-icons__type-selector">
                        <li data-type="" class="active">All</li>
                        <li onClick={() => this.handleFilterClick('fas')}>Solid</li>
                        <li data-type="far">Regular</li>
                            <li data-type="fal">Light</li>
                            <li data-type="fad">Duotone</li>
                        <li onClick={() => this.handleFilterClick('fab')}>Brands</li>
                    </ul>
            
                    <ul class="fapicker-icons__holder">
                        {listItems}
                    </ul>
            
                    <div class="fapicker-icons__bottom">
                        <span class="small version">Version <strong>$VersionNumber</strong></span>
                        <span class="small icons"><strong>$IconAmount</strong> Icons</span>
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