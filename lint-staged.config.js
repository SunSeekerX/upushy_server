/**
 * 检查暂存区
 * @author: SunSeekerX
 * @Date: 2020-11-13 12:46:27
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-09 16:13:38
 */

module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['prettier --write--parser json'],
  'package.json': ['prettier --write'],
  '*.md': ['prettier --write'],
}
