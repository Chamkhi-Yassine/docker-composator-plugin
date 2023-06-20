import { Component } from 'leto-modelizer-plugin-core';

class DockerComposatorComponent extends Component {
  /**
   * Get attribute by name recursively.
   * @param {ComponentAttribute[]} attributes - Array of component attributes.
   * @param {string} name - Name of the attribute to search for.
   * @returns {ComponentAttribute|null} Found attribute or null if not found.
   * @private
   */
  __getAttributeByName(attributes, name) {
    for (let index = 0; index < attributes.length; index += 1) {
      if (attributes[index].name === name) {
        return attributes[index];
      }
      if (attributes[index].type === 'Object' || attributes[index].type === 'Array') {
        const attribute = this.__getAttributeByName(attributes[index].value, name);
        if (attribute) {
          return attribute;
        }
      }
    }

    return null;
  }
}

export default DockerComposatorComponent;
