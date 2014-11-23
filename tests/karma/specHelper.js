// Invoked before any describe functions in spec files to 'mock' the configuration
beforeEach(module(function ($provide) {
  $provide.constant('APP_CONFIG', {});
}));