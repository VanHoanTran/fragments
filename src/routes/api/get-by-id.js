const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
//https://nodejs.org/api/path.html
const path = require('node:path');
//https://www.npmjs.com/package/mime-types
const mime = require('mime-types');
module.exports = async (req, res) => {
  try {
    const {name, ext} = path.parse(req.params.id); 
    logger.debug({ ownerId: req.user, fragmentsId: name, ext: ext }, 'Provided information: ');
    const fragment = await Fragment.byId(req.user, name);
    let data;
    if (!ext) {
      data = await fragment.getData();
      // keep content type as fragment's type
      res.setHeader('Content-Type', fragment.type);
    } else {
      const mimeType = mime.lookup(ext);
      logger.debug({ mimeType: mimeType }, 'mimeType: ');
      logger.debug({ formats: fragment.formats }, 'Convertible types: ');
      if (fragment.formats.includes(mimeType)) {
        data = await fragment.convertData(mimeType);
        // set content type to desiredType
        res.setHeader('Content-Type', mimeType);
        logger.debug(
          { originalType: fragment.mimeType, desiredType: mimeType },
          'Type conversion succeeded: '
        );
      } else {
        logger.debug(
          { originalType: fragment.mimeType, desiredType: mimeType },
          'Type conversion failed: '
        );
        res
          .status(415)
          .json(
            createErrorResponse(
              415,
              `a ${fragment.mimeType} fragment cannot be returned as a ${mimeType}`
            )
          );
      }
    }

    res.status(200).send(data);
  } catch (error) {
    logger.debug({ ownerId: req.user, idExt: req.params.id }, 'Provided information: ');
    res.status(404).json(createErrorResponse(404, 'The fragment does not exist'));
  }
};
