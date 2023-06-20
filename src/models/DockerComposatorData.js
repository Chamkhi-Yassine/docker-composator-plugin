import {
  DefaultData,
  ComponentLink,
  ComponentLinkDefinition,
} from 'leto-modelizer-plugin-core';
import Component from 'src/models/DockerComposatorComponent';

class DockerComposatorData extends DefaultData {
  /**
   * Create new component.
   * @param {ComponentDefinition} definition - Component definition.
   * @param {string} [folder=''] - Folder path.
   * @returns {string} Component id.
   */
  addComponent(definition, folder = '') {
    const id = this.generateComponentId(definition);
    const component = new Component({
      id,
      definition,
      path: `${folder}${id}.yaml`,
    });
    this.components.push(component);

    return id;
  }

  /**
   * Get all component links.
   * @returns {ComponentLink[]} Array of component links.
   */
  getLinks() {
    const links = [];

    // Create depends_on links for Service Components
    this.components.forEach((component) => {
      const dependsOnAttribute = component.attributes.find(
        ({ name }) => name === 'depends_on',
      );
      if (dependsOnAttribute) {
        dependsOnAttribute.value.forEach((item) => {
          const definition = this.definitions.links.find(
            ({ attributeRef }) => attributeRef === 'service',
          );

          links.push(new ComponentLink({
            definition,
            source: component.id,
            target: item.value.find(
              ({ name }) => name.startsWith('service'),
            ).value[0],
          }));
        });
      }
    });

    // Create other links based on link definitions
    this.definitions.links.forEach((definition) => {
      const components = this.getComponentsByType(definition.sourceRef);
      components.forEach((component) => {
        const attribute = component.getAttributeByName(definition.attributeRef);
        if (!attribute) {
          return;
        }
        attribute.value.forEach((value) => {
          links.push(new ComponentLink({
            definition,
            source: component.id,
            target: value,
          }));
        });
      });
    });

    // Add workflow links
    return links.concat(this.getWorkflowLinks());
  }

  /**
   * Set link definition in link definitions.
   * @param {string} type - Component type to link.
   * @param {ComponentAttributeDefinition[]} definedAttributes - Component attribute definitions.
   * @private
   */
  __setLinkDefinitions(type, definedAttributes) {
    definedAttributes.forEach((attributeDefinition) => {
      if (attributeDefinition.type === 'Link') {
        const linkDefinition = new ComponentLinkDefinition({
          type: attributeDefinition.linkType,
          attributeRef: attributeDefinition.name,
          sourceRef: type,
          targetRef: attributeDefinition.linkRef,
          color: attributeDefinition.linkColor,
          width: attributeDefinition.linkWidth,
          dashStyle: attributeDefinition.linkDashStyle,
        });

        this.definitions.links.push(linkDefinition);
      } else if (attributeDefinition.type === 'Object' || attributeDefinition.type === 'Array') {
        this.__setLinkDefinitions(type, attributeDefinition.definedAttributes);
      }
    });
  }
}

export default DockerComposatorData;
