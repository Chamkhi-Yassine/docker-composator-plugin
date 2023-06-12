import DockerComposatorPluginRenderer from '../../../src/render/DockerComposatorPluginRenderer';
import pluginData from '../../resources/testData';

describe('DockerComposatorPluginRenderer', () => {
  let renderer;

  beforeEach(() => {
    renderer = new DockerComposatorPluginRenderer(pluginData);
  });

  it('should render files correctly', () => {
    const files = renderer.renderFiles();

    // Assert the number of rendered files
    expect(files.length).toBe(1);

    // Assert the file properties
    const [file] = files;
    expect(file.path).toBe('./veto-full-compose.yaml');
    // Add more assertions for the file content if needed
  });

  it('should format a Docker Compose component correctly', () => {
    const component = pluginData.components.find(
      (comp) => comp.id === 'veto-full-compose'
    );

    const formattedComponent = renderer.formatComponent(component);

    // Add assertions to validate the formatted Docker Compose component
   
    expect(formattedComponent.version).toBe('3.9');
  });

  it('should format a Service component correctly', () => {
    const component = pluginData.components.find(
      (comp) => comp.id === 'database'
    );

    const formattedComponent = renderer.formatComponent(component);

    // Add assertions to validate the formatted Service component
    // Example assertions:
    expect(formattedComponent).toBeDefined();
    expect(formattedComponent).toBeDefined();
    expect(formattedComponent.image).toEqual('postgres');
    expect(formattedComponent.environment).toEqual(['POSTGRES_USER=admin', 'POSTGRES_PASSWORD=${DATABASE_PASSWORD}']);
    expect(formattedComponent.ports).toEqual(['5432:5432']);
    expect(formattedComponent.networks).toEqual(['backend']);
    expect(formattedComponent.volumes).toEqual(['data']);
    

    // Add more assertions as needed
  });

  it('should format a depends on in a Service component correctly', () => {
    const component = pluginData.components.find(
      (comp) => comp.id === 'front'
    );

    const formattedComponent = renderer.formatComponent(component);

  
    expect(formattedComponent).toBeDefined();
    expect(formattedComponent.depends_on).toEqual({"database": {"condition": "service_healthy"}});
    
    // Add more assertions as needed
  });



  it('should format a Network component correctly', () => {
    const component = pluginData.components.find(
      (comp) => comp.id === 'backend'
    );

    const formattedComponent = renderer.formatComponent(component);

    expect(formattedComponent).toBeDefined();
    expect(formattedComponent).toBeDefined();
    expect(formattedComponent.driver).toEqual('custom-driver-one');
    
  });

  it('should format a Volume component correctly', () => {
    const component = pluginData.components.find(
      (comp) => comp.id === 'data'
    );

    const formattedComponent = renderer.formatComponent(component);

    expect(formattedComponent).toBeDefined();
    expect(formattedComponent.driver).toEqual('data-driver-one');
    
  });

  it('should format a Config component correctly', () => {
    const component = pluginData.components.find(
      (comp) => comp.id === 'config_database_config'
    );

    const formattedComponent = renderer.formatComponent(component);

    // Add assertions to validate the formatted Config component
    expect(formattedComponent).toBeDefined();
    expect(formattedComponent).toBeDefined();
    expect(formattedComponent.file).toEqual('./configs/config_server_config.yml');
    expect(formattedComponent.external).toEqual(true);
  
  });

  it('should format a Secret component correctly', () => {
    const component = pluginData.components.find(
      (comp) => comp.id === 'databse-secret'
    );

    const formattedComponent = renderer.formatComponent(component);

    expect(formattedComponent).toBeDefined();
    expect(formattedComponent).toBeDefined();
    expect(formattedComponent.file).toEqual('./secrets/secret_database.yml');
    expect(formattedComponent.external).toEqual(true);
    

  });

  it('should format a component without children gracefully', () => {
    const componentWithoutChildren = {
      id: 'componentWithoutChildren',
      attributes: [],
    };

    const formattedComponent = renderer.formatComponent(componentWithoutChildren);

    expect(formattedComponent.services).toBeUndefined();
    expect(formattedComponent.volumes).toBeUndefined();
    expect(formattedComponent.networks).toBeUndefined();
    expect(formattedComponent.configs).toBeUndefined();
    expect(formattedComponent.secrets).toBeUndefined();
  
  });
  


});
