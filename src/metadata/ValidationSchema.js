export default {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      type: { type: 'string' },
      model: { type: 'string' },
      displayName: { type: 'string' },
      icon: { type: 'string' },
      isContainer: { type: 'boolean' },
      childrenTypes: {
        type: 'array',
        items: { type: 'string' },
      },
      parentTypes: {
        type: 'array',
        items: { type: 'string' },
      },
      attributes: {
        type: 'array',
        items: {
          $ref: '#/definitions/attribute',
        },
      },
    },
  },
  definitions: {
    attribute: {
      type: 'object',
      properties: {
        name: { anyOf: [{ type: 'string' }, { type: 'null' }] },
        type: {
          type: 'string',
          pattern: '(String|Boolean|Number|Array|Object|Link|Reference)',
        },
        required: { type: 'boolean' },
        containerRef: { type: 'string' },
        expanded: { type: 'boolean' },
        attributes: {
          type: 'array',
          items: { $ref: '#/definitions/attribute' },
        },
        linkRef: { type: 'string' },
        linkColor: { type: 'string' },
      },
      required: ['type'],
    },
  },
};
