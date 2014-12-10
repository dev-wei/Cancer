'use strict';
describe('Dependencies resolving', function () {
  describe('jquery', function () {
    it('should be able to resolve by name', function () {
      expect(require('jquery')).toBeDefined();
    });

    it('should be able to get by alias', function () {
      expect($).toBeDefined();
    });
  });

  describe('angular', function () {
    it('should be able to resolve by name', function () {
      expect(require('angular')).toBeDefined();
    });

    it('should be able to get by alias', function () {
      expect(angular).toBeDefined();
    });
  });

  describe('angular-deferred-bootstrap', function () {
    it('should be able to resolve by name', function () {
      expect(require('angular-deferred-bootstrap')).toBeDefined();
    });

    it('should be able to get by alias', function () {
      expect(deferredBootstrapper).toBeDefined();
    });
  });

  describe('modernizr', function () {
    it('should be able to resolve by name', function () {
      expect(require('modernizr')).toBeDefined();
    });

    it('should be able to resolve by name', function () {
      expect(Modernizr).toBeDefined();
    });
  });

  describe('d3', function () {
    it('should be able to resolve by name', function () {
      expect(require('d3')).toBeDefined();
    });

    it('should be able to resolve by name', function () {
      expect(d3).toBeDefined();
    });
  });

  describe('leaflet', function () {
    it('should be able to resolve by name', function () {
      expect(require('leaflet')).toBeDefined();
    });

    it('should be able to resolve by name', function () {
      expect(L).toBeDefined();
    });
  });
});