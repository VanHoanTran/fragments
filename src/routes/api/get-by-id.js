const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
module.exports = async (req, res) => {
  try {
    logger.debug(`ownerId=${req.user}, id=${req.params.id}`);
    const fragment = await Fragment.byId(req.user, req.params.id);

    const data = await fragment.getData();
    res.setHeader('Content-Type', fragment.type);
    res.status(200).send(data);
  } catch (error) {
    logger.debug(`ownerId=${req.user}, id=${req.params.id}`);
    res.status(404).json(createErrorResponse(404, 'The fragment does not exist'));
  }
};
