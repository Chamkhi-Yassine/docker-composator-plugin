import Ajv from 'ajv';
import {
  DefaultMetadata,
  ComponentDefinition,
  ComponentAttributeDefinition,
} from 'leto-modelizer-plugin-core';
import jsonComponents from 'src/assets/metadata';
import Schema from 'src/metadata/ValidationSchema';
/*
 * Metadata is used to generate definition of Component and ComponentAttribute.
 *
 * In our plugin managing Docker Composator, we use [Ajv](https://ajv.js.org/) to validate metadata.
 * And we provide a `assets/metadata/docker-compose.json` to define all metadata.
 *
 */
class DockerComposatorPluginMetadata extends DefaultMetadata {
  constructor(pluginData) {
    super(pluginData);
    this.ajv = new Ajv();
    this.schema = Schema;
    this.jsonComponents = jsonComponents;
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
      // throw new Error('Metadata are not valid', { cause: errors });
      return false;
    }

    return true;
  }

  parse() {
    const componentDefs = jsonComponents.flatMap(
      (component) => this.getComponentDefinition(component),
    );
    this.pluginData.definitions.components = componentDefs;
  }

  /**
   * Convert a JSON component definition object to a KubernetesComponentDefinition.
   * @param {object} component - JSON component definition object to parse.
   * @returns {ComponentDefinition} Parsed component definition.
   */
  getComponentDefinition(component) {
    const { attributes } = component;
    const definedAttributes = attributes.map(this.getAttributeDefinition, this);
    const comp = new ComponentDefinition({
      ...component,
      definedAttributes,
    });
    return comp;
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
      displayName: attribute.displayName, // || this.formatDisplayName(attribute.name),
      definedAttributes: subAttributes.map(this.getAttributeDefinition, this),
    });
    attributeDef.expanded = attribute.expanded || false;
    return attributeDef;
  }
}

export default DockerComposatorPluginMetadata;
