// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------

import request from "@/utils/request.js";
/**
 * 
 * 所有微信接口 
 * 
 */

/**
 * 拼团列表
 * 
 */
export function getCombinationList(data) {
	return request.get('combination/list', data, {
		noAuth: true
	});
}

/**
 * 拼团详情
 * 
 */
export function getCombinationDetail(id) {
	return request.get('wechat/getWxConfig');
}

/**
 * 拼团 开团
 */
export function getCombinationPink(id) {
	return request.get("wechat/getScheme");
}
