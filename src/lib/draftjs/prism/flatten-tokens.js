export default function flattenTokens(arr, result, parentType) {
  const pushTokenToResult = content => {
    const newToken = {
      type: parentType,
      content
    };
    result.push(newToken);
  };

  if (Array.isArray(arr)) {
    arr.forEach(token => {
      if (parentType && typeof token === 'string') {
        pushTokenToResult(token);
      } else if (typeof token === 'string') {
        result.push(token);
      } else {
        flattenTokens(token.content, result, token.type);
      }
    });
  } else {
    pushTokenToResult(arr);
  }
  return result;
}
