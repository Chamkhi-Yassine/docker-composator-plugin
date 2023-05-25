/* eslint-disable no-restricted-imports */
import {
  DefaultData,
  Component,
  ComponentAttribute,
  ComponentLink,
  ComponentLinkDefinition,
} from 'leto-modelizer-plugin-core';
import DependsOnLink from './DependsOnLink';
import DependsOnLinkDefinition from './DependsOnLinkDefinition';

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

    switch (definition.type) {
      case 'Container':
        component.attributes = [
          this.__createAttribute('isInitContainer', false, definition),
        ];
        break;
      default:
        break;
    }
    this.components.push(component);

    return id;
  }

  __createAttribute(name, value, parentDefinition) {
    const definition = parentDefinition.definedAttributes.find(
      (attributeDefinition) => attributeDefinition.name === name,
    );
    const attribute = new ComponentAttribute({
      name,
      value,
      type: definition.type,
      definition,
    });
    return attribute;
  }

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
          console.log('data attr: ', attribute);
          switch (attribute.value.type) {
            case 'Link':
              links.push(new ComponentLink({
                definition,
                source: component.id,
                target: value,
              }));
              break;
            case 'DependsOnLink':
              links.push(new DependsOnLink({
                definition,
                source: component.id,
                target: value,
              }));
              break;
            default:
              break;
          }
        });
      });
    });

    return links;
  }

  /**
   * Build internal links for workflow containers.
   * @returns {ComponentLink[]} List of links
   */
  // getWorkflowLinks() {
  //   return this.components.filter(({ definition }) => definition.displayType?.match('workflow'))
  //     .reduce((links, component) => {
  //       const children = this.getChildren(component.id);

  //       if (children.length > 1) {
  //         for (let childIndex = 0; childIndex < children.length - 1; childIndex += 1) {
  //           links.push(new ComponentLink({
  //             definition: new ComponentLinkDefinition({
  //               sourceRef: '__workflow',
  //               attributeRef: '__next',
  //             }),
  //             source: children[childIndex].id,
  //             target: children[childIndex + 1].id,
  //           }));
  //         }
  //       }

  //       return links;
  //     }, []);
  // }

  /**
   * Uniquely get the definitions used for existing links.
   * @returns {ComponentLinkDefinition[]} - List of link definitions.
   */
  // getUsedLinkDefinitions() {
  //   return this.getLinks()
  //     .map((link) => link.definition)
  //     .reduce((acc, definition) => {
  //       if (!acc.some((used) => (
  //         used.attributeRef === definition.attributeRef
  //         && used.sourceRef === definition.sourceRef
  //         && used.targetRef === definition.targetRef
  //       ))) {
  //         acc.push(definition);
  //       }

  //       return acc;
  //     }, []);
  // }

  /**
   * Initialize all link definitions from all component attribute definitions.
   * @param {string} [parentEventId] - Parent event id.
   */
  initLinkDefinitions(parentEventId) {
    const id = this.emitEvent({
      parent: parentEventId,
      type: 'Data',
      action: 'init',
      status: 'running',
    });

    this.definitions.links = [];
    this.definitions.components.forEach(({ type, definedAttributes }) => {
      this.__setLinkDefinitions(type, definedAttributes);
    });

    this.emitEvent({ id, status: 'success' });
  }

  /**
   * Set link definition in link definitions
   * @param {string} type - Component type to link.
   * @param {ComponentAttributeDefinition[]} definedAttributes - Component attribute definitions.
   * @private
   */
  __setLinkDefinitions(type, definedAttributes) {
    console.log('Setting link definitions');
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
        console.log(this.definitions.links);
      } else if (attributeDefinition.type === 'DependsOnLink') {
        console.log('Setting depends on link definition');

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
        console.log(this.definitions.links);
      } else if (attributeDefinition.type === 'Object') {
        this.__setLinkDefinitions(type, attributeDefinition.definedAttributes);
      }
    });
  }
}

export default DockerComposatorData;
