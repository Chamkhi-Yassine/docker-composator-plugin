import fs from 'fs';
import { FileInput } from 'leto-modelizer-plugin-core';
import DockerComposatorListener from 'src/parser/DockerComposatorListener';
import DockerComposatorParser from 'src/parser/DockerComposatorParser';
import DockerComposatorMetadata from 'src/metadata/DockerComposatorMetadata';
import DockerComposatorData from 'src/models/DockerComposatorData';

describe('Test DockerComposatorListener', () => {
  describe('Test functions', () => {
    describe('Test function: lidyToLetoType', () => {
      it('Should convert type correctly', () => {
        const listener = new DockerComposatorListener();
        expect(listener.lidyToLetoType('string')).toBe('String');
        expect(listener.lidyToLetoType('boolean')).toBe('Boolean');
        expect(listener.lidyToLetoType('int')).toBe('Number');
        expect(listener.lidyToLetoType('float')).toBe('Number');
        expect(listener.lidyToLetoType('map')).toBe('Object');
        expect(listener.lidyToLetoType('list')).toBe('Array');
        expect(listener.lidyToLetoType('something else')).toBe(null);
      });
    });

    describe('Test all exit functions add chilrenComponents functionality', () => {
      it('Should not initialize childComponentsByType[type]', () => {
        const pluginData = new DockerComposatorData();
        const metadata = new DockerComposatorMetadata(pluginData);
        metadata.parse();

        const parser = new DockerComposatorParser(pluginData);

        const file = new FileInput({
          path: './compose-with-simple-children.yaml',
          content: fs.readFileSync('tests/resources/parser/compose-with-simple-children.yaml', 'utf8'),
        });

        parser.listener.childComponentsByType = {
          Service: [],
          Volume: [],
          Network: [],
          Config: [],
          Secret: [],
        };
        parser.parse([file]);
        expect(pluginData.components.length).toBe(6);
      });
    });

    describe('Test function: exit_root', () => {
      it('Should do nothing if rootNode.value.version is not defined', () => {
        const listener = new DockerComposatorListener();
        expect(listener.exit_root({ value: 'value does not have version' })).not.toBeDefined();
      });
    });

    describe('Test function: exit_service', () => {
      it('Should do nothing if serviceNode is not defined', () => {
        const listener = new DockerComposatorListener();
        expect(listener.exit_service(undefined)).not.toBeDefined();
      });
    });

    describe('Test function: exit_volume', () => {
      it('Should do nothing if columeNode is not defined', () => {
        const listener = new DockerComposatorListener();
        expect(listener.exit_volume(undefined)).not.toBeDefined();
      });
    });

    describe('Test function: exit_network', () => {
      it('Should do nothing if networkNode is not defined', () => {
        const listener = new DockerComposatorListener();
        expect(listener.exit_network(undefined)).not.toBeDefined();
      });
    });

    describe('Test function: exit_config', () => {
      it('Should do nothing if configNode is not defined', () => {
        const listener = new DockerComposatorListener();
        expect(listener.exit_config(undefined)).not.toBeDefined();
      });
    });

    describe('Test function: exit_secret', () => {
      it('Should do nothing if secretNode is not defined', () => {
        const listener = new DockerComposatorListener();
        expect(listener.exit_secret(undefined)).not.toBeDefined();
      });
    });

    describe('Test function: createComponentFromTree', () => {
      it('Should return null if type is not in list', () => {
        const listener = new DockerComposatorListener();
        expect(listener.createComponentFromTree({}, 'NonExistentType')).toBeNull();
      });
    });
  });
});
