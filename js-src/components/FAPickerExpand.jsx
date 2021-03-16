import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip';

class FAPickerExpand extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (typeof this.props.toggleIconHolder === 'function') {
            this.props.toggleIconHolder();
        }
    }
    

    render() {
        const {currentValue} = this.props;
        let icon = currentValue !== "hide" ? "fas fa-angle-double-up" : "fas fa-angle-double-down";

        return (
            <span class="expand-button" onClick={() => this.handleClick()} data-tip="Expand or collapse this field."><ReactTooltip /><i class={icon}></i></span>
        )

        
    }
}

FAPickerExpand.defaultProps = {
  imageUrl: '',
  width: 0,
  height: 0,
  tooltip: '',
  onChange: null
};


export default FAPickerExpand;