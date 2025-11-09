function createPatchSchema(schema) {
    return schema
      // copy schema and make all keys optional, additionally non 'required' keys get nullable ...
      .fork(Object.keys(schema.describe().keys),
        k => k.describe()?.flags?.presence !== 'required' ? k.optional().allow(null) : k.optional())
      // but require at least one key (and ignore '_id')
      .or(...Object.keys(schema.describe().keys).filter(k => k != '_id'));
  }

  module.exports = {createPatchSchema};