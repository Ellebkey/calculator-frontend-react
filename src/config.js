let apiUrl = '';

if (process.env.NODE_ENV === 'development') {
  apiUrl = 'http://localhost:4000/api';
} else if (process.env.NODE_ENV === 'production') {
  apiUrl = 'https://apicalculator.joelbarranco.io/api';
}

export { apiUrl };
