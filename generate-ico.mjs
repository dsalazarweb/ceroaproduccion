import sharp from 'sharp';

sharp('public/favicon.svg')
  .resize(32, 32)
  .png()
  .toFile('public/favicon.ico')
  .then(() => console.log('favicon.ico generated'))
  .catch(err => console.error('Error generating favicon:', err));
