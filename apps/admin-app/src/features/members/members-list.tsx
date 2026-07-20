'use client';

import type { MemberListItemDto } from '@kclub/contracts';
import { List, useTable } from '@refinedev/antd';
import { Input, Space, Table, Tag } from 'antd';
import { useGo } from '@refinedev/core';
import type { ReactNode } from 'react';

const { Search } = Input;

const statusColor: Record<string, string> = {
  SUBMITTED: 'blue',
  UNDER_REVIEW: 'orange',
  APPROVED: 'green',
  REJECTED: 'red',
};

export const MembersList = (): ReactNode => {
  const go = useGo();
  const { tableProps, setFilters, filters } = useTable<MemberListItemDto>({
    resource: 'members',
    syncWithLocation: true,
    pagination: { pageSize: 20 },
  });

  const currentSearch =
    (filters?.find((f) => 'field' in f && f.field === 'search') as { value?: string } | undefined)
      ?.value ?? '';

  return (
    <List title="Members">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Search
          allowClear
          defaultValue={currentSearch}
          placeholder="Search by name, phone, or company..."
          onSearch={(value) =>
            setFilters([{ field: 'search', operator: 'contains', value }])
          }
          style={{ maxWidth: 400 }}
        />
        <Table
          {...tableProps}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => go({ to: `/members/${record.id}`, type: 'push' }),
            style: { cursor: 'pointer' },
          })}
          scroll={{ x: 900 }}
        >
          <Table.Column<MemberListItemDto>
            title="Name"
            render={(_, record) =>
              `${record.firstName} ${record.lastName}${record.displayName ? ` (${record.displayName})` : ''}`
            }
          />
          <Table.Column<MemberListItemDto> title="Phone" dataIndex="phone" />
          <Table.Column<MemberListItemDto> title="Company" dataIndex="company" />
          <Table.Column<MemberListItemDto> title="Position" dataIndex="position" />
          <Table.Column<MemberListItemDto>
            title="Location"
            render={(_, record) =>
              [record.city, record.country].filter(Boolean).join(', ') || '—'
            }
          />
          <Table.Column<MemberListItemDto>
            title="Application"
            render={(_, record) =>
              record.application ? (
                <Tag color={statusColor[record.application.status] ?? 'default'}>
                  {record.application.status}
                </Tag>
              ) : (
                <Tag>No application</Tag>
              )
            }
          />
          <Table.Column<MemberListItemDto>
            title="Registered"
            dataIndex="createdAt"
            render={(value: string) => new Date(value).toLocaleDateString()}
          />
        </Table>
      </Space>
    </List>
  );
};
