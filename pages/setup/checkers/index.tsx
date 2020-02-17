import React, { useEffect } from 'react';
import useAxios from 'axios-hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cogoToast from 'cogo-toast';

import Content from '../../../components/layout/Content';
import Navbar from '../../../components/layout/Navbar';
import { getCheckers, deleteChecker, startChecker, stopChecker } from '../../../services/apis/checkers';
import { apiErrorInterceptor } from '../../../services/auth/authService';

const CheckersList = (): JSX.Element => {
  const [{ data, loading: isLoading, error }, execute] = useAxios(getCheckers(), { useCache: false });
  const [{ data: dataDelete, error: errorDelete }, executeDelete] = useAxios({}, { manual: true });
  const [{ error: errorActive }, executeActive] = useAxios({}, { manual: true });
  const router = useRouter();

  if (error) {
    apiErrorInterceptor(error, router);
  }

  const deleteModal = (checker): void => {
    if (confirm(`Do you want to delete checker '${checker.name}' ?`)) {
      executeDelete(deleteChecker(checker._id));
    }
  };

  const changeStatusChecker = (checker): void => {
    if (checker.active) {
      executeActive(stopChecker(checker._id));
      cogoToast.success('Stopping checker in progress...', { heading: 'Success' });
    } else {
      executeActive(startChecker(checker._id));
      cogoToast.success('Starting checker in progress...', { heading: 'Success' });
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

  useEffect(() => {
    if (errorActive) {
      cogoToast.error(errorActive.message, { heading: 'Error' });
    }
  }, [errorActive]);

  const renderCheckers = (): JSX.Element | undefined => {
    if (data) {
      const checkers = data.data;
      return (
        <table className="table is-striped is-hoverable is-fullwidth">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Group</th>
              <th>Type</th>
              <th>Cron</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
            {checkers &&
              checkers.length > 0 &&
              checkers.map(checker => {
                return (
                  <tr key={checker._id}>
                    <td>{checker.name}</td>
                    <td>{checker.groupId.name}</td>
                    <td>{checker.checkerType}</td>
                    <td>{checker.cron}</td>
                    <td>
                      {checker.active ? (
                        <i className="has-text-success">Enabled</i>
                      ) : (
                        <i className="has-text-danger">Disabled</i>
                      )}
                    </td>
                    <td>
                      <Link href={`/setup/checkers/edit/` + checker._id}>
                        <button className="button is-outlined is-success mr-1">
                          <span className="icon">
                            <i className="far fa-edit"></i>
                          </span>
                          <span>Edit</span>
                        </button>
                      </Link>

                      <button className="button is-outlined is-danger mr-1" onClick={(): void => deleteModal(checker)}>
                        <span className="icon">
                          <i className="far fa-trash-alt"></i>
                        </span>
                        <span>Delete</span>
                      </button>

                      <button className="button is-outlined is-info" onClick={(): void => changeStatusChecker(checker)}>
                        {checker.active ? (
                          <>
                            <span className="icon">
                              <i className="fas fa-toggle-on"></i>
                            </span>
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <span className="icon">
                              <i className="fas fa-toggle-off"></i>
                            </span>
                            <span>Start</span>
                          </>
                        )}
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
        <h2 className="title is-2"> Checkers</h2>

        <Link href="/setup/checkers/add">
          <button className="button mb-1 is-info">
            <span className="icon">
              <i className="far fa-plus-square"></i>
            </span>
            <span>Add</span>
          </button>
        </Link>

        {isLoading ? <button className="button is-loading">Loading</button> : renderCheckers()}
      </Content>
    </>
  );
};

export default CheckersList;
