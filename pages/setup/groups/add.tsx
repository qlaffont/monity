import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Content from '../../../components/layout/Content';
import GroupFormComponent from '../../../components/groups/GroupFormComponent';

const GroupAdd = (): JSX.Element => (
  <>
    <Navbar />
    <Content>
      <h2 className="title is-2">Group - Add</h2>
      <GroupFormComponent></GroupFormComponent>
    </Content>
  </>
);

export default GroupAdd;
