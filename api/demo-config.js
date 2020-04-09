/**
 * Zeit serverless function, available at linkdash.now.sh/api/demo-config
 */
const demoConfig = require(path.resolve(__dirname, "../demo/demo.config.js"))();

module.exports = (req, res) => {
  res.status(200).send(demoConfig);
};
