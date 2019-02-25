import isPlainObject from 'lodash/isPlainObject';

export const isString = str => typeof str === 'string';

export const isNumber = val => typeof val === 'number';

/**
 * JSON字符串反序列化
 * @param str jsonString
 * @param defaultValue 转化失败的默认值
 * @return {*}
 */

export const parseJsonString = (str, defaultValue = '') => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return defaultValue;
  }
};

const defaultPropsConverter = val => val;

export const pickDerivedStateFromProps = (
  keys = [],
  props,
  state = null,
  converter
) => {
  if (keys.some(key => key in props)) {
    if (!state) state = {};
    keys.forEach(key => {
      if (key in props) {
        let convert = defaultPropsConverter;
        if (typeof converter === 'function') convert = converter;
        if (isPlainObject(converter) && typeof converter[key] === 'function')
          convert = converter[key];

        state[key] = convert(props[key]);
      }
    });
    return state;
  }
};

export const deepCopy = source => {
  const result = {};
  for (var key in source) {
    result[key] =
      typeof source[key] === 'object' ? deepCopy(source[key]) : source[key];
  }
  return result;
};

/**
 * 会忽略 undefined
 * 会忽略 symbol
 * 不能序列化函数
 * 不能解决循环引用的对象
 * @param obj
 * @returns {any}
 */
// 简易深拷贝
export const deepClone = obj => JSON.parse(JSON.stringify(obj));

export const cloneDeep = obj => {
  const isObject = o => {
    return (typeof o === 'object' || typeof o === 'function') && o !== null;
  };
  if (!isObject(obj)) throw new Error('非对象');

  const isArray = Array.isArray(obj);
  const new_Obj = isArray ? [...obj] : { ...obj };
  Reflect.ownKeys(new_Obj).forEach(key => {
    new_Obj[key] = isObject(obj[key]) ? cloneDeep(obj[key]) : obj[key];
  });

  return new_Obj;
};

Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') throw new TypeError('不是函数');
  // 保存this
  const _this = this;
  const args = [...arguments].slice(1);
  // 返回一个函数
  return function() {
    return _this.apply(context, args.concat(...arguments));
  };
};
