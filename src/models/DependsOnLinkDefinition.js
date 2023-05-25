/* eslint-disable max-len */
/**
 * Definition of the link between components.
 */
import { ComponentLinkDefinition } from 'leto-modelizer-plugin-core';

class DependsOnLinkDefinition extends ComponentLinkDefinition {
  /**
   * Default constructor.
   * @param {object} [props={}] - Object that contains all properties to set.
   * @param {ComponentAttributeDefinition[]} [props.definedAttributes] - Array of ComponentAttributeDefinition.
   * @param {string} [props.attributeRef] - Reference of attribute can be the link.
   * @param {string} [props.sourceRef] - Reference of component can be the source in a link.
   * @param {string} [props.targetRef] - Reference of component can be the target of the link.
   * @param {string} [props.type] - Representation of the link.
   * @param {string} [props.color='black'] - Color of the link.
   * @param {number} [props.width=2] - Width of the link.
   * @param {number[]} [props.dashStyle] - Dash style of the link. See stroke-dasharray of svg.
   * @param {object} [props.marker] - Marker of the link.
   * @param {number} [props.marker.width=5] - Width of the marker.
   * @param {number} [props.marker.height=5] - Height of the marker.
   * @param {number} [props.marker.refX=4] - X offset of the marker from the edge of the link path.
   * @param {number} [props.marker.refY=2.5] - Y offset of the marker from the edge of the link path.
   * @param {string} [props.marker.orient='auto-start-reverse'] - Orientation of the marker.
   * @param {string} [props.marker.path='M 0 0 L 5 2.5 L 0 5'] - Path of the shape of the marker.
   */

  constructor(
    props = {
      definedAttributes: [],
      attributeRef: null,
      sourceRef: null,
      targetRef: null,
      type: null,
      color: 'red',
      width: 2,
      dashStyle: null,
      marker: {
        width: 5,
        height: 5,
        refX: 4,
        refY: 2.5,
        orient: 'auto-start-reverse',
        path: 'M 0 0 L 5 2.5 L 0 5',
      },
    },
  ) {
    const { definedAttributes, ...rest } = props;
    super(rest);
    /**
     * Defined attributes for this type.
     * @type {ComponentAttributeDefinition[]}
     */
    this.definedAttributes = definedAttributes || [];
  }
}

export default DependsOnLinkDefinition;
