import { RestaurantValidation } from '../../main/validation/RestaurantValidation';

describe('Unit tests for RestaurantValidation', function () {
  // mark these types as any so that we can make them improper
  let restaurantDTO: any;

  beforeEach(() => {
    restaurantDTO = {
      name: 'Sample restaurant name',
      address: '3012 Sample Ave, Vancouver BC',
      lat: 0.99,
      lon: 0.11,
    };
  });

  test('Should return no errors for a valid restaurantDTO', async () => {
    try {
      await RestaurantValidation.schema.validateAsync(restaurantDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should fail if undefined', async () => {
    try {
      await RestaurantValidation.schema.validateAsync(undefined, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"value" is required');
    }
  });

  test('Should fail if address is undefined', async () => {
    try {
      restaurantDTO.address = undefined;
      await RestaurantValidation.schema.validateAsync(restaurantDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"address" is required');
    }
  });

  test('Should fail if name is undefined', async () => {
    try {
      restaurantDTO.name = undefined;
      await RestaurantValidation.schema.validateAsync(restaurantDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"name" is required');
    }
  });

  test('Should fail if lat is undefined', async () => {
    try {
      restaurantDTO.lat = undefined;
      await RestaurantValidation.schema.validateAsync(restaurantDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"lat" is required');
    }
  });

  test('Should fail if lat is greater than 90', async () => {
    try {
      restaurantDTO.lat = 90.001;
      await RestaurantValidation.schema.validateAsync(restaurantDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"lat" must be less than or equal to 90'
      );
    }
  });

  test('Should fail if lat is less than -90', async () => {
    try {
      restaurantDTO.lat = -90.001;
      await RestaurantValidation.schema.validateAsync(restaurantDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"lat" must be greater than or equal to -90'
      );
    }
  });

  test('Should pass if lat is in valid range of -90 to 90', async () => {
    try {
      restaurantDTO.lat = 45;
      await RestaurantValidation.schema.validateAsync(restaurantDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should fail if lon is undefined', async () => {
    try {
      restaurantDTO.lon = undefined;
      await RestaurantValidation.schema.validateAsync(restaurantDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual('"lon" is required');
    }
  });

  test('Should fail if lon is greater than 180', async () => {
    try {
      restaurantDTO.lon = 180.5;
      await RestaurantValidation.schema.validateAsync(restaurantDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"lon" must be less than or equal to 180'
      );
    }
  });

  test('Should fail if lon is less than 180', async () => {
    try {
      restaurantDTO.lon = -180.5;
      await RestaurantValidation.schema.validateAsync(restaurantDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(1);
      expect(e.details[0].message).toEqual(
        '"lon" must be greater than or equal to -180'
      );
    }
  });

  test('Should pass if lon is in valid range of -180 to 180', async () => {
    try {
      restaurantDTO.lon = 100;
      await RestaurantValidation.schema.validateAsync(restaurantDTO, {
        abortEarly: false,
      });
    } catch (e) {
      fail('Should not have failed: ' + e);
    }
  });

  test('Should fail if any fields are the wrong type', async () => {
    try {
      restaurantDTO = {
        name: 1,
        address: true,
        lat: 'hello',
        lon: '0.11',
      };
      await RestaurantValidation.schema.validateAsync(restaurantDTO, {
        abortEarly: false,
      });
      fail('Should have failed');
    } catch (e) {
      expect(e.details.length).toEqual(4);
      expect(e.details[0].message).toEqual('"lat" must be a number');
      expect(e.details[1].message).toEqual('"lon" must be a number');
      expect(e.details[2].message).toEqual('"name" must be a string');
      expect(e.details[3].message).toEqual('"address" must be a string');
    }
  });
});
