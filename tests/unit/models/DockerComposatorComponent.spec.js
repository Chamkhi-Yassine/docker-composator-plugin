import { ComponentAttribute } from 'leto-modelizer-plugin-core';
import DockerComposatorComponent from 'src/models/DockerComposatorComponent';

describe('Test methods', () => {
  describe('Test method: __getAttributeByName', () => {
    it('Should find correct attribute when it exists', () => {
      const component = new DockerComposatorComponent();

      const objectAttribute = new ComponentAttribute({
        name: 'parentObject',
        type: 'Object',
        value: [
          new ComponentAttribute({
            name: 'sonObject',
          }),
          new ComponentAttribute({
            name: 'test-attribute',
          }),
        ],
      });

      const wrongObjectAttribute = new ComponentAttribute({
        name: 'parentObject',
        type: 'Object',
        value: [
          new ComponentAttribute({
            name: 'sonObject',
          }),
        ],
      });

      const arrayAttribute = new ComponentAttribute({
        name: 'parentObject',
        type: 'Array',
        value: [
          new ComponentAttribute({
            name: 'sonObject',
          }),
          new ComponentAttribute({
            name: 'test-attribute',
          }),
        ],
      });

      const wrongAttribute = new ComponentAttribute({
        name: 'wrongName',
      });

      let attributes = [objectAttribute];
      expect(component.__getAttributeByName(attributes, 'test-attribute')?.name).toBe('test-attribute');
      attributes = [arrayAttribute];
      expect(component.__getAttributeByName(attributes, 'test-attribute')?.name).toBe('test-attribute');
      attributes = [wrongAttribute];
      expect(component.__getAttributeByName(attributes, 'test-attribute')).toBe(null);
      attributes = [wrongObjectAttribute];
      expect(component.__getAttributeByName(attributes, 'test-attribute')).toBe(null);
    });

    it('Should return null when correct attribute does not exist', () => {
      const component = new DockerComposatorComponent();

      const wrongObjectAttribute = new ComponentAttribute({
        name: 'parentObject',
        type: 'Object',
        value: [
          new ComponentAttribute({
            name: 'sonObject',
          }),
        ],
      });

      const wrongAttribute = new ComponentAttribute({
        name: 'wrongName',
      });

      let attributes = [wrongAttribute];
      expect(component.__getAttributeByName(attributes, 'test-attribute')).toBe(null);
      attributes = [wrongObjectAttribute];
      expect(component.__getAttributeByName(attributes, 'test-attribute')).toBe(null);
    });
  });
});
