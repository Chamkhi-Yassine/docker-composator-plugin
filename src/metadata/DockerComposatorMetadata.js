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
    this.pluginData.definitions.components = componentDefs;
  }

  /**
   * Convert a JSON component definition object to a ComponentDefinition.
   * @param {object} component - JSON component definition object to parse.
   * @returns {ComponentDefinition} Parsed component definition.
   */
  getComponentDefinition(component) {
    const { attributes } = component;
    const definedAttributes = attributes.map(this.getAttributeDefinition, this);
    const componentDef = new ComponentDefinition({
      ...component,
      definedAttributes,
    });
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
      displayName: attribute.displayName,
      definedAttributes: subAttributes.map(this.getAttributeDefinition, this),
    });
    attributeDef.expanded = attribute.expanded || false;
    return attributeDef;
  }
}

export default DockerComposatorMetadata;
