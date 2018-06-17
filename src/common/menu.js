import { isUrl } from '../utils/utils';

import menuDynamic from '../app/common/menu';
import getMenu from '../app/common/memberMenu';
import {getAuthority} from '../utils/authority'


function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }

    return result;
  });
}

export const getMenuData = () => formatter(getAuthority()=='admin'?menuDynamic:getMenu(false));
