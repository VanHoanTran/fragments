// src/routes/api/get.js
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response.js');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */

module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  logger.debug({ query: req.query }, 'Request Query: ');
  let expand;
  try {
    expand = req.query.expand && req.query.expand === '1' ? true : false;
    logger.debug({ expand }, 'Expand: ');
    const fragments = await Fragment.byUser(req.user, expand);
    res.status(200).json(
      createSuccessResponse({
        fragments: fragments,
      })
    );
    logger.debug({ fragments }, 'Get successfully: ');
  } catch (err) {
    logger.debug({ err }, 'Error Message');
    logger.debug({ user: req.user, expand }, 'Information received: ');
    res.status(500).json(createErrorResponse(500, err));
  }
};
