/* eslint-disable no-restricted-imports */
import fs from 'fs';
import { FileInformation, FileInput } from 'leto-modelizer-plugin-core';
import DockerComposatorPluginParser from '../../../src/parser/DockerComposatorPluginParser';
import DockerComposatorPluginMetadata from '../../../src/metadata/DockerComposatorPluginMetadata';

import DockerComposatorData from '../../../src/models/DockerComposatorData';
import mockData from '../../resources/veto-full-compose';

describe('Test DockerComposatorPluginParser', () => {
  describe('Test functions', () => {
    describe('Test function: isParsable', () => {
      it('Should return true on .yml file', () => {
        const parser = new DockerComposatorPluginParser();
        const file = new FileInformation({ path: 'simple.yml' });

        expect(parser.isParsable(file)).toEqual(true);
      });

      it('Should return true on .yaml file', () => {
        const parser = new DockerComposatorPluginParser();
        const file = new FileInformation({ path: 'simple.yaml' });

        expect(parser.isParsable(file)).toEqual(true);
      });

      it('Should return false on file that is not a YAML file', () => {
        const parser = new DockerComposatorPluginParser();
        const file = new FileInformation({ path: 'file.txt' });

        expect(parser.isParsable(file)).toEqual(false);
      });

      // it('Should return false on missing file', () => {
      //   const parser = new DockerComposatorPluginParser();
      //   const file = new FileInformation({ path: 'missing_file.yml' });
      //
      //   expect(parser.isParsable(file)).toEqual(false);
      // });

      it('Should return false on wrong file', () => {
        const parser = new DockerComposatorPluginParser();
        const file = new FileInformation({ path: '.github/workflows/simple.tf' });

        expect(parser.isParsable(file)).toEqual(false);
      });
    });

    describe('Test function: parse', () => {
      it('Should set empty components on no input files', () => {
        const pluginData = new DockerComposatorData();
        const parser = new DockerComposatorPluginParser(pluginData);
        parser.parse();

        expect(pluginData.components).not.toBeNull();
        expect(pluginData.components.length).toEqual(0);
      });

      it('Should set empty components on null input files', () => {
        const pluginData = new DockerComposatorData();
        const parser = new DockerComposatorPluginParser(pluginData);
        const file = new FileInput({
          path: '',
          content: null,
        });
        parser.parse([file]);

        expect(pluginData.components).not.toBeNull();
        expect(pluginData.components.length).toEqual(0);
      });

      it('Parse should set valid component', () => {
        const pluginData = new DockerComposatorData();
        const metadata = new DockerComposatorPluginMetadata(pluginData);
        metadata.parse();
        const parser = new DockerComposatorPluginParser(pluginData);
        const file = new FileInput({
          path: './veto-full-compose.yaml',
          content: fs.readFileSync('tests/resources/veto-full-compose.yaml', 'utf8'),
        });
        parser.parse([file]);
        expect(pluginData.components).toEqual(mockData.components);
      });
    });
  });
});
