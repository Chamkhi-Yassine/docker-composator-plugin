/* eslint-disable no-restricted-imports */
import { ComponentAttribute, ComponentAttributeDefinition } from 'leto-modelizer-plugin-core';
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
const networkDef = pluginData.definitions.components
  .find(({ type }) => type === 'Network');
const volumeDef = pluginData.definitions.components
  .find(({ type }) => type === 'Volume');

const dependsOnLinkDef = serviceDef.definedAttributes.find(
  ({ name }) => name === 'depends_on',
).definedAttributes[0].definedAttributes.find(({ type }) => type === 'Link');

const dependsOnConfigServerDef = new ComponentAttributeDefinition({
  ...dependsOnLinkDef,
  name: 'service_veterinary-ms_0',
});

const dependsOnDatabaseDef = new ComponentAttributeDefinition({
  ...dependsOnLinkDef,
  name: 'service_veterinary-ms_1',
});

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

const databaseService = new DockerComposatorPluginComponent({
  id: 'database',
  path: './veto-full-compose.yaml',
  definition: serviceDef,
  attributes: [
    new ComponentAttribute({
      name: 'image',
      type: 'String',
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'image'),
      value: 'postgres',
    }),
    new ComponentAttribute({
      name: 'environment',
      type: 'Array',
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'environment'),
      value: ['POSTGRES_USER=admin'],
    }),
    new ComponentAttribute({
      name: 'ports',
      type: 'Array',
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'ports'),
      value: ['5432:5432'],
    }),
    new ComponentAttribute({
      name: 'networks',
      type: 'Array',
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'networks'),
      value: ['backend'],
    }),
    new ComponentAttribute({
      name: 'volumes',
      type: 'Array',
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'volumes'),
      value: ['data'],
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

const veterinaryConfigServerService = new DockerComposatorPluginComponent({
  id: 'veterinary-config-server',
  path: './veto-full-compose.yaml',
  definition: serviceDef,
  attributes: [
    new ComponentAttribute({
      name: 'image',
      type: 'String',
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'image'),
      value: 'veterinary-config-server:0.2',
    }),
    new ComponentAttribute({
      name: 'build',
      type: 'Object',
      definition: serviceDef.definedAttributes.find(({ name }) => name === 'build'),
      value: [
        new ComponentAttribute({
          name: 'context',
          type: 'String',
          definition: serviceDef.definedAttributes.find(
            ({ name }) => name === 'build',
          ).definedAttributes.find(
            ({ name }) => name === 'context',
          ),
          value: './Backend/config-server',
        }),
        new ComponentAttribute({
          name: 'dockerfile',
          type: 'String',
          definition: serviceDef.definedAttributes.find(
            ({ name }) => name === 'build',
          ).definedAttributes.find(
            ({ name }) => name === 'dockerfile',
          ),
          value: './Backend/config-server/Dockerfile',
        }),
      ],
    }),
    new ComponentAttribute({
      name: 'healthcheck',
      type: 'Object',
      definition: serviceDef.definedAttributes.find(({ name }) => name === 'healthcheck'),
      value: [
        new ComponentAttribute({
          name: 'test',
          type: 'String',
          definition: serviceDef.definedAttributes.find(
            ({ name }) => name === 'healthcheck',
          ).definedAttributes.find(
            ({ name }) => name === 'test',
          ),
          value: 'curl -f http://localhost:2001/actuator/health',
        }),
        new ComponentAttribute({
          name: 'interval',
          type: 'String',
          definition: serviceDef.definedAttributes.find(
            ({ name }) => name === 'healthcheck',
          ).definedAttributes.find(
            ({ name }) => name === 'interval',
          ),
          value: '30s',
        }),
        new ComponentAttribute({
          name: 'timeout',
          type: 'String',
          definition: serviceDef.definedAttributes.find(
            ({ name }) => name === 'healthcheck',
          ).definedAttributes.find(
            ({ name }) => name === 'timeout',
          ),
          value: '5s',
        }),
        new ComponentAttribute({
          name: 'retries',
          type: 'Number',
          definition: serviceDef.definedAttributes.find(
            ({ name }) => name === 'healthcheck',
          ).definedAttributes.find(
            ({ name }) => name === 'retries',
          ),
          value: 3,
        }),
      ],
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
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'parentCompose'),
      value: 'veto-full-compose',
    }),
  ],
});

const veterinaryMsService = new DockerComposatorPluginComponent({
  id: 'veterinary-ms',
  path: './veto-full-compose.yaml',
  definition: serviceDef,
  attributes: [
    new ComponentAttribute({
      name: 'image',
      type: 'String',
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'image'),
      value: 'veterinary-ms:0.2',
    }),
    new ComponentAttribute({
      name: 'build',
      type: 'Object',
      definition: serviceDef.definedAttributes.find(({ name }) => name === 'build'),
      value: [
        new ComponentAttribute({
          name: 'context',
          type: 'String',
          definition: serviceDef.definedAttributes.find(
            ({ name }) => name === 'build',
          ).definedAttributes.find(
            ({ name }) => name === 'context',
          ),
          value: './Backend/veterinary-ms',
        }),
      ],
    }),
    new ComponentAttribute({
      name: 'depends_on',
      type: 'Array',
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'depends_on'),
      value: [new ComponentAttribute({
        name: null,
        type: 'Object',
        value: [
          new ComponentAttribute({
            name: 'service_veterinary-ms_0',
            type: 'Array',
            definition: dependsOnConfigServerDef,
            value: ['veterinary-config-server'],
          }),
          new ComponentAttribute({
            name: 'condition',
            type: 'String',
            value: 'service_healthy',
          }),
        ],
      }),
      new ComponentAttribute({
        name: null,
        type: 'Object',
        value: [
          new ComponentAttribute({
            name: 'service_veterinary-ms_1',
            type: 'Array',
            definition: dependsOnDatabaseDef,
            value: ['database'],
          }),
          new ComponentAttribute({
            name: 'condition',
            type: 'String',
            value: 'service_healthy',
          }),
        ],
      })],
    }),
    new ComponentAttribute({
      name: 'tty',
      type: 'Boolean',
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'tty'),
      value: true,
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
const dataVolume = new DockerComposatorPluginComponent({
  id: 'data',
  path: './veto-full-compose.yaml',
  definition: volumeDef,
  attributes: [
    new ComponentAttribute({
      name: 'driver',
      type: 'String',
      definition: volumeDef.definedAttributes
        .find(({ name }) => name === 'driver'),
      value: 'custom-driver-1',
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

pluginData.components.push(databaseService);
pluginData.components.push(veterinaryConfigServerService);
pluginData.components.push(veterinaryMsService);
pluginData.components.push(backendNetwork);
pluginData.components.push(dataVolume);
pluginData.components.push(dockerCompose);

export default pluginData;
