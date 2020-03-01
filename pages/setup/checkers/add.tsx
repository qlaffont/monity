import React from 'react';
import Navbar from '../../../components/layout/Navbar';
import Content from '../../../components/layout/Content';
import CheckerFormComponent from '../../../components/checkers/CheckerFormComponent';

const CheckerAdd = (): JSX.Element => (
  <>
    <Navbar />
    <Content>
      <h2 className="title is-2">Checker - Add</h2>
      <CheckerFormComponent></CheckerFormComponent>
    </Content>
  </>
);

export default CheckerAdd;
