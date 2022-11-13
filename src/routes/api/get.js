// src/routes/api/get.js
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response.js');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */

module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  logger.debug({ query: req.query }, 'Request Query: ');
  let expand;
  expand = req.query.expand && req.query.expand === '1' ? true : false;
  logger.debug({ user: req.user, expand }, 'Information received: ');
  const fragments = await Fragment.byUser(req.user, expand);
  res.status(200).json(
    createSuccessResponse({
      fragments: fragments,
    })
  );
  logger.debug({ fragments }, 'Get successfully: ');
};
