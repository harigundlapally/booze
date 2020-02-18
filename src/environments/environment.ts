// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backendUrl: 'http://localhost:3000',
  paypal : {
    currency : 'USD',
    clientId : 'ASXTTFIvh-qcSJFspSXg2GwHZzb_BEIxYq0HrVJjqRCIUCkIxYvXG1LBo4wEnII6f91uQ2YntRGL6NKP'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
