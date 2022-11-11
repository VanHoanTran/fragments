const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
//https://www.npmjs.com/package/mime-types
const mime = require('mime-types');
module.exports = async (req, res) => {
  try {
    const idExt = req.params.id.split('.');
    const id = idExt[0];
    const ext = idExt[1]; //.md, .txt, .json, etc.
    logger.debug({ ownerId: req.user, fragmentsId: id, ext: ext }, 'Provided information: ');
    const fragment = await Fragment.byId(req.user, id);
    let data;
    if (!idExt[1]) {
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
