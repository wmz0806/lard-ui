import * as React from 'react';
import RMCLV from 'rmc-list-view';


export const ds = new RMCLV.DataSource({
  rowHasChanged: (row1: any, row2: any) => row1 !== row2,
});

export const renderRow = (d:any): React.ReactNode => {
  return (<div style={{padding: '0.3rem', backgroundColor: 'red', marginTop: '0.1rem'}}>{d}</div>);
};
