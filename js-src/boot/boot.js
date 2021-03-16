/* global document */
import React from 'react';
import Injector from 'lib/Injector';
import registerComponents from './registerComponents';
//allow this to work on non-react environments
import entwineFAPickerField from './FAPickerFieldEntwine';

document.addEventListener('DOMContentLoaded', () => {
  registerComponents();
});