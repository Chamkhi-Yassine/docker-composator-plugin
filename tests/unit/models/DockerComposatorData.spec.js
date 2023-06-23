import { ComponentDefinition } from 'leto-modelizer-plugin-core';
import DockerComposatorData from 'src/models/DockerComposatorData';
import dataGetLinkTestsPluginData from 'tests/resources/models/DataGetLinkTests';

describe('DockerComposatorData', () => {
  describe('Test function:  addComponent', () => {
    it('should add a new component and return the generated ID', () => {
      const data = new DockerComposatorData();
      const definition = new ComponentDefinition({ type: 'Service' });

      const id = data.addComponent(definition); 

      expect(id).toBeDefined(); 

      const addedComponent = data.components.find((component) => component.id === id);

      expect(addedComponent).toBeDefined(); 
      expect(addedComponent.id).toBe(id); 
      expect(addedComponent.definition).toBe(definition);
    });
  });

  describe('Test function:  getLinks', () => {
    it('should return component links based on depends_on attribute', () => {
      const data = dataGetLinkTestsPluginData;

      const links = data.getLinks();
      expect(links.length).toBe(2);
      expect(links).toContainEqual(
        expect.objectContaining({ source: 'veterinary-ms', target: 'veterinary-config-server' }),
      );
    });

    it('should return component links based on attribute values', () => {
      const data = dataGetLinkTestsPluginData;

      const links = data.getLinks();
      expect(links.length).toBe(2);
      expect(links).toContainEqual(
        expect.objectContaining({ source: 'veterinary-config-server', target: 'backend' }),
      );
    });
  });
});
