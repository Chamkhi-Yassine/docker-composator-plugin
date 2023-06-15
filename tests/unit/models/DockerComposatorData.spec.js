import { ComponentDefinition, ComponentAttribute, ComponentLinkDefinition } from 'leto-modelizer-plugin-core';
import DockerComposatorPluginComponent from 'src/models/DockerComposatorPluginComponent';
import DockerComposatorPluginMetadata from 'src/metadata/DockerComposatorPluginMetadata';
import DockerComposatorData from 'src/models/DockerComposatorData';

describe('DockerComposatorData', () => {
  let data;

  beforeEach(() => {
    data = new DockerComposatorData();
  });

  describe('addComponent', () => {
    it('should add a new component and return the generated ID', () => {
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
    beforeEach(() => {
      data.definitions.links.push(
        new ComponentLinkDefinition({
          type: 'LinkType',
          attributeRef: 'LinkAttribute',
          sourceRef: 'Service',
          targetRef: 'Service',
          color: 'red',
        }),
      );
    });

    it('should return component links based on depends_on attribute', () => {
      const metadata = new DockerComposatorPluginMetadata(data);
      metadata.parse();

      // Find the Service definition
      const serviceDef = data.definitions.components.find(({ type }) => type === 'Service');

      // Find the depends_on link definition
      const dependsOnLinkDef = serviceDef.definedAttributes.find(
        ({ name }) => name === 'depends_on',
      ).definedAttributes[0].definedAttributes.find(
        ({ type }) => type === 'Link',
      );

      // Create the veterinary-config-server service component
      const veterinaryConfigServerService = new DockerComposatorPluginComponent({
        id: 'veterinary-config-server',
        path: './veto-full-compose.yaml',
        definition: serviceDef,
        attributes: [
          new ComponentAttribute({
            name: 'image',
            type: 'String',
            definition: serviceDef.definedAttributes.find(({ name }) => name === 'image'),
            value: 'veterinary-config-server:0.2',
          }),
          new ComponentAttribute({
            name: 'parentCompose',
            type: 'String',
            definition: serviceDef.definedAttributes.find(({ name }) => name === 'parentCompose'),
            value: 'veto-full-compose',
          }),
        ],
      });

      // Create the veterinary-ms service component
      const veterinaryMsService = new DockerComposatorPluginComponent({
        id: 'veterinary-ms',
        path: './veto-full-compose.yaml',
        definition: serviceDef,
        attributes: [
          new ComponentAttribute({
            name: 'image',
            type: 'String',
            definition: serviceDef.definedAttributes.find(({ name }) => name === 'image'),
            value: 'veterinary-ms:0.2',
          }),
          new ComponentAttribute({
            name: 'depends_on',
            type: 'Array',
            definition: serviceDef.definedAttributes.find(({ name }) => name === 'depends_on'),
            value: [
              new ComponentAttribute({
                name: null,
                type: 'Object',
                value: [
                  new ComponentAttribute({
                    name: 'service_veterinary-ms_0',
                    type: 'Array',
                    definition: dependsOnLinkDef,
                    value: ['veterinary-config-server'],
                  }),
                  new ComponentAttribute({
                    name: 'condition',
                    type: 'String',
                    value: 'service healthy',
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      // Add the service components to the data
      data.components.push(veterinaryConfigServerService);
      data.components.push(veterinaryMsService);

      // Invoke the setLinkDefinitions method to generate the links
      data.__setLinkDefinitions('Service', serviceDef.definedAttributes);

      const links = data.getLinks();
      expect(links.length).toBe(1);
      expect(links).toContainEqual(
        expect.objectContaining({ source: 'veterinary-ms', target: 'veterinary-config-server' }),
      );
    });

    it('should return component links based on attribute values', () => {
      const metadata = new DockerComposatorPluginMetadata(data);
      metadata.parse();

      // Find the Service definition
      const serviceDef = data.definitions.components.find(({ type }) => type === 'Service');

      // Find the network definition
      const networkDef = data.definitions.components.find(({ type }) => type === 'Network');

      // Create the veterinary-config-server service component
      const veterinaryConfigServerService = new DockerComposatorPluginComponent({
        id: 'veterinary-config-server',
        path: './veto-full-compose.yaml',
        definition: serviceDef,
        attributes: [
          new ComponentAttribute({
            name: 'image',
            type: 'String',
            definition: serviceDef.definedAttributes.find(({ name }) => name === 'image'),
            value: 'veterinary-config-server:0.2',
          }),
          new ComponentAttribute({
            name: 'networks',
            type: 'Array',
            definition: serviceDef.definedAttributes
              .find(({ name }) => name === 'networks'),
            value: ['backend'],
          }),
          new ComponentAttribute({
            name: 'parentCompose',
            type: 'String',
            definition: serviceDef.definedAttributes.find(({ name }) => name === 'parentCompose'),
            value: 'veto-full-compose',
          }),
        ],
      });

      const backendNetwork = new DockerComposatorPluginComponent({
        id: 'backend',
        path: './veto-full-compose.yaml',
        definition: networkDef,
        attributes: [
          new ComponentAttribute({
            name: 'driver',
            type: 'String',
            definition: networkDef.definedAttributes
              .find(({ name }) => name === 'driver'),
            value: 'custom-driver-0',
          }),
          new ComponentAttribute({
            name: 'parentCompose',
            type: 'String',
            definition: serviceDef.definedAttributes
              .find(({ name }) => name === 'parentCompose'),
            value: 'veto-full-compose',
          }),
        ],
      });
      data.components.push(veterinaryConfigServerService);
      data.components.push(backendNetwork);

      data.__setLinkDefinitions('Service', serviceDef.definedAttributes);

      const links = data.getLinks();
      expect(links.length).toBe(1);
      expect(links).toContainEqual(
        expect.objectContaining({ source: 'veterinary-config-server', target: 'backend' }),
      );
    });
  });

  describe('__setLinkDefinitions', () => {
    it('should set link definitions in the data', () => {
      const linkDefinition1 = new ComponentLinkDefinition({
        attributeRef: 'LinkAttribute1',
        sourceRef: 'Service',
        targetRef: 'Service',
        type: 'LinkType1',
      });

      const linkDefinition2 = new ComponentLinkDefinition({
        attributeRef: 'LinkAttribute2',
        sourceRef: 'Service',
        targetRef: 'Network',
        type: 'LinkType2',
        color: 'blue',
      });

      data.definitions.links.push(linkDefinition1);
      data.definitions.links.push(linkDefinition2);

      expect(data.definitions.links.length).toBe(2);
      expect(data.definitions.links[0]).toEqual(linkDefinition1);
      expect(data.definitions.links[1]).toEqual(linkDefinition2);
    });
  });
});
