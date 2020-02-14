import React, { useEffect } from 'react';
import * as yup from 'yup';
import useAxios from 'axios-hooks';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import cogoToast from 'cogo-toast';
import PropTypes from 'prop-types';

import { postChecker, putChecker } from '../../services/apis/checkers';
import { apiErrorInterceptor } from '../../services/auth/authService';
import { useRouter } from 'next/router';
import { getGroups } from '../../services/apis/groups';

const CheckerFormComponent = ({ checkerData }): JSX.Element => {
  const router = useRouter();
  let disabled = false;
  const CheckerFormSchema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    checkerType: yup
      .string()
      .matches(/(http|ping)/)
      .required(),
    address: yup.string().required(),
    port: yup.number(),
    cron: yup.string().required(),
    groupId: yup.string().required(),
  });

  const { register, handleSubmit, errors, getValues, setValue, watch } = useForm({
    validationSchema: CheckerFormSchema,
  });

  const type = watch('checkerType');
  const port = watch('port');

  useEffect(() => {
    if (checkerData) {
      Object.keys(checkerData).map(key => {
        let data = checkerData[key];
        if (key === 'groupId') {
          data = checkerData.groupId._id;
        }
        setValue(key, data);
      });
    }
  }, [checkerData]);

  let axiosConfig = postChecker();

  if (checkerData && checkerData._id) {
    axiosConfig = putChecker(checkerData._id);
    disabled = true;
  }

  const [{ data, loading: isLoading, error }, execute] = useAxios(axiosConfig, {
    manual: true,
  });

  const [{ data: dataGroups }] = useAxios(getGroups());

  const groups = dataGroups?.data || [];

  if (data) {
    cogoToast.success(data.message, { heading: 'Success' });
    setTimeout(() => router.push('/setup/checkers'), 3000);
  }

  if (error) {
    apiErrorInterceptor(error, router);
    // @ts-ignore
    cogoToast.error(error?.response?.message, { heading: 'Error' });
  }

  const onSubmit = (): void => {
    execute({
      data: { ...getValues() },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="columns">
          <div className="field column">
            <label className="label input__label">Checker Name</label>
            <div className="control has-icons-right">
              <input type="text" name="name" className="input" ref={register} />
              {errors.name && <span className="tag is-danger">Name is required</span>}
            </div>
          </div>
          <div className="field column">
            <label className="label input__label">Checker Description</label>
            <div className="control has-icons-right">
              <input type="text" name="description" className="input" ref={register} />
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="field column">
            <label className="label input__label">Checker Type</label>
            <div className="control has-icons-right">
              <select name="checkerType" className="input" ref={register} disabled={disabled}>
                <option value="http">HTTP</option>
                <option value="ping">Ping</option>
              </select>
              {errors.checkerType && <span className="tag is-danger">Checker is required</span>}
            </div>
          </div>
          <div className="field column">
            <label className="label input__label">Address</label>
            <div className="control has-icons-right">
              <input type="text" name="address" className="input" ref={register} />
              {errors.address && <span className="tag is-danger">Checker is required</span>}
            </div>
          </div>
        </div>

        <div className={classNames('columns', { 'is-display-none': type && type !== 'ping' })}>
          <div className="field column">
            <label className="label input__label">Port</label>
            <div className="control has-icons-right">
              <input type="text" name="port" className="input" ref={register} />
              {!port && <span className="tag is-danger">Port is required</span>}
            </div>
          </div>
          <div className="field column"></div>
        </div>

        <div className="columns">
          <div className="field column">
            <label className="label input__label">Cron</label>
            <div className="control has-icons-right">
              <input type="text" name="cron" className="input" ref={register} />
              {errors.cron && <span className="tag is-danger">Cron is required</span>}
            </div>
          </div>
          <div className="field column">
            <label className="label input__label">Group</label>
            <div className="control has-icons-right">
              <select name="groupId" className="input" ref={register} defaultValue="" disabled={disabled}>
                {!checkerData && (
                  <option disabled value="">
                    Please choose a group
                  </option>
                )}
                {groups.map(group => (
                  <option value={group._id} key={group._id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="has-text-centered">
          <button className={classNames('button is-medium', { 'is-loading': isLoading })} disabled={isLoading || data}>
            <span>Submit</span>
          </button>
        </div>
      </form>
    </>
  );
};

CheckerFormComponent.propTypes = {
  checkerData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    checkerType: PropTypes.string,
    address: PropTypes.string,
    port: PropTypes.number,
    cron: PropTypes.string,
    groupId: PropTypes.shape({
      _id: PropTypes.string,
    }),
    _id: PropTypes.string,
  }),
};

export default CheckerFormComponent;
