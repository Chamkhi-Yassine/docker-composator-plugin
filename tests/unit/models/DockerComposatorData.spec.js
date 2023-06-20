import { ComponentDefinition } from 'leto-modelizer-plugin-core';
import DockerComposatorData from 'src/models/DockerComposatorData';
import dataGetLinkTestsPluginData from 'tests/resources/models/DataGetLinkTests';

describe('DockerComposatorData', () => {
  describe('addComponent', () => {
    it('should add a new component and return the generated ID', () => {
      const data = new DockerComposatorData();
      const definition = new ComponentDefinition({ type: 'Service' }); // Create a component definition

      const id = data.addComponent(definition); // Add the component and get the returned ID

      expect(id).toBeDefined(); // Check if the ID is defined

      // Find the added component in the components array
      const addedComponent = data.components.find((component) => component.id === id);

      expect(addedComponent).toBeDefined(); // Check if the added component is defined
      expect(addedComponent.id).toBe(id); // Check if the added component has the correct ID
      // Check if the added component has the correct definition
      expect(addedComponent.definition).toBe(definition);
    });
  });

  describe('getLinks', () => {
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
