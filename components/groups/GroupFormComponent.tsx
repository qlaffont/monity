import React, { useEffect } from 'react';
import * as yup from 'yup';
import useAxios from 'axios-hooks';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import cogoToast from 'cogo-toast';
import PropTypes from 'prop-types';

import { postGroup, putGroup } from '../../services/apis/groups';
import { apiErrorInterceptor } from '../../services/auth/authService';
import { useRouter } from 'next/router';

const GroupFormComponent = ({ groupData }): JSX.Element => {
  const router = useRouter();
  const GroupFormSchema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
  });

  const { register, handleSubmit, errors, getValues, setValue } = useForm({
    validationSchema: GroupFormSchema,
  });

  useEffect(() => {
    if (groupData) {
      Object.keys(groupData).map(key => {
        setValue(key, groupData[key]);
      });
    }
  }, [groupData]);

  let axiosConfig = postGroup();

  if (groupData && groupData._id) {
    axiosConfig = putGroup(groupData._id);
  }

  const [{ data, loading: isLoading, error }, execute] = useAxios(axiosConfig, {
    manual: true,
  });

  if (data) {
    cogoToast.success(data.message, { heading: 'Success' });
    setTimeout(() => router.push('/setup/groups'), 3000);
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
            <label className="label input__label">Group Name</label>
            <div className="control has-icons-right">
              <input type="text" name="name" className="input" ref={register} />
              {errors.name && <span className="tag is-danger">Name is required</span>}
            </div>
          </div>
          <div className="field column">
            <label className="label input__label">Group Description</label>
            <div className="control has-icons-right">
              <input type="text" name="description" className="input" ref={register} />
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

GroupFormComponent.propTypes = {
  groupData: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    _id: PropTypes.string,
  }),
};

export default GroupFormComponent;
