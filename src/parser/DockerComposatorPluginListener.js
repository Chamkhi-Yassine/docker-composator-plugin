import { Component, ComponentAttribute } from 'leto-modelizer-plugin-core';
/**
 * Lidy listener for Docker Compsoe files.
 */
class DockerComposatorPluginListener {
/**
   * Default constructor.
   *
   * @param {FileInformation} fileInformation - File information.
   * @param {ComponentDefinition[]} [definitions=[]] - All component definitions.
   */
  constructor(fileInformation, definitions = []) {
    /**
     * File information.
     *
     * @type {FileInformation}
     */
    this.fileInformation = fileInformation;
    /**
     * Array of component definitions.
     *
     * @type {ComponentDefinition[]}
     */
    this.definitions = definitions;
    /**
     * Parsed components.
     */
    this.components = [];
    /**
     * Parsed subcomponent.
     */
    this.childComponentsByType = {};
  }

  /**
   * Function called when attribute `root` is parsed.
   * Create a component from the parsed root element.
   *
   * @param {MapNode} rootNode - The Lidy `root` node.
   */
  exit_root(rootNode) {
    let type = '';
    // console.log('ROOT NODE VALUE: ', rootNode.value);
    if (rootNode.value.version) {
      type = 'Docker-Compose';
      const rootComponent = this.createComponentFromTree(rootNode, type);
      rootComponent.path = this.fileInformation.path;
      rootComponent.definition.childrenTypes.forEach((childType) => {
        this.setParentComponent(rootComponent, this.childComponentsByType[childType].filter(
          (component) => component.path === rootComponent.path,
        ));
      });
    }
  }

  exit_service(serviceNode) {
    const type = 'Service';
    console.log('EXITING SERVICE NODE: ', serviceNode);
    // if (this.components.find((component) => component.value === serviceNode.value)) {
    //   return;
    // }
    const serviceComponent = this.createComponentFromTree(serviceNode, type);
    serviceComponent.path = this.fileInformation.path;
    if (!this.childComponentsByType[type]) {
      this.childComponentsByType[type] = [];
    }
    this.childComponentsByType[type].push(serviceComponent);
  }

  // enter_service(serviceNode) {
  //   // serviceNode.value.id = 'service17';
  //   console.log('Entered service');
  // }

  createComponentFromTree(node, type) {
    const definition = this.definitions.find((def) => def.type === type);
    // const id = node.value.metadata?.value.name?.value || node.value.name?.value
    // || this.pluginData.generateComponentId(definition);
    let id = 'unnamed_component';
    if (type === 'Docker-Compose') {
      id = this.fileInformation.path?.split('/').pop().split('.')[0];
      console.log(id);
    }
    if (type === 'Service') {
      const newNode = JSON.parse(JSON.stringify(node));
      console.log('setting id');
      try {
        id = Object.keys(newNode.ctx.src.services).find((key) => {
          const newNodeKeyValue = JSON.stringify(newNode.ctx.src.services[key]);
          const newNodeCurrent = JSON.stringify(newNode.current);
          return newNodeKeyValue === newNodeCurrent;
        });
      } catch {
        id = this.fileInformation.path?.split('/').pop().split('.')[0];
      }
      console.log(id);
    }
    delete node.value.metadata?.value.name;
    delete node.value.name; // TODO: improve this

    const component = new Component({
      id,
      definition,
      attributes: this.createAttributesFromTreeNode(node, definition),
    });
    this.components.push(component);
    return component;
  }

  createAttributesFromTreeNode(parentNode, parentDefinition) {
    return Object.keys(parentNode.value).map((childKey) => {
      const childNode = parentNode.value[childKey];
      const definition = parentDefinition?.definedAttributes.find(
        ({ name }) => name === (parentNode.type !== 'list' ? childKey : null),
      ); // note: elements inside a list don't have a name, because it has to match the definition

      let attributeValue = {};
      if (childNode.type === 'map' || childNode.type === 'list') {
        attributeValue = this.createAttributesFromTreeNode(childNode, definition);
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
