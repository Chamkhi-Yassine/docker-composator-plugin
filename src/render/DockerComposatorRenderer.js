import {
  DefaultRender,
  FileInput,
} from 'leto-modelizer-plugin-core';
import yaml from 'js-yaml';

/**
 * Template of plugin renderer.
 */
class DockerComposatorRenderer extends DefaultRender {
  /**
   * Render files from related components.
   * @param {string} [parentEventId] - Parent event id.
   * @returns {FileInput[]} Render files array.
   */
  renderFiles(parentEventId = null) {
    return this.pluginData.components.filter(
      (component) => !component.getContainerId(),
    )
      .map((component) => {
        const id = this.pluginData.emitEvent({
          parent: parentEventId,
          type: 'Render',
          action: 'write',
          status: 'running',
          files: [component.path],
          data: {
            global: false,
          },
        });
        const file = new FileInput({
          path: component.path,
          content: yaml.dump(this.formatComponent(component)),
        });
        this.pluginData.emitEvent({ id, status: 'success' });
        return file;
      });
  }

  /**
   * Format a component into the desired structure.
   * @param {Component} component - The component to format.
   * @returns {object} The formatted component.
   */
  formatComponent(component) {
    const formatted = this.formatAttributes(component.attributes, component);
    this.insertChildComponentsAttributes(formatted, component);
    return formatted;
  }

  /**
   * Format the attributes of a component.
   * @param {Attribute[]} attributes - The attributes to format.
   * @param {Component} component - The component containing the attributes.
   * @returns {object} The formatted attributes.
   */
  formatAttributes(attributes, component) {
    return attributes.reduce((acc, attribute) => {
      if (attribute.type === 'Object') {
        acc[attribute.name] = this.formatAttributes(attribute.value, component);
      } else if (attribute.type === 'Array') {
        if (attribute.name === 'depends_on') {
          acc[attribute.name] = this.formatDependsOnAttributes(attribute);
        } else {
          acc[attribute.name] = Array.from(attribute.value);
        }
      } else if (attribute.definition?.type === 'Reference') {
        // Drop attribute in rendered file
      } else {
        acc[attribute.name] = attribute.value;
      }
      return acc;
    }, {});
  }

  /**
   * Format the "depends_on" attribute of a component.
   * @param {Attribute} attribute - The "depends_on" attribute.
   * @returns {object} The formatted "depends_on" attribute.
   */
  formatDependsOnAttributes(attribute) {
    const subAttributes = {};
    attribute.value.forEach((childObject) => {
      subAttributes[childObject.value[0].value] = {};
      subAttributes[childObject.value[0].value][childObject.value[1].name] = childObject.value[1].value;
    });
    return subAttributes;
  }

  /**
   * Insert the component name into the formatted object.
   * @param {object} formatted - The formatted object.
   * @param {Component} component - The component.
   * @returns {object} The formatted object with the component name inserted.
   */
  insertComponentName(formatted, component) {
    formatted = this.insertFront(formatted, 'name', component.id);
    return formatted;
  }

  /**
   * Insert a key-value pair at the front of an object.
   * @param {object} object - The object to modify.
   * @param {string} key - The key to insert.
   * @param {*} value - The value to insert.
   * @returns {object} The object with the key-value pair inserted at the front.
   */
  insertFront(object, key, value) {
    delete object[key];
    return {
      [key]: value,
      ...object,
    };
  }

  /**
   * Insert attributes of child components into the formatted object.
   * @param {object} formatted - The formatted object.
   * @param {Component} component - The parent component.
   */
  insertChildComponentsAttributes(formatted, component) {
    const childComponents = this.pluginData.getChildren(component.id);
    if (!childComponents.length) {
      return;
    }

    childComponents.forEach((childComponent) => {
      switch (childComponent.definition.type) {
        case 'Service':
          formatted.services ||= {};
          formatted.services[childComponent.id] = this.formatComponent(childComponent);
          break;
        case 'Volume':
          formatted.volumes ||= {};
          formatted.volumes[childComponent.id] = this.formatComponent(childComponent);
          break;
        case 'Network':
          formatted.networks ||= {};
          formatted.networks[childComponent.id] = this.formatComponent(childComponent);
          break;
        case 'Config':
          formatted.configs ||= {};
          formatted.configs[childComponent.id] = this.formatComponent(childComponent);
          break;
        case 'Secret':
          formatted.secrets ||= {};
          formatted.secrets[childComponent.id] = this.formatComponent(childComponent);
          break;
        default:
          break;
      }
    });
  }
}

export default DockerComposatorRenderer;
