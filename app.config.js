import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      googleApiKey: process.env.GOOGLE_API_KEY,
    },
  };
};
