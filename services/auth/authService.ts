import cogoToast from 'cogo-toast';

export const apiErrorInterceptor = (error, router): void => {
  if (error.response.status === 401) {
    cogoToast.error('Your token is invalid. You need to change it !', { heading: 'Authorization Error !' });
    router.push('/setup/auth');
  }
};
