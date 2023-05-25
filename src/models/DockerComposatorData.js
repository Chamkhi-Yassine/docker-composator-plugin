/* eslint-disable max-len */
/* eslint-disable no-restricted-imports */
import {
  DefaultData,
  ComponentLink,
  ComponentLinkDefinition,
} from 'leto-modelizer-plugin-core';
import DependsOnLink from './DependsOnLink';
import DependsOnLinkDefinition from './DependsOnLinkDefinition';

class DockerComposatorData extends DefaultData {
  getLinks() {
    const links = [];

    this.definitions.links.forEach((definition) => {
      const components = this.getComponentsByType(definition.sourceRef);

      components.forEach((component) => {
        const attribute = component.getAttributeByName(definition.attributeRef);

        if (!attribute) {
          return;
        }

        attribute.value.forEach((value) => {
          if (definition instanceof ComponentLinkDefinition) {
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
      } else if (attributeDefinition.type === 'Object') {
        this.__setLinkDefinitions(type, attributeDefinition.definedAttributes);
      }
    });
  }
}

export default DockerComposatorData;
