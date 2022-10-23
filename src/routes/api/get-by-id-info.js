const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
module.exports = async (req, res) => {
  try {
    const frag = await Fragment.byId(req.user, req.params.id);

    if (!frag) {
      return res.status(404).json(createErrorResponse(404, 'Theres no fragment with this id'));
    }
    res.status(200).json(
      createSuccessResponse({
        fragment: frag,
      })
    );
  } catch (e) {
    res.status(500).json(createErrorResponse(500, e.message));
  }
};
