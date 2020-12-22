import Injector from 'lib/Injector';
import FAPickerField from '../components/FAPickerField.js';

const registerComponents = () => {
  Injector.component.register('FAPickerField', FAPickerField);
};

export default registerComponents;
