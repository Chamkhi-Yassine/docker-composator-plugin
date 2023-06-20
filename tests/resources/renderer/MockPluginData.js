import DockerComposatorComponent from 'src/models/DockerComposatorComponent';

export default class MockPluginData {
  getChildren(id) {
    return [
      new DockerComposatorComponent({
        id,
        definition: {
          type: 'WrongType',
        },
      }),
    ];
  }
}
