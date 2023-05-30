/* eslint-disable no-restricted-imports */
import { DefaultMetadata, ComponentDefinition, ComponentAttributeDefinition } from 'leto-modelizer-plugin-core';
import jsonComponents from '../assets/metadata';
/*
 * Metadata is used to generate definition of Component and ComponentAttribute.
 *
 * In our plugin managing Terraform, we use [Ajv](https://ajv.js.org/) to validate metadata.
 * And we provide a `metadata.json` to define all metadata.
 *
 * Feel free to manage your metadata as you wish.
 */
class DockerComposatorPluginMetadata extends DefaultMetadata {
  /**
   * Validate the provided metadata with a schemas.
   * @returns {boolean} True if metadata is valid.
   */
  validate() {
    return true;
  }

  parse() {
    const componentDefs = jsonComponents.flatMap(
      (component) => this.getComponentDefinition(component),
    );

    // this.setChildrenTypes(componentDefs);
    this.pluginData.definitions.components = componentDefs;
  }

  /**
   * Convert a JSON component definition object to a KubernetesComponentDefinition.
   * @param {object} component - JSON component definition object to parse.
   * @returns {ComponentDefinition} Parsed component definition.
   */
  getComponentDefinition(component) {
    const attributes = component.attributes || [];
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
