import accessibleAutocomplete from 'accessible-autocomplete';

/**
 @typedef autocompleteConfig
 @type {Object}
 Option param for NHSUK functionality
 @property {string=} formId ID of form element containing autocomplete.
 Required params for accessible-autocomplete
 @property {string} inputId ID of the input field.
 @property {string} containerId ID of element in which the autocomplete will be rendered in.
 @property {function} source Function called on input change
 */

/** Class representing NHSUK autocomplete. */
export default class AutoComplete {
  /**
   * Create an autocomplete.
   * @param {autocompleteConfig} config 
  */
  constructor(config) {
    this.formId = config.formId;
    this.inputId = config.inputId;
    this.containerId = config.containerId;

    this.form = document.getElementById(this.formId);
    this.input = document.getElementById(this.inputId);
    this.container = document.getElementById(this.containerId);

    // Add autocomplete functionality if required config options exist
    if (this.input && this.container && config.source) {
      this.initAutoComplete(config);
      // If form element exists then add events to add standard form functionality
      if (this.form) this.addFormEvents();
    }
  }
  
  /**
   * Adds event to catch enter presses when the main input is focused and submits the form
  */
  addFormEvents() {
    window.addEventListener("load", () => {
      // Attach event to form as the original input element is cloned by autoComplete plugin
      this.form.addEventListener('keyup', ({ keyCode }) => {
        // Submit search using current input value if input is focused and enter is pressed
        if(keyCode === 13 && document.activeElement.id === this.input.id) this.form.submit();
      });
    });
  }

  /**
   * Initialise an using NHS default config and any additional config properties passed.
   * @param {autocompleteConfig} config 
   */
  initAutoComplete(config) {
    const defaultConfig = {
      element: this.container,
      id: this.inputId,
      minLength: 2,
      placeholder: this.input.placeholder,
      name: this.input.name,
      confirmOnBlur: false
    };;

    // Remove original search input as it will be replaced by accessibleAutocomplete
    this.input.parentNode.removeChild(this.input);

    // Initialise accessibleAutocomplete
    accessibleAutocomplete({
      ...defaultConfig,
      ...config,
    });
  }
}

