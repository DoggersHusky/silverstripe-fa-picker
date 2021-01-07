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
            <li>
                <div className={classNames(className, "focuspoint-picker")} title={tooltip} onClick={() => this.handleClick(iconValue.fullName)}>
                    <i class={iconValue.fullName}></i>
                </div>
                <div>
                    {iconValue.shortName}
                </div>
            </li>
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