var adalConfig = {
  tenant: 'common',
  clientId: '4f33a9aa-6eb6-44d0-9822-cd9bdf519b9c',
  extraQueryParameter: 'nux=1',
  disableRenewal: true,
  endpoints: {
    'https://graph.microsoft.com': 'https://graph.microsoft.com'
  }
  // cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost. 
};

module.exports = adalConfig;