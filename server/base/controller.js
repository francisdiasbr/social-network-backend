import mongoose from 'mongoose';
import _ from 'lodash';

class Controller {
  constructor(namespace, model) {
    this.namespace = namespace;
    this.model = model;
  }

  attachGetRequestParams(req) {
    if (req.method !== 'GET') {
      return;
    }

    req.body = {
      ...req.body,
      ...req.query
    };
  }

  load(req, res, next, id) {
    this.model.get(id)
      .then((data) => {
        req[this.namespace] = data; // eslint-disable-line no-param-reassign
        return next();
      })
      .catch(e => next(e));
  }

  get(req, res) {
    return res.json(req[this.namespace]);
  }

  create(req, res, next) {
    let body = _.get(req, 'body', {});
    // const userId = _.get(req, 'user._id', null);

    // if (this.attachCreator && userId) {
      body = {
        ...body,
        // createdBy: mongoose.Types.ObjectId(userId)
      };
    // }

    this.model.create(body, (err, object) => {
      if (err) {
        next(err);
        return;
      }
      res.json({
        ...object._doc,
        ok: true
      });
    });
  }

  update(req, res, next) {
    let body = _.get(req, 'body', {});
    // const userId = _.get(req, 'user._id', null);

    if (body._id) {
      delete body._id;
    }

    // if (this.attachCreator && userId) {
      body = {
        ...body,
        // modifiedBy: mongoose.Types.ObjectId(userId)
      };
    // }

    const model = req[this.namespace];
    model.update({ ...body })
      .then(r => res.json(r))
      .catch(e => next(e));
  }

  patch(req, res, next) {
    let body = _.get(req, 'body', {});
    // const userId = _.get(req, 'user._id', null);

    let currentData = req[this.namespace];
    currentData = currentData ? currentData.toObject() : {};

    body = _.extend(currentData, body);

    // if (this.attachCreator && userId) {
      body = {
        ...body,
        // modifiedBy: mongoose.Types.ObjectId(userId)
      };
    // }

    if (body._id) {
      delete body._id;
    }

    const model = req[this.namespace];

    model.update({ ...body })
      .then(r => res.json(r))
      .catch(e => next(e));
  }

  list(req, res, next) {
    const { filters, sorters } = req.query;
    this.model.list(sorters)
      .then(list => res.json({ index: filters, items: list }))
      .catch(e => next(e));
  }

  listActives(req, res, next) {
    const { filters, sorters } = req.query;
    this.model.listActives(sorters)
      .then(list => res.json({ index: filters, items: list }))
      .catch(e => next(e));
  }

  listFilter(req, res, next) {
    this.attachGetRequestParams(req);
    let { filters, sorters = {} } = req.body;
    let options = {
      offset: sorters.skip || 0,
      limit: sorters.limit || 10,
      sort: sorters.sort
    };

    if (sorters.populate) {
      options.populate = sorters.populate;
    }

    if (this.listSchema) {
      options.select = this.listSchema;
    }

    if (this.logicalDeletion) {
      filters.isDeleted = false;
    }

    const query = this.model.paginate(filters, options);

    query.then(r => {
      let result = {
        index: {
          total: r.total,
          limit: r.limit,
          skip: r.offset
        },
        items: r.docs
      };
      res.json(result);
    })
      .catch(e => next(e));
  }

  remove(req, res, next) {
    if (this.logicalDeletion) {
      return this.logicalRemove(req, res, next);
    }

    const model = req[this.namespace];
    model.remove()
      .then(deleted => res.json(deleted))
      .catch(e => next(e));
  }

  logicalRemove(req, res, next) {
    const model = req[this.namespace];

    // deleção lógica
    model.update({ isDeleted: true })
      .then(r => res.json(r))
      .catch(e => next(e));
  }
}

export default Controller;
