import { ComponentAttribute, ComponentAttributeDefinition } from 'leto-modelizer-plugin-core';
import DockerComposatorComponent from '../models/DockerComposatorComponent';

/**
 * Lidy listener for Docker Compose files.
 */
class DockerComposatorListener {
  /**
   * Default constructor.
   * @param {FileInformation} fileInformation - File information.
   * @param {ComponentDefinition[]} [definitions=[]] - All component definitions.
   */
  constructor(fileInformation, definitions = []) {
    this.fileInformation = fileInformation;
    this.definitions = definitions;
    this.components = [];
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

  /**
   * Function called when attribute `service` is parsed.
   * Create a component from the parsed service element.
   * @param {MapNode} serviceNode - The Lidy `service` node.
   */
  exit_service(serviceNode) {
    this.createComponent(serviceNode, 'Service');
  }

  /**
   * Function called when attribute `volume` is parsed.
   * Create a component from the parsed volume element.
   * @param {MapNode} volumeNode - The Lidy `volume` node.
   */
  exit_volume(volumeNode) {
    this.createComponent(volumeNode, 'Volume');
  }

  /**
   * Function called when attribute `network` is parsed.
   * Create a component from the parsed network element.
   * @param {MapNode} networkNode - The Lidy `network` node.
   */
  exit_network(networkNode) {
    this.createComponent(networkNode, 'Network');
  }

  /**
   * Function called when attribute `config` is parsed.
   * Create a component from the parsed config element.
   * @param {MapNode} configNode - The Lidy `config` node.
   */
  exit_config(configNode) {
    this.createComponent(configNode, 'Config');
  }

  /**
   * Function called when attribute `secret` is parsed.
   * Create a component from the parsed secret element.
   * @param {MapNode} secretNode - The Lidy `secret` node.
   */
  exit_secret(secretNode) {
    this.createComponent(secretNode, 'Secret');
  }

  /**
   * Function called to create component on exit.
   * @param {MapNode} node - The node that contains the tree.
   * @param {string} type - The type of the component that will be created.
   */
  createComponent(node, type) {
    if (node) {
      const component = this.createComponentFromTree(node, type);
      component.path = this.fileInformation.path;
      if (!this.childComponentsByType[type]) {
        this.childComponentsByType[type] = [];
      }
      this.childComponentsByType[type].push(component);
    }
  }

  /**
   * Function called to create id for component based on name.
   * @param {MapNode} node - The node that contains the tree.
   * @param {string} type - The type of the component that will be created.
   * @returns {string | null} - The created id or null if type is not supported
   */
  setComponentId(node, type) {
    let id = 'unnamed_component';
    // If the component is Docker-Compose, set the id as the name of the file
    // else find the name from the list of components respective to type
    switch (type) {
      case 'Docker-Compose':
      {
        id = this.fileInformation.path?.split('/').pop().split('.')[0];
        break;
      }
      case 'Service':
      case 'Volume':
      case 'Network':
      case 'Config':
      case 'Secret':
      {
        const nodeObject = JSON.parse(JSON.stringify(node.ctx.src));
        const typeLowerCase = type.toLowerCase();
        const srcMap = new Map(Object.entries(nodeObject[`${typeLowerCase}s`]));

        const currentString = JSON.stringify(node.current);
        srcMap.forEach((value, key) => {
          if (JSON.stringify(value) === currentString) {
            id = key;
          }
        });
        break;
      }
      default:
        return null;
    }
    return id;
  }

  /**
   * Function called to create component from its tree.
   * @param {MapNode} node - The node that contains the tree.
   * @param {string} type - The type of the component that will be created.
   * @returns {DockerComposatorComponent} - The constructed Component
   */
  createComponentFromTree(node, type) {
    const definition = this.definitions.find((def) => def.type === type);
    const id = this.setComponentId(node, type);
    if (!id) {
      return null;
    }
    if (type === 'Docker-Compose') {
      const propsToDelete = ['services', 'volumes', 'networks', 'secrets', 'configs'];
      propsToDelete.forEach((prop) => delete node.value[prop]);
    }

    delete node?.value?.metadata?.value.name;
    delete node?.value?.name;

    const component = new DockerComposatorComponent({
      id,
      definition,
      attributes: this.createAttributesFromTreeNode(id, node, definition),
    });

    this.components.push(component);
    return component;
  }

  /**
   * Function called to create component attributes from component tree.
   * @param {string} id - The id of the component.
   * @param {MapNode} parentNode - The node that contains the tree.
   * @param {ComponentDefinition} parentDefinition - The definition of the component.
   * @returns {ComponentAttribute} - The constructed ComponentAttribute.
   */
  createAttributesFromTreeNode(id, parentNode, parentDefinition) {
    const result = Object.keys(parentNode.value).map((childKey) => {
      const childNode = parentNode.value[childKey];
      const definition = parentDefinition?.definedAttributes.find(
        ({ name }) => name === (parentNode.type !== 'list' ? childKey : null),
      );

      let attributeValue = {};
      if (childKey === 'depends_on') {
        return this.createDependsOnAttribute(id, childNode, definition);
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

    return result;
  }

  /**
   * Function called to set parent component id to child.
   * @param {DockerComposatorComponent} parentComponent - The parent component (docker-compose)
   * whose reference will be added to the children.
   * @param {DockerComposatorComponent[]} childComponents - The child components who will receive
   * the reference to the parent.
   */
  setParentComponent(parentComponent, childComponents) {
    childComponents?.forEach((childComponent) => {
      childComponent.setReferenceAttribute(parentComponent);
    });
  }

  /**
   * Function called to create depends_on attribute from component tree.
   * @param {string} id - The id of the component.
   * @param {MapNode} childNode - The node that contains the tree.
   * @param {ComponentDefinition} definition - The definition of the component.
   * @returns {ComponentAttribute} - The constructed depends_on ComponentAttribute.
   */
  createDependsOnAttribute(id, childNode, definition) {
    const dependsOnValue = [];
    childNode.childs.forEach((child, i) => {
      // Fetch the definition of the link from depends_on attributes definitions
      const linkDefinition = definition.definedAttributes[0].definedAttributes.find(
        ({ type }) => type === 'Link',
      );

      // Set the name for the new link to be created and add its definition from
      // the one fetched previously. The name is based on the id of the current component and
      // the index of the link (child).
      const newLinkName = `service_${id}_${i}`;
      const newLinkAttributeDefinition = new ComponentAttributeDefinition({
        ...linkDefinition,
        name: newLinkName,
      });
      // Since depends_on is an array of multiple objects (which are themselves ComponentAttributes)
      // each containing a link and a condition, we push in this step the created object with its
      // two attributes to the value of depends_on.
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
            definition: definition.definedAttributes[0].definedAttributes.find(
              ({ name }) => name === 'condition',
            ),
            value: child.value.condition.value,
          }),
        ],
      }));
    });

    return new ComponentAttribute({
      name: 'depends_on',
      type: 'Array',
      definition,
      value: dependsOnValue,
    });
  }

  /**
   * Function called to convert lidy type to Leto type.
   * @param {string} lidyType - The lidy attribute type that must be converted.
   * @returns {string | null} - The corresponding Leto type or null if lidyType isn't one from the list.
   */
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
        return null;
    }
  }
}

export default DockerComposatorListener;
