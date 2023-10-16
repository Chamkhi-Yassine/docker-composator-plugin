import { ComponentAttribute } from 'leto-modelizer-plugin-core';
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
const configDef = pluginData.definitions.components
  .find(({ type }) => type === 'Config');
const secretDef = pluginData.definitions.components
  .find(({ type }) => type === 'Secret');

// Common attributes
const dependsOnAttributeDef = serviceDef.definedAttributes
  .find(({ name }) => name === 'depends_on');
const serviceImageAttributeDef = serviceDef.definedAttributes
  .find(({ name }) => name === 'image');
const parentComposeAttribute = new ComponentAttribute({
  name: 'parentCompose',
  type: 'String',
  definition: serviceDef.definedAttributes
    .find(({ name }) => name === 'parentCompose'),
  value: 'veto-full-compose',
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

const service = new DockerComposatorComponent({
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
      value: ['POSTGRES_USER=admin', 'POSTGRES_PASSWORD=pg-pwd'],
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
      value: [new ComponentAttribute({
        name: null,
        type: 'Object',
        value: [
          new ComponentAttribute({
            name: 'volume_database_0',
            type: 'Array',
            value: ['data'],
          }),
          new ComponentAttribute({
            name: 'mount-path',
            type: 'String',
            value: '/path/to/mount',
          }),
        ],
      })],
    }),
    new ComponentAttribute({
      name: 'healthcheck',
      type: 'Object',
      definition: serviceDef.definedAttributes.find(({ name }) => name === 'healthcheck'),
      value: [
        new ComponentAttribute({
          name: 'test',
          type: 'string',
          definition: serviceDef.definedAttributes.find(
            ({ name }) => name === 'healthcheck',
          ).definedAttributes.find(
            ({ name }) => name === 'test',
          ),
          value: 'test-exemple',
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
    new ComponentAttribute({ ...parentComposeAttribute }),
  ],
});

const service2 = new DockerComposatorComponent({
  id: 'front',
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
      name: 'depends_on',
      type: 'Array',
      definition: dependsOnAttributeDef,
      value: [
        new ComponentAttribute({
          name: null,
          type: 'Object',
          value: [
            new ComponentAttribute({
              name: 'service_veterinary-ms_1',
              type: 'Array',
              definition: dependsOnAttributeDef.definedAttributes[0].definedAttributes
                .find(({ type }) => type === 'Link'),
              value: ['database'],
            }),
            new ComponentAttribute({
              name: 'condition',
              type: 'String',
              definition: dependsOnAttributeDef.definedAttributes[0].definedAttributes
                .find(({ name }) => name === 'condition'),
              value: 'service_healthy',
            }),
          ],
        }),
      ],
    }),
    new ComponentAttribute({ ...parentComposeAttribute }),
  ],
});

const network = new DockerComposatorComponent({
  id: 'backend',
  path: './veto-full-compose.yaml',
  definition: networkDef,
  attributes: [
    new ComponentAttribute({
      name: 'driver',
      type: 'String',
      definition: networkDef.definedAttributes
        .find(({ name }) => name === 'driver'),
      value: 'custom-driver-one',
    }),
    new ComponentAttribute({ ...parentComposeAttribute }),
  ],
});

const volume = new DockerComposatorComponent({
  id: 'data',
  path: './veto-full-compose.yaml',
  definition: volumeDef,
  attributes: [
    new ComponentAttribute({
      name: 'driver',
      type: 'String',
      definition: volumeDef.definedAttributes
        .find(({ name }) => name === 'driver'),
      value: 'data-driver-one',
    }),
    new ComponentAttribute({ ...parentComposeAttribute }),
  ],
});

const config = new DockerComposatorComponent({
  id: 'config_database_config',
  path: './veto-full-compose.yaml',
  definition: configDef,
  attributes: [
    new ComponentAttribute({
      name: 'file',
      type: 'String',
      definition: configDef.definedAttributes
        .find(({ name }) => name === 'file'),
      value: './configs/config_server_config.yml',
    }),
    new ComponentAttribute({
      name: 'external',
      type: 'Boolean',
      definition: configDef.definedAttributes
        .find(({ name }) => name === 'external'),
      value: true,
    }),
    new ComponentAttribute({ ...parentComposeAttribute }),
  ],
});

const secret = new DockerComposatorComponent({
  id: 'databse-secret',
  path: './veto-full-compose.yaml',
  definition: secretDef,
  attributes: [
    new ComponentAttribute({
      name: 'file',
      type: 'String',
      definition: secretDef.definedAttributes
        .find(({ name }) => name === 'file'),
      value: './secrets/secret_database.yml',
    }),
    new ComponentAttribute({
      name: 'external',
      type: 'Boolean',
      definition: secretDef.definedAttributes
        .find(({ name }) => name === 'external'),
      value: true,
    }),
    new ComponentAttribute({ ...parentComposeAttribute }),
  ],
});

// Adding components to pluginData
pluginData.components.push(config);
pluginData.components.push(secret);
pluginData.components.push(volume);
pluginData.components.push(network);
pluginData.components.push(service);
pluginData.components.push(service2);
pluginData.components.push(dockerCompose);

export default pluginData;
