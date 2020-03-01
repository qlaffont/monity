import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import Navbar from '../../../../components/layout/Navbar';
import Content from '../../../../components/layout/Content';
import CheckerFormComponent from '../../../../components/checkers/CheckerFormComponent';
import { getCheckerById } from '../../../../services/apis/checkers';
import { apiErrorInterceptor } from '../../../../services/auth/authService';
import { useRouter } from 'next/router';

const CheckerEdit = (): JSX.Element => {
  const router = useRouter();
  const { checkerid: checkerId } = router.query;

  // @ts-ignore
  const [{ data, loading: isLoading, error }, execute] = useAxios(getCheckerById(checkerId), {
    manual: true,
    useCache: false,
  });

  useEffect(() => {
    if (checkerId) {
      execute();
    }
  }, [checkerId]);

  if (error) {
    apiErrorInterceptor(error, router);
  }

  return (
    <>
      <Navbar />
      <Content>
        {data && !isLoading ? (
          <>
            <h2 className="title is-2">Checker - edit</h2>
            <CheckerFormComponent checkerData={data.data}></CheckerFormComponent>
          </>
        ) : (
          <>Loading ...</>
        )}
      </Content>
    </>
  );
};

export default CheckerEdit;
