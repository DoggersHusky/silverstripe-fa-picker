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
        const {iconValue, className, tooltip, fullIconName} = this.props;
        let listItems = "";
        let iconFullName = "";
        let iconShortName = "";

        //if we have an iconvale property render this
        if (iconValue) {
            iconFullName = iconValue.fullName.toLowerCase();
            iconShortName = iconValue.shortName;

            console.log(iconValue.types);

            listItems = iconValue.types.map((icon) =>
                <div class="fapicker-icons__holder__fullicon">
                    <div className={classNames(className, "fapicker-icons__holder__icon")} title={tooltip} onClick={() => this.handleClick(iconFullName)}>
                        <i className={'fa-' + icon.style  + ' ' + iconFullName}></i>
                    </div>
                    <div>
                        {iconShortName}
                    </div>
                </div>  
            );

            return (
                <div className='icon-set'>{listItems}</div>
            );
        }else{
            return (
                <div class="fapicker-icons__holder__fullicon">
                    <div className={classNames(className, "fapicker-icons__holder__icon")} title={tooltip} onClick={() => this.handleClick(fullIconName)}>
                        <i class={fullIconName}></i>
                    </div>
                </div>
            )
        }
        
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
