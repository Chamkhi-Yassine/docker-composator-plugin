import { DefaultParser } from 'leto-modelizer-plugin-core';

/**
 * Template of plugin parser.
 */
class DockerComposatorPluginParser extends DefaultParser {
  isParsable(fileInformation) {
    /*
     * Implement this to indicate which fileInformation your provider can manage.
     *
     * You just have to return a Boolean to say if your parser can manage the file or not.
     *
     * By default, this function return false only on null/undefined fileInformation.
     */
    return super.isParsable(fileInformation);
  }

  parse(inputs = []) {
    /*
     * Implement your own parse function here.
     *
     * You receive in `inputs` a list of content file.
     *
     * In our plugin managing the terraform files, we use antlr for parsing. You can find an example
     * of the terraform parser in https://github.com/ditrit/iactor/blob/dev/src/parser/TerraformParser.js.
     */
    this.pluginData.components = [];
    this.pluginData.parseErrors = [];
  }
}

export default DockerComposatorPluginParser;
