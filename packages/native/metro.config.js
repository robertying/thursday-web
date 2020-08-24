const path = require('path');

module.exports = {
  watchFolders: [path.resolve(__dirname, '../../node_modules')],
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
};
