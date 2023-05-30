/* eslint-disable max-len */
/* eslint-disable no-restricted-imports */
import {
  DefaultData,
  ComponentLink,
  ComponentLinkDefinition,
} from 'leto-modelizer-plugin-core';
import DependsOnLink from './DependsOnLink';
import DependsOnLinkDefinition from './DependsOnLinkDefinition';
import Component from './DockerComposatorPluginComponent';

class DockerComposatorData extends DefaultData {
  /**
   * Create new component.
   *
   * @param {ComponentDefinition} definition - Component definition.
   * @param {string} [folder=''] - Folder path.
   * @param {string} [fileName] - File name.
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

  getLinks() {
    const links = [];
    // This function creates depends_on links for Service Components
    this.components.forEach((component) => {
      const dependsOnAttribute = component.attributes.find(
        ({ name }) => name === 'depends_on',
      );
      if (dependsOnAttribute) {
        dependsOnAttribute.value.forEach((item) => {
          const definition = this.definitions.links.find(
            ({ attributeRef }) => attributeRef === 'service',
          );
          const newLinkDefinition = new ComponentLinkDefinition({
            ...definition,
          });
          newLinkDefinition.attributeRef = item.value.find(
            ({ name }) => name.startsWith('service'),
          ).name;

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

    this.definitions.links.forEach((definition) => {
      const components = this.getComponentsByType(definition.sourceRef);
      components.forEach((component) => {
        const attribute = component.getAttributeByName(definition.attributeRef);
        if (!attribute) {
          return;
        }
        attribute.value.forEach((value) => {
          if (definition instanceof ComponentLinkDefinition) {
            // definition.attributeRef = value;
            links.push(new ComponentLink({
              definition,
              source: component.id,
              target: value,
            }));
          } else if (definition instanceof DependsOnLinkDefinition) {
            links.push(new DependsOnLink({
              definition,
              source: component.id,
              target: value,
            }));
          }
        });
      });
    });
    return links.concat(this.getWorkflowLinks());
  }

  /**
   * Set link definition in link definitions
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
      } else if (attributeDefinition.type === 'DependsOnLink') {
        const linkDefinition = new DependsOnLinkDefinition({
          type: attributeDefinition.linkType,
          attributeRef: attributeDefinition.name,
          definedAttributes: attributeDefinition.definedAttributes,
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
