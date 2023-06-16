import { Component } from 'leto-modelizer-plugin-core';

class DockerComposatorPluginComponent extends Component {
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

export default DockerComposatorPluginComponent;
