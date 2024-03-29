// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

//https://www.npmjs.com/package/markdown-it
var md = require('markdown-it')({
  html: true,
});

const sharp = require('sharp');

const validTypes = [
  `text/plain`,
  `text/markdown`,
  `text/html`,
  `application/json`,
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,
];

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!type || !ownerId) {
      throw new Error(`ownerId and type are required, got type=${type}, got ownerId=${ownerId}`);
    }

    if (!Fragment.isSupportedType(type)) {
      throw new Error(`unsupported type, got type=${type}`);
    }

    if (typeof size != 'number' || size < 0) {
      throw new Error(`size must be 0 or a positive number, got size=${size}`);
    }

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // TODO
    const fragments = await listFragments(ownerId, expand);
    if (expand || !fragments) {
      return fragments.map((fragment) => new Fragment(fragment));
    } else {
      return fragments;
    }
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    // TODO
    const fragment = await readFragment(ownerId, id);
    if (!fragment) throw new Error(`OwnerId =${ownerId} Not Found!`);
    return new Fragment(fragment);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    // TODO
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    // TODO
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    // TODO
    //this.updated = new Date().toISOString();
    this.size = data.byteLength;
    this.save();
    return await writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * convert the fragment's data to convertible type of fragment's data
   * @param {string} convertible_type
   * @returns {Buffer} converted data
   */
  async convertData(convertingType) {
    let data = await this.getData();
    if (this.mimeType != convertingType) {
      if (this.mimeType === 'text/markdown' && convertingType === 'text/html') {
        data = md.render(data.toString());
        data = Buffer.from(data);
      } else if (convertingType === 'image/webp') {
        data = await sharp(data).webp().toBuffer();
      } else if (convertingType === 'image/png') {
        data = await sharp(data).png().toBuffer();
      } else if (convertingType === 'image/gif') {
        data = await sharp(data).gif().toBuffer();
      } else if (convertingType === 'image/jpeg') {
        data = await sharp(data).jpeg().toBuffer();
      } else {
        data = this.getData();
      }
    }
    return data;
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.mimeType.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // TODO
    let convertedTypes = [];
    if (this.mimeType === 'text/plain') {
      convertedTypes = ['text/plain'];
    } else if (this.mimeType === 'text/markdown') {
      convertedTypes = ['text/plain', 'text/html', 'text/markdown'];
    } else if (this.mimeType === 'text/html') {
      convertedTypes = ['text/plain', 'text/html'];
    } else if (this.mimeType === 'application/json') {
      convertedTypes = ['text/plain', 'application/json'];
    } else {
      convertedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    }
    return convertedTypes;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // TODO
    const { type } = contentType.parse(value);
    return validTypes.includes(type);
  }
}

module.exports.Fragment = Fragment;
