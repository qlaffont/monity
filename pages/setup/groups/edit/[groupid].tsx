import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import Navbar from '../../../../components/layout/Navbar';
import Content from '../../../../components/layout/Content';
import GroupFormComponent from '../../../../components/groups/GroupFormComponent';
import { getGroupById } from '../../../../services/apis/groups';
import { apiErrorInterceptor } from '../../../../services/auth/authService';
import { useRouter } from 'next/router';

const GroupEdit = (): JSX.Element => {
  const router = useRouter();
  const { groupid: groupId } = router.query;

  // @ts-ignore
  const [{ data, loading: isLoading, error }, execute] = useAxios(getGroupById(groupId), {
    manual: true,
    useCache: false,
  });

  useEffect(() => {
    if (groupId) {
      execute();
    }
  }, [groupId]);

  if (error) {
    apiErrorInterceptor(error, router);
  }

  return (
    <>
      <Navbar />
      <Content>
        {data && !isLoading ? (
          <>
            <h2 className="title is-2">Group - edit</h2>
            <GroupFormComponent groupData={data.data}></GroupFormComponent>
          </>
        ) : (
          <>Loading ...</>
        )}
      </Content>
    </>
  );
};

export default GroupEdit;
