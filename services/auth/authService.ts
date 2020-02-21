import cogoToast from 'cogo-toast';
import Cookies from 'js-cookie';

export const apiErrorInterceptor = (error, router): void => {
  if (error.response.status === 401) {
    cogoToast.error('Your token is invalid. You need to change it !', { heading: 'Authorization Error !' });
    Cookies.remove('monityToken');
    router.push('/setup/auth');
  }
};
