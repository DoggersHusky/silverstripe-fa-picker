import React, {Component, cloneElement} from 'react';
import classNames from 'classnames';
import { inject } from 'lib/Injector';
import PropTypes from 'prop-types';

class FAPickerField extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
        };
        //this.handleFocusChange = this.handleFocusChange.bind(this);

        console.log(props);
    }

    render() {
    
        return (
          <div>test</div>
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
    readOnly: PropTypes.bool
};

export default FAPickerField;