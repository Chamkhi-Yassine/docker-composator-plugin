import { FileInformation } from 'leto-modelizer-plugin-core';

/**
 * Class that links Components together.
 * @augments {FileInformation}
 */
class DependsOnLink extends FileInformation {
/**
 * Default constructor.
 * @param {object} [props={}] - Object that contains all properties to set.
 * @param {DependsOnLinkDefinition} [props.definition] - The definition of the link.
 * @param {ComponentAttribute[]} [props.attributes=[]] - Attributes of Component.
 */
  constructor(props = {
    source: null,
    target: null,
    definition: null,
    attributes: [],
  }) {
    super();
    const {
      source,
      target,
      definition,
      attributes,
    } = props;

    /**
     * Use for drawer to get the type of object.
     * @type {string}
     * @private
     */
    this.__class = 'DependsOnLink';
    /**
     * Where the link is created.
     * @type {object}
     */
    this.source = source || null;
    /**
     * Target of the link.
     * @type {object}
     */
    this.target = target || null;
    /**
     * The definition of the link.
     * @type {DependsOnLinkDefinition}
     */
    this.definition = definition || null;
    /**
     * Attributes of Component.
     * @type {ComponentAttribute[]}
     */
    this.attributes = attributes || [];
  }
}

export default DependsOnLink;
