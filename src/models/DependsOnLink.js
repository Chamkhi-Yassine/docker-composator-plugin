import { ComponentLink } from 'leto-modelizer-plugin-core';

/**
 * Class that links Components together.
 * @augments {FileInformation}
 */
class DependsOnLink extends ComponentLink {
/**
 * Default constructor.
 * @param {object} [props={}] - Object that contains all properties to set.
 * @param {string} [props.source] - Id of component can be the source in a link.
 * @param {string} [props.target] - Id of component can be the target of the link.
 * @param {ComponentLinkDefinition} [props.definition] - The definition of the link.
 * @param {ComponentAttribute[]} [props.attributes=[]] - Attributes of DependsOnLink.
 */
  constructor(props = {
    attributes: [],
    source: null,
    target: null,
    definition: null,
  }) {
    const { attributes, ...rest } = props;
    super(rest);

    /**
     * Use for drawer to get the type of object.
     * @type {string}
     * @private
     */
    this.__class = 'DependsOnLink';
    /**
     * Attributes of Component.
     * @type {ComponentAttribute[]}
     */
    this.attributes = attributes || [];
  }
}

export default DependsOnLink;
