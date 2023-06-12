/* eslint-disable no-restricted-imports */
import { ComponentAttribute } from 'leto-modelizer-plugin-core';
import DockerComposatorData from '../../src/models/DockerComposatorData';
import DockerComposatorPluginComponent from '../../src/models/DockerComposatorPluginComponent';
import DockerComposatorPluginMetadata from '../../src/metadata/DockerComposatorPluginMetadata';

const pluginData = new DockerComposatorData();
const metadata = new DockerComposatorPluginMetadata(pluginData);
metadata.parse();

const dockerComposeDef = pluginData.definitions.components
  .find(({ type }) => type === 'Docker-Compose');
const serviceDef = pluginData.definitions.components
  .find(({ type }) => type === 'Service');


const dockerCompose = new DockerComposatorPluginComponent({
  id: 'veto-full-compose',
  path: './veto-full-compose.yaml',
  definition: dockerComposeDef,
  attributes: [
    new ComponentAttribute({
      name: 'version',
      type: 'String',
      definition: dockerComposeDef.definedAttributes
        .find(({ name }) => name === 'version'),
      value: '3.9',
    }),
  ],
});

const service = new DockerComposatorPluginComponent({
  id: 'veterinary-ms',
  path: './veto-full-compose.yaml',
  definition: serviceDef,
});

service.attributes.push(new ComponentAttribute({
  name: 'image',
  type: 'String',
  definition: serviceDef.definedAttributes
    .find(({ name }) => name === 'image'),
  value: 'veterinary-ms:0.2',
}));

service.attributes.push(new ComponentAttribute({
  name: 'tty',
  type: 'Boolean',
  definition: serviceDef.definedAttributes
    .find(({ name }) => name === 'tty'),
  value: true,
}));

service.attributes.push(new ComponentAttribute({
  name: 'parentCompose',
  type: 'String',
  definition: serviceDef.definedAttributes
    .find(({ name }) => name === 'parentCompose'),
  value: 'veto-full-compose',
}));

pluginData.components.push(service);
pluginData.components.push(dockerCompose);

export default pluginData;
