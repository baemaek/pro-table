import React from 'react';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider/context';
import { Alert } from 'antd';
import './index.less';
import { useIntl, IntlType } from '../intlContext';

export interface TableAlertProps<T> {
  selectedRowKeys: (number | string)[];
  selectedRows: T[];
  alertIInfoRender?:
    | ((selectedRowKeys: (number | string)[], selectedRows: T[]) => React.ReactNode)
    | false;
  onCleanSelected: () => void;
  alertOptionRender?:
    | false
    | ((props: { intl: IntlType; onCleanSelected: () => void }) => React.ReactNode);
}

const defaultAlertOptionRender = (props: { intl: IntlType; onCleanSelected: () => void }) => {
  const { intl, onCleanSelected } = props;
  return <a onClick={onCleanSelected}>{intl.getMessage('alert.clear', '清空')}</a>;
};

const TableAlert = <T, U = {}>({
  selectedRowKeys = [],
  onCleanSelected,
  selectedRows = [],
  alertIInfoRender = () => (
    <span>
      已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
    </span>
  ),
  alertOptionRender = defaultAlertOptionRender,
}: TableAlertProps<T>) => {
  const intl = useIntl();

  const option =
    alertOptionRender &&
    alertOptionRender({
      onCleanSelected,
      intl,
    });
  return (
    <ConfigConsumer>
      {({ getPrefixCls }: ConfigConsumerProps) => {
        const className = getPrefixCls('pro-table-alert');
        if (alertIInfoRender === false) {
          return null;
        }
        const dom = alertIInfoRender(selectedRowKeys, selectedRows);
        if (dom === false) {
          return null;
        }
        return (
          <div className={className}>
            <Alert
              message={
                <div className={`${className}-info`}>
                  <div className={`${className}-info-content`}>{dom}</div>
                  {option && <div className={`${className}-info-option`}>{option}</div>}
                </div>
              }
              type="info"
              showIcon
            />
          </div>
        );
      }}
    </ConfigConsumer>
  );
};

export default TableAlert;
