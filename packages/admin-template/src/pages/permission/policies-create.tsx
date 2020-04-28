import React from 'react';
import isEqual from 'lodash/isEqual';
import uniqueId from 'lodash/uniqueId';
import { connect } from 'dva';
import { history } from 'umi';
import { Button, Card, Input, Tag, Form } from 'antd';
import PageHeaderWrapper from '@/components/page-header-wrapper/index';
import FooterToolbar from '@/components/footer-toolbar/index';
import StandardTable from '@jiumao/rc-table';
import { Statement } from '@pansy/policy';
import { IModule, IAction } from '@/models/action';
import { ConnectProps, ConnectState } from '@/models/connect';
import StatementDrawer from './components/statement-drawer';

interface IProps extends ConnectProps {
  modules: IModule[];
  actions: IAction[];
}

const CreatePolicy: React.FC<IProps> = (props) => {
  const { dispatch, modules, actions } = props;
  const [visible, setVisible] = React.useState<boolean>(false);
  const [statements, setStatement] = React.useState<Statement[]>([]);

  React.useState(() => {
    dispatch({
      type: 'action/fetchModules'
    });
  });

  const showCreateView = () => {
    setVisible(true);
  };

  const closeCreateView = () => {
    setVisible(false);
  };

  const handleCreate = (values) => {
    dispatch({
      type: 'policy/fetchCreate',
      payload: {
        ...values,
        document: statements
      },
      callback: () => {
        setStatement([]);
        // form.resetFields();
        handelCancel();
      }
    });
  };

  const handleStatementCreate = (value) => {
    setStatement([...statements, value]);
    setVisible(false);
  };

  const handleStatementRemove = (value) => {
    setStatement(statements.filter((item) => !isEqual(item, value)));
  };

  const handelCancel = () => {
    history.push('/permission/policies');
  };

  const columns = [
    {
      title: '权限效力',
      dataIndex: 'effect',
      render: (text) => {
        return text === 'allow' ? '允许' : '禁止';
      }
    },
    {
      title: '模块',
      dataIndex: 'module',
      render: (text, record) => {
        const action = record.action[0];
        return action.split('/')[0];
      }
    },
    {
      title: '操作名称',
      dataIndex: 'action',
      render: (text) => {
        return text.map((item, index) => (
          <Tag key={index} color="#2db7f5">
            {item}
          </Tag>
        ));
      }
    },
    {
      title: '操作',
      key: 'buttons',
      render: (text, record) => (
        <Button type="danger" size="small" onClick={() => handleStatementRemove(record)}>
          删除
        </Button>
      )
    }
  ];

  return (
    <React.Fragment>
      <PageHeaderWrapper
        title="新建自定义权限策略"
        extra={[
          <Button key="1" type="primary" onClick={showCreateView}>
            添加授权语句
          </Button>
        ]}
      >
        <Form layout="inline">
          <Form.Item
            label="策略名称"
            name="name"
            rules={[
              {
                required: true,
                message: '策略名称不能为空'
              }
            ]}
          >
            <Input placeholder="请输入策略名称" />
          </Form.Item>
          <Form.Item label="策略备注" name="remark">
            <Input placeholder="请输入策略备注" />
          </Form.Item>
        </Form>
      </PageHeaderWrapper>

      <StatementDrawer
        visible={visible}
        formType="create"
        modules={modules}
        actions={actions}
        dispatch={dispatch}
        onConfirm={handleStatementCreate}
        onClose={closeCreateView}
      />

      <Card bordered={false}>
        <StandardTable
          data={{
            list: statements
          }}
          columns={columns}
          rowKey={() => uniqueId()}
        />
      </Card>

      <FooterToolbar>
        <Button type="primary" disabled={!statements.length} onClick={handleCreate}>
          确定
        </Button>
        <Button onClick={handelCancel}>返回</Button>
      </FooterToolbar>
    </React.Fragment>
  );
};

CreatePolicy.defaultProps = {
  modules: []
};

export default connect(({ action }: ConnectState) => ({
  modules: action.modules,
  actions: action.list
}))(CreatePolicy);
