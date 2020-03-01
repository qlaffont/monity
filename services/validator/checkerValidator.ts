export const cronRegex = /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;

export const addressValidator = async (address, port, type): Promise<Error | void> => {
  if (address.indexOf(' ') !== -1) {
    throw 'Space are not allowed in address';
  }

  if (type === 'http') {
    if (!(address.startsWith('http://') || address.startsWith('https://')))
      throw 'Address malformated. Should start with http(s)://';
  } else {
    if (!port) throw 'Port is missing';
  }
};

export const cronValidator = async (cron): Promise<Error | void> => {
  if (!cronRegex.test(cron)) {
    throw 'Cron is not valid';
  }
};
