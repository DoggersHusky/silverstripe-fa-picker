import React, {Component} from 'react';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';

class FAPickerRemove extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (typeof this.props.onChange === 'function') {
            this.props.onChange({
              value: "",
            });
        }
    }
    

    render() {
        const {currentValue} = this.props;
        let toggleShow = currentValue !== "" ? "show" : "hide";

        return (
            <span className={classNames(toggleShow, "fapicker-icons__holder--remove")} onClick={() => this.handleClick()} data-tip="Remove Icon"><i class="fas fa-minus-circle"></i><ReactTooltip /></span>
        )
    }
}

FAPickerRemove.defaultProps = {
  imageUrl: '',
  width: 0,
  height: 0,
  tooltip: '',
  onChange: null
};


export default FAPickerRemove;
