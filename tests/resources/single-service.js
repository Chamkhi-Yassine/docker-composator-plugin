/* eslint-disable no-restricted-imports */
import { ComponentAttribute } from 'leto-modelizer-plugin-core';
import DockerComposatorData from '../../src/models/DockerComposatorData';
import DockerComposatorPluginComponent from '../../src/models/DockerComposatorPluginComponent';
import DockerComposatorPluginMetadata from '../../src/metadata/DockerComposatorPluginMetadata';

const pluginData = new DockerComposatorData();
const metadata = new DockerComposatorPluginMetadata(pluginData);
metadata.parse();

const serviceDef = pluginData.definitions.components
  .find(({ type }) => type === 'Service');

const service = new DockerComposatorPluginComponent({
  id: 'single-service',
  path: './single-service.yaml',
  definition: serviceDef,
  attributes: [
    new ComponentAttribute({
      name: 'image',
      type: 'String',
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'image'),
      value: 'busybox',
    }),
  ],
});

pluginData.components.push(service);

export default pluginData;
