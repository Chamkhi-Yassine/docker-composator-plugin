import { ComponentAttribute, ComponentAttributeDefinition } from 'leto-modelizer-plugin-core';
import DockerComposatorData from 'src/models/DockerComposatorData';
import DockerComposatorComponent from 'src/models/DockerComposatorComponent';
import DockerComposatorMetadata from 'src/metadata/DockerComposatorMetadata';

const pluginData = new DockerComposatorData();
const metadata = new DockerComposatorMetadata(pluginData);
metadata.parse();

// Components Definitions
const dockerComposeDef = pluginData.definitions.components
  .find(({ type }) => type === 'Docker-Compose');
const serviceDef = pluginData.definitions.components
  .find(({ type }) => type === 'Service');
const networkDef = pluginData.definitions.components
  .find(({ type }) => type === 'Network');
const volumeDef = pluginData.definitions.components
  .find(({ type }) => type === 'Volume');
const secretDef = pluginData.definitions.components
  .find(({ type }) => type === 'Secret');
const configDef = pluginData.definitions.components
  .find(({ type }) => type === 'Config');

// Common attributes definitions
const serviceImageAttributeDef = serviceDef.definedAttributes
  .find(({ name }) => name === 'image');
const serviceNetworksAttributeDef = serviceDef.definedAttributes
  .find(({ name }) => name === 'networks');
const serviceBuildAttributeDef = serviceDef.definedAttributes
  .find(({ name }) => name === 'build');
const buildContextAttributeDef = serviceBuildAttributeDef.definedAttributes
  .find(({ name }) => name === 'context');
const serviceHealthcheckAttributeDef = serviceDef.definedAttributes
  .find(({ name }) => name === 'healthcheck');

const parentComposeAttribute = new ComponentAttribute({
  name: 'parentCompose',
  type: 'String',
  definition: serviceDef.definedAttributes
    .find(({ name }) => name === 'parentCompose'),
  value: 'veto-full-compose',
});

// "Depends On" attribute special definitions
const dependsOnAttributeDef = serviceDef.definedAttributes
  .find(({ name }) => name === 'depends_on');
const dependsOnLinkDef = dependsOnAttributeDef.definedAttributes[0].definedAttributes
  .find(({ type }) => type === 'Link');
const dependsOnConditionDef = dependsOnAttributeDef.definedAttributes[0].definedAttributes
  .find(({ name }) => name === 'condition');
const dependsOnConfigServerDef = new ComponentAttributeDefinition({
  ...dependsOnLinkDef,
  name: 'service_veterinary-ms_0',
});
const dependsOnDatabaseDef = new ComponentAttributeDefinition({
  ...dependsOnLinkDef,
  name: 'service_veterinary-ms_1',
});

// "Volumes" attribute special definitions
const serviceVolumesAttributeDef = serviceDef.definedAttributes
  .find(({ name }) => name === 'volumes');
const volumesLinkDef = serviceVolumesAttributeDef.definedAttributes[0].definedAttributes
  .find(({ type }) => type === 'Link');
const volumesMountpathDef = serviceVolumesAttributeDef.definedAttributes[0].definedAttributes
  .find(({ name }) => name === 'mount-path');
const volumesMsLinkDef = new ComponentAttributeDefinition({
  ...volumesLinkDef,
  name: 'volume_database_0',
});

// Instantiating Components
const dockerCompose = new DockerComposatorComponent({
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

const databaseService = new DockerComposatorComponent({
  id: 'database',
  path: './veto-full-compose.yaml',
  definition: serviceDef,
  attributes: [
    new ComponentAttribute({
      name: 'image',
      type: 'String',
      definition: serviceImageAttributeDef,
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
      definition: serviceNetworksAttributeDef,
      value: ['backend'],
    }),
    new ComponentAttribute({
      name: 'volumes',
      type: 'Array',
      definition: serviceVolumesAttributeDef,
      value: [new ComponentAttribute({
        name: null,
        type: 'Object',
        value: [
          new ComponentAttribute({
            name: 'volume_database_0',
            type: 'Array',
            definition: volumesMsLinkDef,
            value: ['data'],
          }),
          new ComponentAttribute({
            name: 'mount-path',
            type: 'String',
            definition: volumesMountpathDef,
            value: '/path/to/mount',
          }),
        ],
      })],
    }),
    new ComponentAttribute({
      name: 'secrets',
      type: 'Array',
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'secrets'),
      value: ['secret-file'],
    }),
    new ComponentAttribute({
      name: 'configs',
      type: 'Array',
      definition: serviceDef.definedAttributes
        .find(({ name }) => name === 'configs'),
      value: ['config-file'],
    }),
    new ComponentAttribute({ ...parentComposeAttribute }),
  ],
});

const veterinaryConfigServerService = new DockerComposatorComponent({
  id: 'veterinary-config-server',
  path: './veto-full-compose.yaml',
  definition: serviceDef,
  attributes: [
    new ComponentAttribute({
      name: 'image',
      type: 'String',
      definition: serviceImageAttributeDef,
      value: 'veterinary-config-server:0.2',
    }),
    new ComponentAttribute({
      name: 'build',
      type: 'Object',
      definition: serviceBuildAttributeDef,
      value: [
        new ComponentAttribute({
          name: 'context',
          type: 'String',
          definition: buildContextAttributeDef,
          value: './Backend/config-server',
        }),
        new ComponentAttribute({
          name: 'dockerfile',
          type: 'String',
          definition: serviceBuildAttributeDef.definedAttributes.find(
            ({ name }) => name === 'dockerfile',
          ),
          value: './Backend/config-server/Dockerfile',
        }),
      ],
    }),
    new ComponentAttribute({
      name: 'healthcheck',
      type: 'Object',
      definition: serviceHealthcheckAttributeDef,
      value: [
        new ComponentAttribute({
          name: 'test',
          type: 'String',
          definition: serviceHealthcheckAttributeDef.definedAttributes.find(
            ({ name }) => name === 'test',
          ),
          value: 'curl -f http://localhost:2001/actuator/health',
        }),
        new ComponentAttribute({
          name: 'interval',
          type: 'String',
          definition: serviceHealthcheckAttributeDef.definedAttributes.find(
            ({ name }) => name === 'interval',
          ),
          value: '30s',
        }),
        new ComponentAttribute({
          name: 'timeout',
          type: 'String',
          definition: serviceHealthcheckAttributeDef.definedAttributes.find(
            ({ name }) => name === 'timeout',
          ),
          value: '5s',
        }),
        new ComponentAttribute({
          name: 'retries',
          type: 'Number',
          definition: serviceHealthcheckAttributeDef.definedAttributes.find(
            ({ name }) => name === 'retries',
          ),
          value: 3,
        }),
      ],
    }),
    new ComponentAttribute({
      name: 'networks',
      type: 'Array',
      definition: serviceNetworksAttributeDef,
      value: ['backend'],
    }),
    new ComponentAttribute({ ...parentComposeAttribute }),
  ],
});

const veterinaryMsService = new DockerComposatorComponent({
  id: 'veterinary-ms',
  path: './veto-full-compose.yaml',
  definition: serviceDef,
  attributes: [
    new ComponentAttribute({
      name: 'image',
      type: 'String',
      definition: serviceImageAttributeDef,
      value: 'veterinary-ms:0.2',
    }),
    new ComponentAttribute({
      name: 'build',
      type: 'Object',
      definition: serviceBuildAttributeDef,
      value: [
        new ComponentAttribute({
          name: 'context',
          type: 'String',
          definition: buildContextAttributeDef,
          value: './Backend/veterinary-ms',
        }),
      ],
    }),
    new ComponentAttribute({
      name: 'depends_on',
      type: 'Array',
      definition: dependsOnAttributeDef,
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
            definition: dependsOnConditionDef,
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
            definition: dependsOnConditionDef,
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
    new ComponentAttribute({ ...parentComposeAttribute }),
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
    new ComponentAttribute({ ...parentComposeAttribute }),
  ],
});

const dataVolume = new DockerComposatorComponent({
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
    new ComponentAttribute({ ...parentComposeAttribute }),
  ],
});

const secretComponent = new DockerComposatorComponent({
  id: 'secret-file',
  path: './veto-full-compose.yaml',
  definition: secretDef,
  attributes: [
    new ComponentAttribute({
      name: 'file',
      type: 'String',
      definition: secretDef.definedAttributes
        .find(({ name }) => name === 'file'),
      value: 'path/to/secret/file',
    }),
    new ComponentAttribute({ ...parentComposeAttribute }),
  ],
});

const configComponent = new DockerComposatorComponent({
  id: 'config-file',
  path: './veto-full-compose.yaml',
  definition: configDef,
  attributes: [
    new ComponentAttribute({
      name: 'file',
      type: 'String',
      definition: configDef.definedAttributes
        .find(({ name }) => name === 'file'),
      value: 'path/to/config/file',
    }),
    new ComponentAttribute({ ...parentComposeAttribute }),
  ],
});

// Adding components to pluginData
pluginData.components.push(databaseService);
pluginData.components.push(veterinaryConfigServerService);
pluginData.components.push(veterinaryMsService);
pluginData.components.push(backendNetwork);
pluginData.components.push(dataVolume);
pluginData.components.push(secretComponent);
pluginData.components.push(configComponent);
pluginData.components.push(dockerCompose);

export default pluginData;
