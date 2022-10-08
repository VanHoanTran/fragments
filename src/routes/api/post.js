// src/routes/api/post.js

const {createErrorResponse, createSuccessResponse} = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
/**
 * Post a list of fragments for the current user
 */

 const API_URL = process.env.API_URL;

 
module.exports = async  (req, res) => {
    // TODO: this is just a placeholder to get something working...
  if (!Buffer.isBuffer(req.body)) {
    logger.debug({ data: req.body}, ' is not a Buffer');
    return res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
  }


  try{
    logger.info({'content-type':req.get('Content-Type')})
    const fragment = new Fragment(
      {
        ownerId: req.user,
        type: req.get('Content-Type') 
      }
    );

    await fragment.save();

    await fragment.setData(req.body);
    
    res.set('content-type', fragment.type);
    res.set('Location', `${API_URL}/v1/fragments/${fragment.id}`);
    
    logger.info(createSuccessResponse({fragment : fragment}));
    res.status(201).json(
      createSuccessResponse({fragment : fragment})
    );
  }
  catch(err){
    logger.error({err});
    res.status(500).json(createErrorResponse(500, err));
  }


  };


