module.exports = {
    nutritionix: {
      baseUrl: 'https://trackapi.nutritionix.com/v2',
      endpoints: {
        nutrients: '/natural/nutrients',
        instantSearch: '/search/instant',
        exercise: '/natural/exercise'
      },
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': process.env.NUTRITIONIX_APP_ID,
        'x-app-key': process.env.NUTRITIONIX_APP_KEY
      }
    }
  };