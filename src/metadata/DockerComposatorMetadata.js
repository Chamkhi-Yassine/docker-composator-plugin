import Ajv from 'ajv';
import {
  DefaultMetadata,
  ComponentDefinition,
  ComponentAttributeDefinition,
} from 'leto-modelizer-plugin-core';
import jsonComponents from 'src/assets/metadata';
import Schema from 'src/metadata/ValidationSchema';

/*
 * Metadata is used to generate definitions of Components and ComponentAttributes.
 *
 * In our plugin managing Docker Composator, we use [Ajv](https://ajv.js.org/) to validate metadata.
 * And we provide a `assets/metadata/docker-compose.json` to define all metadata.
 *
 */
class DockerComposatorMetadata extends DefaultMetadata {
  /**
   * Default constructor.
   * @param {object} pluginData - Plugin data.
   */
  constructor(pluginData) {
    super(pluginData);
    /**
     * ajv.
     * @type {Ajv}
     */
    this.ajv = new Ajv();
    /**
     * schema.
     * @type {Schema}
     */
    this.schema = Schema;

    /**
     * dockerComosator components
     * @type {jsonComponents}
     */
    this.jsonComponents = jsonComponents;

    /**
     * dockerComosator validation
     * @type {validate}
     */
    this.validate = this.validate.bind(this);
  }

  /**
   * Validate the provided metadata with a schema.
   * @returns {boolean} True if metadata is valid.
   */
  validate() {
    const errors = [];
    const validate = this.ajv.compile(this.schema);
    if (!validate(this.jsonComponents)) {
      errors.push({
        ...this.jsonComponents,
        errors: validate.errors,
      });
    }

    if (errors.length > 0) {
      return false;
    }

    return true;
  }

  /**
   * Function that adds component definitions from JSON file to pluginData.
   */
  parse() {
    const componentDefs = jsonComponents.flatMap(
      (component) => this.getComponentDefinition(component),
    );
    this.setChildrenTypes(componentDefs);
    this.pluginData.definitions.components.push(...componentDefs);
  }

  /**
   * Convert a JSON component definition object to a ComponentDefinition.
   * @param {object} component - JSON component definition object to parse.
   * @returns {ComponentDefinition} Parsed component definition.
   */
  getComponentDefinition(component) {
    const attributes = [...component.attributes];
    if (component.type !== 'Docker-Compose') {
      // All components are children of the Docker-Compose, so they must have a reference attibute.
      attributes.push({
        name: 'parentCompose',
        type: 'Reference',
        containerRef: 'Docker-Compose',
        required: true,
      });
    }
    const definedAttributes = attributes.map(this.getAttributeDefinition, this);
    const componentDef = new ComponentDefinition({
      ...component,
      definedAttributes,
    });
    componentDef.parentTypes = this.getParentTypes(componentDef);
    return componentDef;
  }

  /**
   * Convert a JSON attribute object to a ComponentAttributeDefinition.
   * @param {object} attribute - JSON attribute definition object to parse.
   * @returns {ComponentAttributeDefinition} Parsed attribute definition.
   */
  getAttributeDefinition(attribute) {
    const subAttributes = attribute.attributes || [];
    const attributeDef = new ComponentAttributeDefinition({
      ...attribute,
      displayName: attribute.displayName || this.formatDisplayName(attribute.name),
      definedAttributes: subAttributes.map(this.getAttributeDefinition, this),
    });
    attributeDef.expanded = attribute.expanded || false;
    return attributeDef;
  }

  /**
   * Format a name into a readable displayName.
   * @param {string} name - Name to format.
   * @returns {string} Formatted displayName.
   */
  formatDisplayName(name) {
    if (!name) {
      return name;
    }
    const s = name.replace(/([A-Z])/g, ' $1');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /**
   * Get all possible parent container types.
   * @param {DockerComposatorComponentDefinition} componentDefinition - Definition to get all parent
   * container types.
   * @returns {string[]} All possible parent container types.
   */
  getParentTypes(componentDefinition) {
    const { parentTypes } = componentDefinition;

    componentDefinition.definedAttributes
      .filter((attribute) => attribute.type === 'Reference')
      .map((attribute) => attribute.containerRef)
      .filter((ref) => !parentTypes.includes(ref))
      .forEach((ref) => parentTypes.push(ref));
    return parentTypes;
  }

  /**
   * Set the childrenTypes of all containers from children's parentTypes.
   * @param {DockerComposatorComponentDefinition[]} componentDefinitions - Array of component definitions.
   */
  setChildrenTypes(componentDefinitions) {
    const children = componentDefinitions
      .filter((def) => def.parentTypes.length > 0)
      .reduce((acc, def) => {
        def.parentTypes.forEach((parentType) => {
          acc[parentType] = [...(acc[parentType] || []), def.type];
        });
        return acc;
      }, {});
    componentDefinitions.filter((def) => children[def.type])
      .forEach((def) => {
        def.childrenTypes = children[def.type];
      });
  }
}

export default DockerComposatorMetadata;
