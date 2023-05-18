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
          content: yaml.dump(this.formatComponent(component, false)),
        });
        this.pluginData.emitEvent({ id, status: 'success' });
        return file;
      });
  }

  formatComponent(component) {
    let formatted = this.formatAttributes(component.attributes, component);
    formatted = this.insertComponentName(formatted, component);

    this.insertChildComponentsAttributes(formatted, component);
    // this.insertDefaultValues(formatted, component);

    return formatted;
  }

  formatAttributes(attributes, component) {
    return attributes.reduce((acc, attribute) => {
      if (attribute.type === 'Object') {
        acc[attribute.name] = this.formatAttributes(attribute.value, component);
      } else if (attribute.type === 'Array') {
        acc[attribute.name] = Object.values(this.formatAttributes(attribute.value, component));
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
    const childComponents = this.pluginData.getChildren(component.id);
    if (!childComponents.length) {
      return;
    }
    const serviceComponent = childComponents[0];
    switch (component.definition.type) {
      case 'Service':
        // FIXME: what if there are multiple Pod children?
        // For now, we can ignore them, but later we will need a way
        // to limit the number of children at metadata level
        formatted.services ||= {};
        formatted.services[0] = this.formatComponent(serviceComponent, true);
        break;
      default:
        break;
    }
  }
}

export default DockerComposatorPluginRenderer;
