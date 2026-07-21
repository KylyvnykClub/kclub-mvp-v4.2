'use client';

import type { PartnerDto } from '@kclub/contracts';
import { useForm } from '@refinedev/antd';
import { AutoComplete, Button, Form, Input, InputNumber, message, Select, Switch, Tabs, Upload } from 'antd';
import { useGo } from '@refinedev/core';
import type { ReactNode } from 'react';
import { useState, useMemo, useRef, useCallback } from 'react';
import { City } from 'country-state-city';
import { COUNTRY_OPTIONS, countryCodeToEmoji } from './countries';

const { TextArea } = Input;

const CATEGORIES = ['ADVISORY', 'FINANCE', 'LEGAL', 'TECHNOLOGY'] as const;
const LOCALES = ['en', 'ru', 'uk'] as const;

type MemberSearchResult = { id: string; firstName: string; lastName: string; phone: string };

export const PartnerForm = (): ReactNode => {
  const go = useGo();
  const { formProps, saveButtonProps, formLoading } = useForm<PartnerDto>({
    resource: 'partners',
    redirect: 'list',
    onMutationError: (error) => {
      message.error(error instanceof Error ? error.message : 'Failed to save partner.');
    },
  });
  const [uploading, setUploading] = useState(false);
  const [ownerOptions, setOwnerOptions] = useState<{ label: string; value: string }[]>([]);
  const [ownerSearching, setOwnerSearching] = useState(false);
  
  // Custom debounce logic for owner search
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchOwners = useCallback((search: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (search.length < 2) return;
    
    setOwnerSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/proxy/users?search=${encodeURIComponent(search)}&pageSize=10`);
        const json = await res.json();
        setOwnerOptions(
          (json.data?.items ?? []).map((m: MemberSearchResult) => ({
            label: `${m.firstName} ${m.lastName} (${m.phone})`,
            value: m.id,
          }))
        );
      } catch (err) {
        console.error('Failed to fetch owners', err);
      } finally {
        setOwnerSearching(false);
      }
    }, 300);
  }, []);

  const handleUpload = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/proxy/partners/upload-image', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const json = (await response.json()) as { data: { url: string } };
      return json.data.url;
    } finally {
      setUploading(false);
    }
  };

  const selectedCountry = Form.useWatch('country', formProps.form);
  const cityOptions = useMemo(() => {
    if (!selectedCountry) return [];
    return City.getCitiesOfCountry(selectedCountry.toUpperCase())?.map((c) => ({
      value: c.name,
      label: c.name,
    })) ?? [];
  }, [selectedCountry]);

  // When edit mode loads, if there is an owner we need an initial option to display
  // We can inject the ownerName from initial values if available
  const initialValues = formProps.initialValues as any;
  if (initialValues?.ownerId && initialValues?.ownerName && ownerOptions.length === 0) {
    setOwnerOptions([{ label: initialValues.ownerName, value: initialValues.ownerId }]);
  }

  return (
    <Form {...formProps} layout="vertical" style={{ maxWidth: 800 }}>
      <Form.Item label="Slug" name="slug" rules={[{ required: true, message: 'Slug is required' }]}>
        <Input placeholder="partner-slug" />
      </Form.Item>

      <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Category is required' }]}>
        <Select placeholder="Select category">
          {CATEGORIES.map((cat) => (
            <Select.Option key={cat} value={cat}>{cat}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Country" name="country" rules={[{ required: true, message: 'Country is required' }]}>
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="Select country"
          options={COUNTRY_OPTIONS.map((c) => ({
            label: `${countryCodeToEmoji(c.code)} ${c.name}`,
            value: c.code,
          }))}
        />
      </Form.Item>
      
      <Form.Item label="City" name="city">
        <AutoComplete
          options={cityOptions}
          placeholder="Select or type city"
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      </Form.Item>

      <Form.Item label="Phone" name="phone">
        <Input placeholder="+1234567890" />
      </Form.Item>

      <Form.Item label="Owner" name="ownerId">
        <Select
          showSearch
          allowClear
          placeholder="Search by name, email or phone"
          filterOption={false}
          onSearch={searchOwners}
          loading={ownerSearching}
          options={ownerOptions}
        />
      </Form.Item>

      <Form.Item label="Discount (%)" name="discountPercent" rules={[{ required: true, message: 'Discount is required' }]}>
        <InputNumber min={0} max={100} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="Sort order" name="sortOrder">
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item label="Featured Top" name="featuredTop" valuePropName="checked">
        <Switch />
      </Form.Item>
      
      <Form.Item label="Featured Recommended" name="featuredRecommended" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="Active" name="isActive" valuePropName="checked" initialValue={true}>
        <Switch />
      </Form.Item>

      <Form.Item label="Image URL" name="image">
        <Input placeholder="https://..." />
      </Form.Item>

      <Form.Item label="Upload image">
        <Upload
          accept="image/*"
          showUploadList={false}
          customRequest={async ({ file, onSuccess, onError }) => {
            try {
              const url = await handleUpload(file as File);
              formProps.form?.setFieldsValue({ image: url });
              onSuccess?.(url);
            } catch (err) {
              onError?.(err as Error);
            }
          }}
        >
          <Button loading={uploading} disabled={uploading}>Upload</Button>
        </Upload>
      </Form.Item>

      <Tabs
        items={LOCALES.map((locale) => ({
          key: locale,
          label: locale.toUpperCase(),
          children: (
            <>
              <Form.Item label="Name" name={['translations', locale, 'name']}
                rules={[{ required: true, message: `Name (${locale}) is required` }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Description" name={['translations', locale, 'description']}
                rules={[{ required: true, message: `Description (${locale}) is required` }]}>
                <TextArea rows={3} />
              </Form.Item>
            </>
          ),
        }))}
      />

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={formLoading} {...saveButtonProps}>Save</Button>
        <Button style={{ marginLeft: 8 }} onClick={() => go({ to: '/partners', type: 'push' })}>Cancel</Button>
      </Form.Item>
    </Form>
  );
};
