require('dotenv').config()

module.exports = {
  env: {
    GRAPHCMS_ENDPOINT: process.env.GRAPHCMS_ENDPOINT,
    GRAPHCMS_TOKEN: process.env.GRAPHCMS_TOKEN,
    USERBASE_APP_ID: process.env.USERBASE_APP_ID,
  },
}
