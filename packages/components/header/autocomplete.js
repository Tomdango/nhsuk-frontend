import accessibleAutocomplete from 'accessible-autocomplete';

export default class AutoComplete {
  constructor(config) {
    this.formId = config.formId;
    this.inputId = config.inputId;
    this.containerId = config.containerId;

    this.form = document.getElementById(this.formId);
    this.input = document.getElementById(this.inputId);
    this.container = document.getElementById(this.containerId);
    
    // Add autocomplete functionality if input element exists
    if (this.input) {
      this.initAutoComplete(config);
      // If form element exists then add events to add standard form functionality
      if (this.form) this.addFormEvents();
    }
  }
  
  // Enter key default is prevented for the input but autoComplete plugin so 
  // add that functionality back in to offer expected behaviour
  addFormEvents() {
    window.addEventListener("load", () => {
      // Attach event to form as the original input element is cloned by autoComplete plugin
      this.form.addEventListener('keyup', ({ keyCode }) => {
        // Submit search using current input value if input is focused and enter is pressed
        if(keyCode === 13 && document.activeElement.id === this.input.id) this.form.submit();
      });
    });
  }

  initAutoComplete(config) {
    // Default config which will be overwritten by any passed config
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

    // Initialise the accessibleAutocomplete with merged config
    accessibleAutocomplete({
      ...defaultConfig,
      ...config,
    });
  }
}

