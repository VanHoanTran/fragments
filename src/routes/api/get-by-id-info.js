const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');
module.exports = async (req, res) => {
  try {
    logger.debug({ ownerId: req.user, fragmentsId: req.params.id }, 'Provided information: ');
    const frag = await Fragment.byId(req.user, req.params.id);
    if (!frag) {
      logger.debug({ fragmentsId: req.params.id }, 'Fragment not found: ');
      return res
        .status(404)
        .json(createErrorResponse(404, 'Theres no fragment related to this id'));
    }
    res.status(200).json(
      createSuccessResponse({
        fragment: frag,
      })
    );
  } catch (err) {
    logger.debug({ err }, 'Error Message');
    logger.debug({ ownerId: req.user, fragmentsId: req.params.id }, 'Information received: ');
    res.status(500).json(createErrorResponse(500, err.message));
  }
};
