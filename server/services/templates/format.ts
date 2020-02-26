interface TemplateItem {
  name: string;
  content: string;
}

export const formatMessage = (text, vars: TemplateItem[] = []): string => {
  let result = text;

  for (let index = 0; index < vars.length; index++) {
    const varItem = vars[index];
    const regex = new RegExp('\\*\\|' + varItem.name + '\\|\\*', 'g');
    result = result.replace(regex, varItem.content);
  }

  return result;
};
