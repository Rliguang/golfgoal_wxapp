/** 
 * api接口的统一出口
 */
import login from './login.js'; // 登录模块模块接口
import games from './games.js'; // 创建球局模块接口
import course from './course.js'; // 球场模块接口
import player from './player.js'; // 球员模块接口
import score from './score.js'; // 计分模块接口
import arrange from './arrange.js'; // 计分模块接口
import match from './match.js'; // 首页模块接口
import pTable from './pTable.js'; // 首页模块接口
import modification from './modification.js'; // 首页模块接口
import setScore from './setScore.js'; // 首页模块接口
import mine from './mine.js'; // 首页模块接口
import ballFriend from './ballFriend.js'; // 首页模块接口
import invitedCompetitor from './invitedCompetitor.js'; // 首页模块接口
import api from './api.js'; // 首页模块接口

// 导出接口
export default {
	login,
	games,
	course,
	player,
	score,
	arrange,
	match,
	pTable,
	modification,
	setScore,
	mine,
	ballFriend,
	invitedCompetitor,
	api
};
