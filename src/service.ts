/** src/service.ts */
const MercadolibreService = require('../MercadoLibreService/MercadolibreService.js')

/**
 * Singleton class that holds the external service instance
 */
class Service {
  instance: any;

  constructor() {
    this.instance = new MercadolibreService()
  }
}

module.exports = new Service()