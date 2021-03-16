/* global window */
import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { schemaMerge } from 'lib/schemaFieldValues';
import { loadComponent } from 'lib/Injector';

/**
 * Shiv for inserting react UploadField into entwine forms
 */
jQuery.entwine('ss', ($) => {
  /**
   * See boot/index.js for `.react-boot` bootstrap
   */
  $('.fa-holder input.fapicker.text').entwine({
    Component: null,

    getContainer() {
      let container = this.siblings('.fa-holder')[0];
      if (!container) {
        const newContainer = $('<div class="fa-holder"></div>');
        this.before(newContainer);

        container = newContainer[0];
      }
      return container;
    },

    onunmatch() {
      this._super();
      // solves errors given by ReactDOM "no matched root found" error.
      ReactDOM.unmountComponentAtNode(this.siblings('.fa-holder')[0]);
    },

    onmatch() {
      const cmsContent = this.closest('.cms-content').attr('id');
      const context = (cmsContent)
        ? { context: cmsContent }
        : {};

      const FAPickerField = loadComponent('FAPickerField', context);
      this.setComponent(FAPickerField);

      this._super();
      this.hide();
      this.refresh();
    },

    onclick(e) {
      // we don't want the native upload dialog to show up
      e.preventDefault();
    },

    refresh() {
      const props = this.getAttributes();
      const form = $(this).closest('form');
      // This is our "polyfill" for `onAutoFill`
      const setValue = (fieldName, value) => {
        // We'll find the input by name, we shouldn't ever have the same input
        // with the same name or form state will be messed up
        //const input = $('#' + fieldName);
        const input = $('input[name="'+fieldName+'"]');

        // If there's no input field then we'll return early
        if (!input) {
          return;
        }
        // Now we can set the field value
        input.val(value);
      };

      const FAPickerField = this.getComponent();

      // TODO: rework entwine so that react has control of holder
      ReactDOM.render(
        <FAPickerField
          {...props}
          onAutofill={setValue}
          noHolder
        />,
        this.getContainer()
      );
    },

    /**
     * Find the selected node and get attributes associated to attach the data to the form
     *
     * @returns {Object}
     */
    getAttributes() {
      const state = $(this).data('state');
      const schema = $(this).data('schema');
      return schemaMerge(schema, state);
    },
  });
});