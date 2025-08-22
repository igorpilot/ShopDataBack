import UserService from "../service/user-service.js";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/api-error.js";

class UserController {
  async registration(req, res, next) {
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return next(
      //     ApiError.BadRequest("Помилка при валідації", errors.array()),
      //   );
      // }

      const { formData } = req.body;
      const userData = await UserService.registration(formData);
      const cookieName = formData.customerStoreId
        ? `refreshTokenStore_${formData.customerStoreId}`
        : "refreshTokenAdmin";
      res.cookie(cookieName, userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      });
      return res.json(userData);
    } catch (e) {
      console.error("❌ Помилка в UserController.registration():", e);
      next(e);
    }
  }
  async login(req, res, next) {
    try {
      const { formData } = req.body;
      const userData = await UserService.login(formData);
      const cookieName = formData.customerStoreId
        ? `refreshTokenStore_${formData.customerStoreId}`
        : "refreshTokenAdmin";
      res.cookie(cookieName, userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      });
      return res.status(200).json(userData);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { storeId } = req.query;
      const cookieName = storeId
        ? `refreshTokenStore_${storeId}`
        : "refreshTokenAdmin";
      const refreshToken = req.cookies[cookieName];
      const token = await UserService.logout(refreshToken);
      res.clearCookie(cookieName);
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await UserService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const { storeId } = req.query;
      const cookieName = storeId
        ? `refreshTokenStore_${storeId}`
        : "refreshTokenAdmin";
      const refreshToken = req.cookies[cookieName];
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not provided" });
      }
      const userData = await UserService.refresh(refreshToken, storeId);
      res.cookie(cookieName, userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      return res.json(userData);
    } catch (e) {
      console.error("❌ Помилка при оновленні токену:", e);
      next(e);
    }
  }
  async forgotPassword(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Помилка при валідації", errors.array())
        );
      }
      const { email } = req.body;

      const result = await UserService.forgotPassword(email);
      return res.status(200).json(result);
    } catch (e) {
      console.error("❌ Помилка в UserController.forgotPassword():", e);
      return next(e);
    }
  }
  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      const result = await UserService.resetPassword(token, password);
      return res.json(result);
    } catch (e) {
      console.error("❌ Помилка в UserController.resetPassword():", e);
      return next(e);
    }
  }
  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.getUser(id);

      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
