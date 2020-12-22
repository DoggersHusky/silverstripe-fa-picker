/* global document */
import React from 'react';
import Injector from 'lib/Injector';
import registerComponents from './registerComponents';

document.addEventListener('DOMContentLoaded', () => {
  registerComponents();
});