/* eslint-disable no-restricted-imports */
/* eslint-disable max-len */
import { ComponentAttribute, ComponentAttributeDefinition } from 'leto-modelizer-plugin-core';
import Component from '../models/DockerComposatorPluginComponent';

/**
 * Lidy listener for Docker Compose files.
 */
class DockerComposatorPluginListener {
  /**
   * Default constructor.
   * @param {FileInformation} fileInformation - File information.
   * @param {ComponentDefinition[]} [definitions=[]] - All component definitions.
   */
  constructor(fileInformation, definitions = []) {
    /**
     * File information.
     * @type {FileInformation}
     */
    this.fileInformation = fileInformation;

    /**
     * Array of component definitions.
     * @type {ComponentDefinition[]}
     */
    this.definitions = definitions;

    /**
     * Parsed components.
     */
    this.components = [];

    /**
     * Parsed subcomponents.
     */
    this.childComponentsByType = {};
  }

  /**
   * Function called when attribute `root` is parsed.
   * Create a component from the parsed root element.
   * @param {MapNode} rootNode - The Lidy `root` node.
   */
  exit_root(rootNode) {
    let type = '';
    if (rootNode.value.version) {
      type = 'Docker-Compose';
      const rootComponent = this.createComponentFromTree(rootNode, type);
      rootComponent.path = this.fileInformation.path;
      rootComponent.definition.childrenTypes.forEach((childType) => {
        if (!this.childComponentsByType[childType]) {
          this.childComponentsByType[childType] = [];
        }
        this.setParentComponent(rootComponent, this.childComponentsByType[childType].filter(
          (component) => component.path === rootComponent.path,
        ));
      });
    }
  }

  exit_service(serviceNode) {
    const type = 'Service';
    if (serviceNode) {
      const serviceComponent = this.createComponentFromTree(serviceNode, type);
      serviceComponent.path = this.fileInformation.path;
      if (!this.childComponentsByType[type]) {
        this.childComponentsByType[type] = [];
      }
      this.childComponentsByType[type].push(serviceComponent);
    }
  }

  exit_volume(volumeNode) {
    const type = 'Volume';
    if (volumeNode) {
      const volumeComponent = this.createComponentFromTree(volumeNode, type);
      volumeComponent.path = this.fileInformation.path;
      if (!this.childComponentsByType[type]) {
        this.childComponentsByType[type] = [];
      }
      this.childComponentsByType[type].push(volumeComponent);
    }
  }

  exit_network(networkNode) {
    const type = 'Network';
    if (networkNode) {
      const networkComponent = this.createComponentFromTree(networkNode, type);
      networkComponent.path = this.fileInformation.path;
      if (!this.childComponentsByType[type]) {
        this.childComponentsByType[type] = [];
      }
      this.childComponentsByType[type].push(networkComponent);
    }
  }

  createComponentFromTree(node, type) {
    const definition = this.definitions.find((def) => def.type === type);
    let id = 'unnamed_component';
    if (type === 'Docker-Compose') {
      id = this.fileInformation.path?.split('/').pop().split('.')[0];
      delete node.value.services;
      delete node.value.volumes;
      delete node.value.networks;
    }
    if (type === 'Service') {
      const nodeObject = JSON.parse(JSON.stringify(node));
      try {
        id = Object.keys(nodeObject.ctx.src.services).find((key) => JSON.stringify(nodeObject.ctx.src.services[key]) === JSON.stringify(nodeObject.current));
      } catch {
        id = this.fileInformation.path?.split('/').pop().split('.')[0];
      }
    }
    if (type === 'Volume') {
      const nodeObject = JSON.parse(JSON.stringify(node));
      try {
        id = Object.keys(nodeObject.ctx.src.volumes).find((key) => JSON.stringify(nodeObject.ctx.src.volumes[key]) === JSON.stringify(nodeObject.current));
      } catch {
        id = this.fileInformation.path?.split('/').pop().split('.')[0];
      }
    }
    if (type === 'Network') {
      const nodeObject = JSON.parse(JSON.stringify(node));
      try {
        id = Object.keys(nodeObject.ctx.src.networks).find((key) => JSON.stringify(nodeObject.ctx.src.networks[key]) === JSON.stringify(nodeObject.current));
      } catch {
        id = this.fileInformation.path?.split('/').pop().split('.')[0];
      }
    }
    delete node?.value?.metadata?.value.name;
    delete node?.value?.name; // TODO: improve this
    const component = new Component({
      id,
      definition,
      attributes: this.createAttributesFromTreeNode(id, node, definition),
    });

    this.components.push(component);
    return component;
  }

  createAttributesFromTreeNode(id, parentNode, parentDefinition) {
    return Object.keys(parentNode.value).map((childKey) => {
      const childNode = parentNode.value[childKey];
      const definition = parentDefinition?.definedAttributes.find(
        ({ name }) => name === (parentNode.type !== 'list' ? childKey : null),
      );

      let attributeValue = {};
      if (childKey === 'depends_on') {
        return this.createDependsOnAttribute(id, childNode, childKey, definition);
      }
      if ((childNode.type === 'map' || childNode.type === 'list')) {
        attributeValue = this.createAttributesFromTreeNode(id, childNode, definition);
      } else if (childNode.type === 'string' && (!childKey || /[0-9]+/i.test(childKey))) {
        return childNode.value;
      } else {
        attributeValue = childNode.value;
      }

      const attribute = new ComponentAttribute({
        name: childKey,
        type: this.lidyToLetoType(childNode.type),
        definition,
        value: attributeValue,
      });

      return attribute;
    });
  }

  setParentComponent(parentComponent, childComponents) {
    childComponents?.forEach((childComponent) => {
      childComponent.setReferenceAttribute(parentComponent);
    });
  }

  createDependsOnAttribute(id, childNode, childKey, definition) {
    const dependsOnValue = [];
    // For each child object of the depends_on array, create its attributes.
    // Each child has two attributes: service and condition.
    childNode.childs.forEach((child, i = 0) => {
      const linkDefinition = definition.definedAttributes[0].definedAttributes.find(
        ({ type }) => type === 'Link',
      );

      const newLinkName = `service_${id}_${i}`;
      const newLinkAttributeDefinition = new ComponentAttributeDefinition({
        ...linkDefinition,
        name: newLinkName,
      });

      dependsOnValue.push(new ComponentAttribute({
        name: null,
        type: 'Object',
        value: [
          new ComponentAttribute({
            name: newLinkName,
            type: 'Array',
            definition: newLinkAttributeDefinition,
            value: [child.key.value],
          }),
          new ComponentAttribute({
            name: 'condition',
            type: 'String',
            value: child.value.condition.value,
          }),
        ],
      }));
      // Increment depends_on service link name for the current component
      i += 1;
    });
    // Return the final depends_on component with all its children properly set
    return new ComponentAttribute({
      name: childKey,
      type: 'Array',
      definition,
      value: dependsOnValue,
    });
  }

  lidyToLetoType(lidyType) {
    switch (lidyType) {
      case 'string':
        return 'String';
      case 'boolean':
        return 'Boolean';
      case 'int':
      case 'float':
        return 'Number';
      case 'map':
        return 'Object';
      case 'list':
        return 'Array';
      default:
        return null; // TODO: throw error
    }
  }
}

export default DockerComposatorPluginListener;
