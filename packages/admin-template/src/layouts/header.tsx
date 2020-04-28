import React from 'react';
import classNames from '@pansy/classnames';
import { history } from 'umi';
import { Layout } from 'antd';
import { connect } from 'dva';
import GlobalHeader from '@/components/global-header';
import { ConnectProps, ConnectState, ISettingModelState } from '@/models/connect';
import './header.less';

export interface IHeaderViewProps extends Required<ConnectProps> {
  prefixCls?: string;
  isMobile?: boolean;
  autoHideHeader?: boolean;
  currentUser: APP.ICurrentUser;
  setting: ISettingModelState;
}

const { Header } = Layout;

const HeaderView: React.FC<IHeaderViewProps> = (props) => {
  const { prefixCls, setting, dispatch, currentUser } = props;
  const { fixedHeader, theme } = setting;

  const handleMenuClick = (key) => {
    // 跳转到个人中心
    if (key === 'account-center') {
      history.push('/account/center');
      return;
    }

    if (key === 'account-settings') {
      history.push('/account/settings');
      return;
    }

    // 退出登录
    if (key === 'logout') {
      dispatch({
        type: 'login/fetchLogout'
      });
    }
  };

  return (
    <Header
      style={{ padding: 0, zIndex: 2 }}
      className={classNames(prefixCls, {
        [`is-fixed`]: fixedHeader
      })}
    >
      <GlobalHeader onMenuClick={handleMenuClick} currentUser={currentUser} />
    </Header>
  );
};

HeaderView.defaultProps = {
  prefixCls: 'city-basic-layout-header'
};

export default connect(({ user, setting }: ConnectState) => ({
  currentUser: user.currentUser,
  setting
}))(HeaderView);
