import React from 'react';
import { connect, useDispatch } from 'dva';
import { Button, Card, Alert, message, Modal } from 'antd';
import Table from '@jiumao/rc-table';
import PageHeaderWrapper from '@/components/page-header-wrapper';
import { ConnectProps, ConnectState } from '@/models/connect';
import useQueryData from '@/hooks/use-query-data';
import { IGroupTableData, IGroup } from './models/user-group';
import GroupDrawer, { TType } from './components/group-drawer';
import PoliciesDrawer from './components/policies-drawer';

interface IProps extends ConnectProps {
  loading: boolean;
  tableData: IGroupTableData;
}

const confirm = Modal.confirm;

const GroupsPage: React.FC<IProps> = props => {
  const dispatch = useDispatch();
  const { tableData, loading } = props;
  const [visible, setVisible] = React.useState<boolean>(false);
  const [type, setType] = React.useState<TType>('create');
  const [currentGroup, setCurrentGroup] = React.useState<IGroup>({});
  const [policiesVisible, setPoliciesVisible] = React.useState<boolean>(false);
  const [queryData, setQueryData] = useQueryData(props.location.pathname);

  React.useEffect(() => {
    getList();
  }, [queryData]);

  const getList = () => {
    dispatch({
      type: 'userGroup/fetchList',
      payload: queryData,
    });
  };

  const handleSubmit = values => {
    if (type === 'create') {
      dispatch({
        type: 'userGroup/fetchCreate',
        payload: values,
        callback: () => {
          setVisible(false);
          message.success('创建成功');
          getList();
        },
      });
      return;
    }
    if (type === 'update') {
      dispatch({
        type: 'userGroup/fetchUpdate',
        payload: values,
        callback: () => {
          setVisible(false);
          message.success('修改成功');
          getList();
        },
      });
    }
  };

  const handleConfirmRemove = data => {
    confirm({
      title: '确定删除?',
      content: '操作不可逆，请确定是否删除',
      onOk() {
        handleRemove(data.id);
      },
    });
  };

  const handleRemove = id => {
    dispatch({
      type: 'userGroup/fetchRemove',
      payload: id,
      callback: () => {
        message.success('删除成功');
        getList();
      },
    });
  };

  const showPoliciesView = data => {
    setCurrentGroup(data);
    setPoliciesVisible(true);
  };

  const showCreateView = () => {
    setVisible(true);
    setType('create');
  };

  const showUpdateView = data => {
    setCurrentGroup(data);
    setVisible(true);
    setType('update');
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleTableChange = pagination => {
    const { current, pageSize } = pagination;
    setQueryData({
      page: current,
      limit: pageSize,
    });
  };

  const columns = [
    {
      title: '用户组名称',
      dataIndex: 'name',
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
    },
    {
      title: '用户数',
      dataIndex: 'userNumber',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <div className="table-action">
          <Button size="small">添加组成员</Button>
          <Button
            size="small"
            onClick={() => {
              showPoliciesView(record);
            }}
          >
            赋权
          </Button>
          <Button
            size="small"
            onClick={() => {
              showUpdateView(record);
            }}
          >
            更新
          </Button>
          <Button
            type="danger"
            size="small"
            onClick={() => {
              handleConfirmRemove(record);
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  const table = React.useMemo(() => {
    return (
      <Table loading={loading} data={tableData} columns={columns} onChange={handleTableChange} />
    );
  }, [props.tableData, props.loading]);

  return (
    <React.Fragment>
      <PageHeaderWrapper
        title="用户组管理"
        extra={[
          <Button key="1" type="primary" onClick={showCreateView}>
            新建用户组
          </Button>,
        ]}
      >
        <Alert
          message="通过用户组对职责相同的用户进行分类并授权，可以更加高效地管理用户及其权限。对一个用户组进行授权后，用户组内的所有用户会自动继承该用户组的权限。如果一个用户被加入到多个用户组，那么该用户将会继承多个用户组的权限。"
          type="info"
          closable
        />
      </PageHeaderWrapper>

      <Card bordered={false}>{table}</Card>

      <GroupDrawer
        visible={visible}
        type={type}
        currentGroup={currentGroup}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />

      <PoliciesDrawer
        visible={policiesVisible}
        type="group"
        group={currentGroup}
        onClose={() => {
          setPoliciesVisible(false);
        }}
      />
    </React.Fragment>
  );
};

GroupsPage.defaultProps = {
  loading: false,
};

export default connect(({ userGroup, loading }: ConnectState) => ({
  tableData: userGroup.tableData,
  loading: loading.effects['userGroup/fetchList'],
}))(GroupsPage);
