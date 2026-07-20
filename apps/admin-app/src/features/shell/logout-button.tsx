'use client';
import { LogoutOutlined } from '@ant-design/icons';
import { useLogout } from '@refinedev/core';
import { Button } from 'antd';
import { messages } from '../../messages/en';
export const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogout();
  return (
    <Button
      icon={<LogoutOutlined />}
      disabled={isPending}
      loading={isPending}
      onClick={() => logout({ redirectPath: '/sign-in' })}
    >
      {messages.logout}
    </Button>
  );
};
