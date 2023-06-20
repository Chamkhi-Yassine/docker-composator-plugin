import { ComponentAttribute } from 'leto-modelizer-plugin-core';
import DockerComposatorData from 'src/models/DockerComposatorData';
import DockerComposatorComponent from 'src/models/DockerComposatorComponent';
import DockerComposatorMetadata from 'src/metadata/DockerComposatorMetadata';

const pluginData = new DockerComposatorData();
const metadata = new DockerComposatorMetadata(pluginData);
metadata.parse();

const serviceDef = pluginData.definitions.components
  .find(({ type }) => type === 'Service');
const networkDef = pluginData.definitions.components
  .find(({ type }) => type === 'Network');
const dependsOnLinkDef = serviceDef.definedAttributes.find(
  ({ name }) => name === 'depends_on',
).definedAttributes[0].definedAttributes.find(({ type }) => type === 'Link');

// Create the veterinary-config-server service component
const veterinaryConfigServerService = new DockerComposatorComponent({
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

// Create the veterinary-ms service component
const veterinaryMsService = new DockerComposatorComponent({
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

const backendNetwork = new DockerComposatorComponent({
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

// Add the components to the data
pluginData.components.push(backendNetwork);
pluginData.components.push(veterinaryConfigServerService);
pluginData.components.push(veterinaryMsService);

// Invoke the setLinkDefinitions method to generate the links
pluginData.__setLinkDefinitions('Service', serviceDef.definedAttributes);

export default pluginData;
