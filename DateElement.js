const currentDocument = document.currentScript.ownerDocument;
class DateElememt extends HTMLElement {
    constructor() {
    // If you define a constructor, always call super() first as it is required by the CE spec.
    super();

    // Setup a click listener on <user-card>
    this.addEventListener('click', e => {
      this.toggleCard();
    });
  }
  // Define behavior here
   connectedCallback() {
       const shadowRoot = this.attachShadow({mode: 'open'});
       const template = currentDocument.querySelector('#date-template');
    const instance = template.content.cloneNode(true);
    shadowRoot.appendChild(instance);
    this.shadowRoot.querySelector('.date__template').innerHTML =new Date().getFullYear();
   }
}

window.customElements.define('date-element', DateElememt);