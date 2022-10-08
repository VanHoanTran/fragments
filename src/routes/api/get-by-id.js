const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    res.status(200).json(
      createSuccessResponse({
        fragment: fragment,
      })
    );
  } catch (error) {
    logger.debug(`ownerId=${req.user}, id=${req.params.id}`);
    return res.status(404).json(createErrorResponse(404, 'The fragment does not exist'));
  }
};
