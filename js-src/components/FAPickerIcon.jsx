import React, {Component} from 'react';
import classNames from 'classnames';

class FocusPointPicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(icon) {
        console.log(icon);
        if (typeof this.props.onChange === 'function') {
            this.props.onChange({
              value: icon,
            });
        }
    }
    

    render() {
        const {iconValue, className, tooltip} = this.props;

        return (
            <div className={classNames(className, "focuspoint-picker")} title={tooltip} onClick={() => this.handleClick(iconValue)}>
                <i class={iconValue}></i>
            </div>
        )
    }
}

FocusPointPicker.defaultProps = {
  imageUrl: '',
  width: 0,
  height: 0,
  tooltip: '',
  onChange: null
};


export default FocusPointPicker;