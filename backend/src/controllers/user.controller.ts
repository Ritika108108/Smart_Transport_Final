'use strict';
import httpStatusCodes from 'http-status-codes';
import apiResponse from '../appConfigs/utilities/apiResponse';
import IController from '../appConfigs/utilities/IController';
import MESSAGES from '../common/messages/messages';
import userService from '../services/user.service';
const LOGGER = new (require('../appConfigs/utilities/logger').default)('usersController.ts');

const loginWithEmail: IController = async (req: any, res: any) => {
    try {
        const results = await userService.loginWithEmail(req);
        apiResponse.success(res, httpStatusCodes.OK, MESSAGES.COMMON.SUCCESS.FETCH, results);
    } catch (error: any) {
        if (error instanceof Error) {
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST, error.message, null);
        } else {
            apiResponse.error(res, httpStatusCodes.BAD_REQUEST, MESSAGES.COMMON.SOMETHING_WRONG, null)
        }
    }
}


export default {
    loginWithEmail,
}
