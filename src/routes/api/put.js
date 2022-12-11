// src/routes/api/put.js

const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
/**
 * update data for a fragment
 */


module.exports = async (req, res) => {

  const incomingType = req.get('Content-Type');
  try{
      const fragment = await Fragment.byId(req.user, req.params.id);
      logger.debug({incoming: incomingType, existing: fragment.type}, ' Data Type Comparison: ');
        if(incomingType != fragment.type){
            logger.debug({incoming: incomingType ,existing: fragment.type}, ' Fragment type missed match');
            return res.status(400).json(createErrorResponse(400, 'Fragment type missed match. Tt should be a ' + fragment.type));
        }
        await fragment.setData(req.body);
        // get the fragment from database
        var frag = await Fragment.byId(req.user, req.params.id);
        var returnFragment = {...frag, formats: frag.formats}; 
        logger.debug({returnFragment}, ' Fragment returning: ');
    }
    catch(err){
        logger.info({ err }, 'Fragment not found');
        return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    res.status(200).json(
      createSuccessResponse({
        fragment: returnFragment,
      })
    );
    logger.debug(createSuccessResponse({ fragment: returnFragment }), 'Fragment successfully updated');
};
