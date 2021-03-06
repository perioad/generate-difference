import _ from 'lodash';

const indent = '    ';

const stringify = (content, depthLevel) => {
  if (!_.isObject(content)) {
    return `${content}`;
  }
  const nextDepthLevel = depthLevel + 1;
  const pairsKeyAndValue = _.toPairs(content);
  const toString = pairsKeyAndValue.map(([key, value]) => `${key}: ${value}`).join('\n');
  return `{\n${indent.repeat(nextDepthLevel)}${toString}\n${indent.repeat(depthLevel)}}`;
};

const keysTypes = {

  nested: (valueAfter, valueBefore, name, depthLevel, func, children) => `${indent.repeat(depthLevel)}${name}: ${func(children, depthLevel)}`,

  same: (valueAfter, valueBefore, name, depthLevel) => `${indent.repeat(depthLevel)}${name}: ${stringify(valueAfter, depthLevel)}`,

  changed: (valueAfter, valueBefore, name, depthLevel) => (
    `${indent.repeat(depthLevel).slice(2)}+ ${name}: ${stringify(valueAfter, depthLevel)}\n${indent.repeat(depthLevel).slice(2)}- ${name}: ${stringify(valueBefore, depthLevel)}`
  ),

  deleted: (valueAfter, valueBefore, name, depthLevel) => `${indent.repeat(depthLevel).slice(2)}- ${name}: ${stringify(valueBefore, depthLevel)}`,

  added: (valueAfter, valueBefore, name, depthLevel) => `${indent.repeat(depthLevel).slice(2)}+ ${name}: ${stringify(valueAfter, depthLevel)}`,

};

const render = (ast, depthLevel = 0) => {
  const mappedDiffs = ast.map((key) => {
    const {
      name,
      type,
      valueAfter,
      valueBefore,
      children,
    } = key;
    const nextDepthLevel = depthLevel + 1;
    const string = keysTypes[type](valueAfter, valueBefore, name, nextDepthLevel, render, children);
    return string;
  });
  const mergedDiffs = mappedDiffs.join('\n');
  const addedOuterCurlyBraces = `{\n${mergedDiffs}\n${indent.repeat(depthLevel)}}`;
  return addedOuterCurlyBraces;
};

export default render;
