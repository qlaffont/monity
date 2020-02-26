import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cogoToast from 'cogo-toast';

import Content from '../../../components/layout/Content';
import Navbar from '../../../components/layout/Navbar';
import { getGroups, deleteGroup } from '../../../services/apis/groups';
import { apiErrorInterceptor } from '../../../services/auth/authService';

const GroupsList = (): JSX.Element => {
  const [{ data, loading: isLoading, error }, execute] = useAxios(getGroups(), { useCache: false });
  const [{ data: dataDelete, error: errorDelete }, executeDelete] = useAxios({}, { manual: true });
  const router = useRouter();

  if (error) {
    apiErrorInterceptor(error, router);
  }

  const deleteModal = (group): void => {
    if (confirm(`Do you want to delete group '${group.name}' ?`)) {
      executeDelete(deleteGroup(group._id));
    }
  };

  useEffect(() => {
    if (dataDelete) {
      cogoToast.success(dataDelete.message, { heading: 'Success' });
      execute();
    }

    if (errorDelete) {
      cogoToast.error(errorDelete.message, { heading: 'Error' });
    }
  }, [dataDelete]);

  const renderGroups = (): JSX.Element | undefined => {
    if (data) {
      const groups = data.data;
      return (
        <table className="table is-striped is-hoverable is-fullwidth">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
            {groups &&
              groups.length > 0 &&
              groups.map(group => {
                return (
                  <tr key={group._id}>
                    <td>{group.name}</td>
                    <td>{group.description}</td>
                    <td>
                      <Link href={`/setup/groups/edit/` + group._id}>
                        <button className="button is-outlined is-success mr-1">
                          <span className="icon">
                            <i className="far fa-edit"></i>
                          </span>
                          <span>Edit</span>
                        </button>
                      </Link>

                      <button className="button is-outlined is-danger" onClick={(): void => deleteModal(group)}>
                        <span className="icon">
                          <i className="far fa-trash-alt"></i>
                        </span>
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      );
    }
  };

  return (
    <>
      <Navbar />
      <Content>
        <h2 className="title is-2"> Groups</h2>

        <Link href="/setup/groups/add">
          <button className="button mb-1 is-info">
            <span className="icon">
              <i className="far fa-plus-square"></i>
            </span>
            <span>Add</span>
          </button>
        </Link>

        {isLoading ? <button className="button is-loading">Loading</button> : renderGroups()}
      </Content>
    </>
  );
};

export default GroupsList;
