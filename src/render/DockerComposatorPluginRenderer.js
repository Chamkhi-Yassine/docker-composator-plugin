import {
  DefaultRender,
  FileInput,
} from 'leto-modelizer-plugin-core';
import yaml from 'js-yaml';
/**
 * Template of plugin renderer.
 */
class DockerComposatorPluginRenderer extends DefaultRender {
  renderFiles(parentEventId = null) {
    console.log('R', this.pluginData.components);
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
          content: yaml.dump(this.formaComponent(component)),
        });
        this.pluginData.emitEvent({ id, status: 'success' });
        return file;
      });
  }

  formaComponent(component) {
    const formatted = this.formatAttributes(component.attributes, component);
    // formatted = this.insertComponentName(formatted, component);

    this.insertChildComponentsAttributes(formatted, component);
    // this.insertDefaultValues(formatted, component);

    return formatted;
  }

  formatAttributes(attributes, component) {
    return attributes.reduce((acc, attribute) => {
      // console.log('Formatting attribute: ', attribute.name, attribute.type, attribute.value);
      if (attribute.type === 'Object') {
        acc[attribute.name] = this.formatAttributes(attribute.value, component);
      } else if (attribute.type === 'Array') {
        // console.log('R array attribute: ', attribute);
        // acc[attribute.name] = Object.values(this.formatAttributes(attribute.value, component));
        acc[attribute.name] = Array.from(attribute.value);
      } else if (attribute.definition?.type === 'Reference') {
        // Drop attribute in rendered file
      } else {
        acc[attribute.name] = attribute.value;
      }
      return acc;
    }, {});
  }

  insertComponentName(formatted, component) {
    formatted = this.insertFront(formatted, 'name', component.id);
    return formatted;
  }

  insertFront(object, key, value) {
    delete object[key];
    return {
      [key]: value,
      ...object,
    };
  }

  insertChildComponentsAttributes(formatted, component) {
    // console.log('inserting child component attributes');

    const childComponents = this.pluginData.getChildren(component.id);
    if (!childComponents.length) {
      // console.log('there are no children', component.name);
      return;
    }

    childComponents.forEach((childComponent) => {
      formatted.services ||= {};
      formatted.services[childComponent.id] = this.formaComponent(childComponent);
    });
  }
}

export default DockerComposatorPluginRenderer;
