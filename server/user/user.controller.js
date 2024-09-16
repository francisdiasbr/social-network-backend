import BaseController from "../base/controller.js";

import User from "./user.model.js";
import { saveUser } from "./user.service.js";

class UserController extends BaseController {

    constructor() {
      super('UserId', User);
    }
  
    async create(req, res, next) {
      const newUser = new User({
        ...req.body,
        isAdmin: false,
        isActive: true
      });
  
      return await saveUser(newUser, req, res, next);
    }
}

export default UserController;