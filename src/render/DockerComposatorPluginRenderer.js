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
        console.log('R', component);

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
        console.log('R', file);

        this.pluginData.emitEvent({ id, status: 'success' });
        return file;
      });
  }

  formatComponent(component) {
    console.log('R', component);
    const formatted = this.formatAttributes(component.attributes, component);
    console.log('R', formatted);
    // formatted = this.insertComponentName(formatted, component);
    this.insertChildComponentsAttributes(formatted, component);
    // this.insertDefaultValues(formatted, component);
    console.log('R', formatted);
    return formatted;
  }

  formatAttributes(attributes, component) {
    return attributes.reduce((acc, attribute) => {
      if (attribute.type === 'Object') {
        acc[attribute.name] = this.formatAttributes(attribute.value, component);
      } else if (attribute.type === 'Array') {
        // acc[attribute.name] = Object.values(this.formatAttributes(attribute.value, component));

        if (attribute.name === 'depends_on') {
          acc[attribute.name] = Object.values(this.formatAttributes(attribute.value, component));
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

  insertComponentName(formatted, component) {
    console.log('inserting name', formatted);
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
    const childComponents = this.pluginData.getChildren(component.id);
    console.log('R', childComponents);
    if (!childComponents.length) {
      return;
    }

    childComponents.forEach((childComponent) => {
      formatted.services ||= {};
      formatted.services[childComponent.id] = this.formatComponent(childComponent);
    });
  }
}

export default DockerComposatorPluginRenderer;
