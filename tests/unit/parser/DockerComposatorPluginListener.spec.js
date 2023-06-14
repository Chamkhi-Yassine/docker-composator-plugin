/* eslint-disable no-restricted-imports */
import fs from 'fs';
import { FileInput } from 'leto-modelizer-plugin-core';
import DockerComposatorPluginParser from '../../../src/parser/DockerComposatorPluginParser';
import DockerComposatorPluginMetadata from '../../../src/metadata/DockerComposatorPluginMetadata';

import DockerComposatorData from '../../../src/models/DockerComposatorData';
import emptyComposeMockData from '../../resources/empty-compose';
import singleServiceMockData from '../../resources/single-service';

describe('Test DockerComposatorPluginListener', () => {
  describe('Test functions', () => {
    describe('Test function: parse', () => {
      it('Should set empty children on file containing only docker-compose element', () => {
        const pluginData = new DockerComposatorData();
        const metadata = new DockerComposatorPluginMetadata(pluginData);
        metadata.parse();

        const parser = new DockerComposatorPluginParser(pluginData);

        const file = new FileInput({
          path: './empty-compose.yaml',
          content: fs.readFileSync('tests/resources/empty-compose.yaml', 'utf8'),
        });
        parser.parse([file]);
        expect(pluginData.components).toEqual(emptyComposeMockData.components);
      });
      it('Should set name of service from path', () => {
        const pluginData = new DockerComposatorData();
        const metadata = new DockerComposatorPluginMetadata(pluginData);
        metadata.parse();

        const parser = new DockerComposatorPluginParser(pluginData);

        const file = new FileInput({
          path: './single-service.yaml',
          content: fs.readFileSync('tests/resources/single-service.yaml', 'utf8'),
        });
        parser.parse([file]);
        expect(pluginData.components).toEqual(singleServiceMockData.components);
      });
    });
  });
});
