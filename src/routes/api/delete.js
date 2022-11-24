const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
module.exports = async (req, res) => {
  logger.debug({ User: req.user, Id: req.params.id }, 'Delete Request: ');
  const id = req.params.id.split('.')[0];
  try {
    await Fragment.delete(req.user, id);
    res.status(200).json(createSuccessResponse());
  } catch (err) {
    logger.debug({ fragmentsId: req.params.id }, 'Fragment not found: ');
    logger.debug({ err }, 'Error Message');
    return res
      .status(404)
      .json(createErrorResponse(404, 'There is no fragment related to this id'));
  }
};
