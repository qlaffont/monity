/* eslint-disable react/prop-types */
import React, { useRef, useEffect } from 'react';
import { Chart } from 'frappe-charts/dist/frappe-charts.min.cjs';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const Graph = ({ title, data, type, height = 250, onSelect = (): void => {}, ...rest }): JSX.Element => {
  const chart = useRef(null);

  useEffect(() => {
    if (chart) {
      const graph = new Chart(chart.current, {
        title,
        data,
        type,
        height,
        is_navigable: !!onSelect,
        ...rest,
      });
      if (onSelect) {
        graph.parent.addEventListener('data-select', onSelect);
      }
    }
  });

  return <div ref={chart} />;
};

export default Graph;
