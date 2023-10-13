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
      switch (attribute.type) {
        case 'Object':
          acc[attribute.name] = this.formatAttributes(attribute.value, component);
          break;
        case 'Array':
          acc[attribute.name] = attribute.name === 'depends_on'
            ? this.formatDependsOnAttributes(attribute)
            : attribute.name === 'volumes'
              ? this.formatVolumesAttributes(attribute)
              : Array.from(attribute.value);
          break;
        default:
          if (attribute.definition?.type !== 'Reference') {
            acc[attribute.name] = attribute.value;
          }
          break;
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
   * Format the "volumes" attribute of a component.
   * @param {Attribute} attribute - The "volumes" attribute.
   * @returns {object} The formatted "volumes" attribute.
   */
  formatVolumesAttributes(attribute) {
    const subAttributes = [];
    attribute.value.forEach((childObject) => {
      subAttributes.push(`${childObject.value[0].value}:${childObject.value[1].value}`);
    });
    return subAttributes;
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
      const componentType = `${childComponent.definition.type.toLowerCase()}s`;
      formatted[componentType] ||= {};
      formatted[componentType][childComponent.id] = this.formatComponent(childComponent);
    });
  }
}

export default DockerComposatorRenderer;
