const { validateToken } = require('../../../helpers/shared/jwt');
const { getChannelConfigFromDb } = require('../config/get');

const { getHeaderData } = require('../../../helpers/v1.1/starcraft2/header/index');
const { getLadderData } = require('../../../helpers/v1.1/starcraft2/ladder/index');
// const logging = require('../../../config/shared/logging');

const getSC2Data = async (playerConfig) => {
  // logging.info(`getSC2Data(${playerConfig})`);
  try {
    const headerData = await getHeaderData(playerConfig);
    const ladderData = await getLadderData(playerConfig);

    const sc2data = Promise.all([headerData, ladderData]);
    return sc2data;
  } catch (err) {
    return {
      status: 500,
      message: 'Error getting StarCraft II data',
    };
  }
};

const getViewerData = async (channelId, token) => {
  // logging.info('getViewerData()');
  try {
    if (channelId && token) {
      const isTokenValid = validateToken(channelId, token, 'viewer') || validateToken(channelId, token, 'broadcaster');

      // logging.info(`isTokenValid: ${isTokenValid}`);

      if (isTokenValid) {
        const channelConfig = await getChannelConfigFromDb(channelId);

        // logging.info('channelConfig:');
        // logging.info(channelConfig);

        if (channelConfig) {
          const playerConfig = {
            regionId: channelConfig.regionId,
            realmId: channelConfig.realmId,
            playerId: channelConfig.playerId,
          };

          const viewerData = await getSC2Data(playerConfig);
          const playerData = await viewerData[0];
          const ladderData = await viewerData[1];

          return {
            status: 200,
            ...playerData,
            ...ladderData,
          };
        }
        return {
          status: 404,
          message: 'Account not found',
        };
      }
      return {
        status: 400,
        message: 'Bad request',
      };
    }
    return {
      status: 400,
      message: 'Bad request',
    };
  } catch (error) {
    return {
      status: 500,
      message: 'Error while getting config',
    };
  }
};

module.exports = getViewerData;
