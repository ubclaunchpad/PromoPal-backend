import { defaultUrl } from '@googlemaps/google-maps-services-js/dist/places/details';
import MockAdapter from 'axios-mock-adapter';
import { Status } from '@googlemaps/google-maps-services-js';

/**
 * Wrapper class around MockAdapter to set custom mocking behaviour
 * * To mock axios requests, add a new function and implement the expected response. Then in your test, call the function
 * that was implemented to configure the mock for the respective axios instance.
 * */
export class CustomAxiosMockAdapter extends MockAdapter {
  /**
   * Mock the response for placeDetails
   * */
  mockSuccessfulPlaceDetails(place_id: string) {
    this.onGet(defaultUrl).reply(
      200,
      //region Mocked PlaceDetailsResponseData
      {
        html_attributions: [],
        result: {
          address_components: [
            {
              long_name: '7235',
              short_name: '7235',
              types: ['street_number'],
            },
            {
              long_name: 'Canada Way',
              short_name: 'Canada Way',
              types: ['route'],
            },
            {
              long_name: 'Burnaby',
              short_name: 'Burnaby',
              types: ['locality', 'political'],
            },
            {
              long_name: 'Metro Vancouver',
              short_name: 'Metro Vancouver',
              types: ['administrative_area_level_2', 'political'],
            },
            {
              long_name: 'British Columbia',
              short_name: 'BC',
              types: ['administrative_area_level_1', 'political'],
            },
            {
              long_name: 'Canada',
              short_name: 'CA',
              types: ['country', 'political'],
            },
            {
              long_name: 'V5E 3R7',
              short_name: 'V5E 3R7',
              types: ['postal_code'],
            },
          ],
          adr_address:
            '<span class="street-address">7235 Canada Way</span>, <span class="locality">Burnaby</span>, <span class="region">BC</span> <span class="postal-code">V5E 3R7</span>, <span class="country-name">Canada</span>',
          business_status: 'OPERATIONAL',
          formatted_address: '7235 Canada Way, Burnaby, BC V5E 3R7, Canada',
          formatted_phone_number: '(604) 243-2550',
          geometry: {
            location: {
              lat: 49.224166,
              lng: -122.941719,
            },
            viewport: {
              northeast: {
                lat: 49.22539888029149,
                lng: -122.9402102697085,
              },
              southwest: {
                lat: 49.2227009197085,
                lng: -122.9429082302915,
              },
            },
          },
          icon:
            'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
          international_phone_number: '+1 604-243-2550',
          name: 'MOCK NAME',
          opening_hours: {
            open_now: false,
            periods: [
              {
                close: {
                  day: 0,
                  time: '2200',
                },
                open: {
                  day: 0,
                  time: '1100',
                },
              },
              {
                close: {
                  day: 1,
                  time: '2200',
                },
                open: {
                  day: 1,
                  time: '1100',
                },
              },
              {
                close: {
                  day: 2,
                  time: '2200',
                },
                open: {
                  day: 2,
                  time: '1100',
                },
              },
              {
                close: {
                  day: 3,
                  time: '2200',
                },
                open: {
                  day: 3,
                  time: '1100',
                },
              },
              {
                close: {
                  day: 4,
                  time: '2200',
                },
                open: {
                  day: 4,
                  time: '1100',
                },
              },
              {
                close: {
                  day: 5,
                  time: '2200',
                },
                open: {
                  day: 5,
                  time: '1100',
                },
              },
              {
                close: {
                  day: 6,
                  time: '2200',
                },
                open: {
                  day: 6,
                  time: '1100',
                },
              },
            ],
            weekday_text: [
              'Monday: 11:00 AM – 10:00 PM',
              'Tuesday: 11:00 AM – 10:00 PM',
              'Wednesday: 11:00 AM – 10:00 PM',
              'Thursday: 11:00 AM – 10:00 PM',
              'Friday: 11:00 AM – 10:00 PM',
              'Saturday: 11:00 AM – 10:00 PM',
              'Sunday: 11:00 AM – 10:00 PM',
            ],
          },
          photos: [
            {
              height: 3024,
              html_attributions: [
                '<a href="https://maps.google.com/maps/contrib/110052857674960418921">RIB &amp; CHICKEN</a>',
              ],
              photo_reference:
                'ATtYBwLnRqFOmqRD-2sZIp78WSd8uu8jFy_Lw9qF9DpPCgcqceWOENxAwSoGsTLJdOIlok8k0YTHNZ1rhJprZGxawdYXQw6T8lgo_zvcf67Y59I9Q22HQsAi2LhAkAMi_wGs9FrOSDbOcNYNmTfEsjm7K3qxELrK0pJzoNNkhdl-Dy6Qb9I9',
              width: 4032,
            },
            {
              height: 292,
              html_attributions: [
                '<a href="https://maps.google.com/maps/contrib/110052857674960418921">RIB &amp; CHICKEN</a>',
              ],
              photo_reference:
                'ATtYBwLGBWI-QxfPsFQovQlNRTSjiAwYNo9loZn-talf1YzS2wt7wmprkXiHK8Ru4OZLOUOvuHlOfFh9Lp25OCUSghenmfYGr6W6Ls4q24sSGobAdE7wdcRfMk7B-5-UhE8BZ6hSxMyfxephwrTsSBg8uFsgaJbFG3F8-SpGsL6Q-s2FWATq',
              width: 487,
            },
            {
              height: 3024,
              html_attributions: [
                '<a href="https://maps.google.com/maps/contrib/106175414507302701401">Bangshoong</a>',
              ],
              photo_reference:
                'ATtYBwI8aZj_gOIpHWb5qGGsLQS66aSUXETzv5A2-PGg9lm84Yw-PjPV92BrqBMeesCxMKZBr8WWWMyEQM3t8A451A5Z-mI-2QFLIrOJPoCJ0jBQ8mTBsaH0PzgE-XdZgkOf5q4t3xRb9tKF4EM8ekIF5OBanEJZp4LSoYdBnjotWE7Tmm5E',
              width: 4032,
            },
            {
              height: 960,
              html_attributions: [
                '<a href="https://maps.google.com/maps/contrib/108772688875896988607">THE BOI</a>',
              ],
              photo_reference:
                'ATtYBwJrCwkDe8_zl5yWQ5DaWRqn1zilhlvKZeVmIfuURnRR8jKcs2AH2xmOLmeAQeOmiGryPNSTS488E6IP_ON2OY5CVK5FB_fPqlZWd2AXWOu5QHxClEzfMglojYpSw-SgQzHMIYCnczEmiGYGqQw8fVQ3x7969WftYtrMSxbJfydHYkO8',
              width: 1280,
            },
            {
              height: 4032,
              html_attributions: [
                '<a href="https://maps.google.com/maps/contrib/115656490737835749939">haan L</a>',
              ],
              photo_reference:
                'ATtYBwKsUGBCX-QvMweEJfj0HE81uNAVbJcJ6OzEL1Z1JJaeZyMf0p4vyPwqNk8QEUWRCKeiP5L2tHlgw27QPt05HNpPXdm4dBWcoCwTvR4_sNYkm36gs0mOrjWca77797Ca1WoZ_V9ccOYmZ564tMOgCr0z-eJe_uYUPs9JhqUPrwK8KpFf',
              width: 3024,
            },
            {
              height: 444,
              html_attributions: [
                '<a href="https://maps.google.com/maps/contrib/106262850985468371564">James Ting</a>',
              ],
              photo_reference:
                'ATtYBwKXAFKBR2aDtB0AnQxfwngMdK8SsP_emjyCGKCz6ynwqJSbiwx4XKiX6kf4hyoLTYRTANjSMGHBoADvcOiN3VuWNQg3Cc_t4w7Uod6-iYP42fNdFeiPnmJge9kX23SWyRgYnXluep4JVtnRFd_wgeq98M8myPG8TwoXJ1y4ln7ScTBE',
              width: 671,
            },
            {
              height: 567,
              html_attributions: [
                '<a href="https://maps.google.com/maps/contrib/110429535549061741595">Penny Rusty Sophie</a>',
              ],
              photo_reference:
                'ATtYBwL30JOOCVRy-FRh5Gmvs1J6KAk9GmEKY39Z_FBuEPAZLyeXRla8OLDIzrXElx3AeVES83-DT2qtDKF_HDJdluEFThoji03UZqbCrQxOqSQdLTgZfPKHPAIBCVv-3rbc6711YzY38PCT0Nlaq2aSM4IQLDp4tYANERVSrVvzQxXCYQ8J',
              width: 1008,
            },
            {
              height: 495,
              html_attributions: [
                '<a href="https://maps.google.com/maps/contrib/110052857674960418921">RIB &amp; CHICKEN</a>',
              ],
              photo_reference:
                'ATtYBwIMczGKSQ8lWhNBpbnN7mnUbYQcF83jUjYTN-nf4521DwpZZQqnzh8v_6a66Py40i5yFJNIN9vEd1ih9yxTX9NMJTuKthoYH3Q72_GC-aMFpU4QMRk4CKX5C6XNy2kILX8EDX3JzZ_zAJnFO_ClNfUlDDpoGiPusMTU_gC3EmyXig2J',
              width: 656,
            },
            {
              height: 1242,
              html_attributions: [
                '<a href="https://maps.google.com/maps/contrib/116617682201655821063">D TOM</a>',
              ],
              photo_reference:
                'ATtYBwLwHY2hJiR-_-ciBWy6_cNcupu2XxUoLFX_Djib5I_reKKMS97-MiJRMI62k4WO-uhbhZlLmLKtIV3QP3b2eagqAmFUsLk2sdnAVROoY_8AVC7z3NYeo98VloetqLlOq8D3E1jCor6ienbv1iMkf0HtWt-BCPKV0Nm-o1lapq_cFPG2',
              width: 1242,
            },
            {
              height: 961,
              html_attributions: [
                '<a href="https://maps.google.com/maps/contrib/100915268163315980154">Yuya L</a>',
              ],
              photo_reference:
                'ATtYBwK58gDCj9Gy73S20rEdwAd8nuofHRjnVU5ErpJBK8iEDiwXAKrxrLAssl_4_LLuamW4hQenRKs8HXbQaSp4aLMabKPIf-9CPqvp7ec9l6sPn7qJnho0G7DlK1IpS-M6MTiNG24hHegv7cm9OeUOG6nU8WxxvBJ3-YAAsNSvsI11sVOl',
              width: 721,
            },
          ],
          place_id,
          plus_code: {
            compound_code: '63F5+M8 Burnaby, BC, Canada',
            global_code: '84XV63F5+M8',
          },
          rating: 4.6,
          reviews: [
            {
              author_name: 'Robert R',
              author_url:
                'https://www.google.com/maps/contrib/106791507496093347654/reviews',
              language: 'en',
              profile_photo_url:
                'https://lh3.googleusercontent.com/-by3vEEdq49E/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclgzhvDvWIGEWBmm-wgf0A0IBLgfA/s128-c0x00000000-cc-rp-mo-ba2/photo.jpg',
              rating: 5,
              relative_time_description: 'in the last week',
              text:
                "This food was OUTRAGEOUSLY good, the fried chicken is easily a top 3 fried chicken I've ever had. The ribs were a perfect duo for their flawless chicken, I wouldn't order the ribs alone though. The chicken far outweighs the ribs but man that was incredible. Each bite was so juicy and amazing. You can really tell how hard they work to produce consistent product like that. Highly highly recommend.\n\nAlso side note, they send so many sides and salads with online orders. It's a breath of fresh air in a world of greed. I'd give this restaurant 10/5 if possible. Truly a great experience.",
              time: 1613792873,
            },
            {
              author_name: 'S J',
              author_url:
                'https://www.google.com/maps/contrib/106030359247950017747/reviews',
              language: 'en',
              profile_photo_url:
                'https://lh5.googleusercontent.com/-JbRXr4UDJsM/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnzwlQvs9_CUzQ0Y8XQeMpXG4TqOQ/s128-c0x00000000-cc-rp-mo/photo.jpg',
              rating: 5,
              relative_time_description: 'a month ago',
              text:
                'After an ordering mishap I sent an email expressing my dismay, not really expecting a response, but very quickly I received a sincere apology and an  invitation  to give them another try. I am definitely glad to have gone back and finally try their delicious offerings! The staff was gracious and we truly appreciated the fantastic customer service. I highly recommend paying Rib & Chicken a visit for delicious food and great service! 잘 먹겠습니다',
              time: 1611462980,
            },
            {
              author_name: 'SORA LIM',
              author_url:
                'https://www.google.com/maps/contrib/115629718177213111074/reviews',
              language: 'en',
              profile_photo_url:
                'https://lh3.googleusercontent.com/a-/AOh14GjGiq-zM2kKTZrRS3OhLHCPv6dk_6meXjCGKTwdYA=s128-c0x00000000-cc-rp-mo-ba3',
              rating: 4,
              relative_time_description: '2 months ago',
              text:
                'Crispy, juicy and moist fried chicken. I can see that they are using the clean oil for making fried chicken. But, there are a bit of fried dough, not the chicken and the one piece is pretty big, hoping that it would be a just one bite size. Other than that, the staffs are friendly and fast ready for pick up. I definitely would like to order again later.',
              time: 1606809446,
            },
            {
              author_name: 'Chaewon Kim',
              author_url:
                'https://www.google.com/maps/contrib/105237780839206869607/reviews',
              language: 'en',
              profile_photo_url:
                'https://lh3.googleusercontent.com/a-/AOh14GhiCelp8IY_vD7-x2wtRnX2XI_7mNVUPilyk147UQ=s128-c0x00000000-cc-rp-mo',
              rating: 5,
              relative_time_description: 'in the last week',
              text:
                'THE BEST CHICKEN EVER!!\ndefinitely gonna come here regularly\nEvery menu comes with so many side dishes.\nlove it :D',
              time: 1613892187,
            },
            {
              author_name: 'Darren Sutton',
              author_url:
                'https://www.google.com/maps/contrib/105476603778596274534/reviews',
              language: 'en',
              profile_photo_url:
                'https://lh3.googleusercontent.com/-Jr0TmdEAAmQ/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclQ9DyDodvfkWHm-C21ODKGWJciPA/s128-c0x00000000-cc-rp-mo/photo.jpg',
              rating: 5,
              relative_time_description: 'a month ago',
              text:
                'The fried chicken was delicious. We ordered the family size half and half and the portion size was good. The dry garlic and regular were both great, the dipping sauce was tasty too. My only complaint is that the dry garlic flavour was a bit too sweet.',
              time: 1609376113,
            },
          ],
          types: [
            'restaurant',
            'meal_takeaway',
            'food',
            'point_of_interest',
            'establishment',
          ],
          url: 'https://maps.google.com/?cid=77286563717231905',
          user_ratings_total: 104,
          utc_offset: -480,
          vicinity: '7235 Canada Way, Burnaby',
          website: 'https://www.ribandchicken.ca/',
        },
        status: 'OK',
        error_message: '',
      }
      //endregion
    );
  }

  /**
   * Mock invalid request response for place Details
   * * Note: Invalid Request response are still status code 200
   * */
  mockInvalidRequestPlaceDetails() {
    this.onGet(defaultUrl).reply(200, {
      html_attributions: [],
      status: Status.INVALID_REQUEST,
    });
  }
}
