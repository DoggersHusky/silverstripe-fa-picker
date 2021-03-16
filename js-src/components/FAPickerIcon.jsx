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
        if (typeof this.props.onChange === 'function') {
            this.props.onChange({
              value: icon,
            });
        }
    }
    

    render() {
        const {iconValue, className, tooltip} = this.props;

        return (
            <div class="fapicker-icons__holder__fullicon">
                <div className={classNames(className, "fapicker-icons__holder__icon")} title={tooltip} onClick={() => this.handleClick(iconValue.fullName)}>
                    <i class={iconValue.fullName}></i>
                </div>
                <div>
                    {iconValue.shortName}
                </div>
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