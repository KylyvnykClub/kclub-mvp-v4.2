'use client';

import type { PartnerDto } from '@kclub/contracts';
import { List, useTable } from '@refinedev/antd';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Image, Space, Table, Tag } from 'antd';
import { useGo } from '@refinedev/core';
import type { ReactNode } from 'react';
import { countryCodeToEmoji } from './countries';

export const PartnersList = (): ReactNode => {
  const go = useGo();
  const tableResult = useTable<PartnerDto>({
    resource: 'partners',
    syncWithLocation: true,
    pagination: { pageSize: 20 },
  }) as any;
  const tableProps = tableResult.tableProps;
  const tableQueryResult = tableResult.tableQueryResult || tableResult.query || tableResult.queryResult;

  return (
    <List
      title="Partners"
      headerButtons={[
        <Button key="refresh" icon={<ReloadOutlined />}
          loading={tableQueryResult?.isFetching ?? false}
          onClick={() => tableQueryResult?.refetch()}>
          Refresh
        </Button>,
        <Button key="create" type="primary"
          onClick={() => go({ to: '/partners/create', type: 'push' })}>
          Create partner
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Table {...tableProps} rowKey="id"
          onRow={(record) => ({
            onClick: () => go({ to: `/partners/${record.id}`, type: 'push' }),
            style: { cursor: 'pointer' },
          })}
          scroll={{ x: 1000 }}>
          <Table.Column<PartnerDto> title="Image" width={80}
            render={(_, record) => (
              <Image src={record.image} alt={record.slug} width={48} height={48}
                style={{ objectFit: 'cover', borderRadius: 4 }} preview={false} />
            )} />
          <Table.Column<PartnerDto> title="Name"
            render={(_, record) => record.translations.en?.name ?? record.slug} />
          <Table.Column<PartnerDto> title="Slug" dataIndex="slug" />
          <Table.Column<PartnerDto> title="Category" dataIndex="category"
            render={(value: string) => <Tag>{value}</Tag>} />
          <Table.Column<PartnerDto> title="Country" dataIndex="country"
            render={(value: string) => (
              <span>{countryCodeToEmoji(value)} {value.toUpperCase()}</span>
            )} />
          <Table.Column<PartnerDto> title="Discount" dataIndex="discountPercent"
            render={(value: number) => `${value}%`} />
          <Table.Column<PartnerDto> title="Featured" width={120}
            render={(_, record) => (
              <Space size={4}>
                {record.featuredTop && <Tag color="blue">Top</Tag>}
                {record.featuredRecommended && <Tag color="purple">Rec</Tag>}
              </Space>
            )} />
          <Table.Column<PartnerDto> title="Active" dataIndex="isActive"
            render={(value: boolean) => value ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>} />
          <Table.Column<PartnerDto> title="Sort" dataIndex="sortOrder" width={60} />
          <Table.Column<PartnerDto> title="Actions" width={160}
            render={(_, record) => (
              <Space>
                <Button size="small" onClick={(e) => {
                  e.stopPropagation();
                  go({ to: `/partners/${record.id}/edit`, type: 'push' });
                }}>Edit</Button>
              </Space>
            )} />
        </Table>
      </Space>
    </List>
  );
};
