<script setup lang="ts">
import PureTable from '@pureadmin/table';
import { useColumns } from '@/views/link_management/link/table';
import 'plus-pro-components/es/components/search/style/css';
import { type PlusColumn, PlusSearch } from 'plus-pro-components';

defineOptions({
  name: 'LinksLink'
});

const {
  loading,
  columns,
  records,
  pagination,
  loadingConfig,
  onSizeChange,
  onCurrentChange,
  search,
  queryAction
} = useColumns();


const formColumns: PlusColumn[] = [
  {
    label: '链接ID',
    prop: 'id',
    valueType: 'input',
    fieldProps: {
      placeholder: '链接ID'
    }
  },
  {
    label: '状态',
    prop: 'status',
    valueType: 'input',
    fieldProps: {
      placeholder: ''
    }
  }
];


const handleReset = () => {
  search.value.id = ''
  search.value.status = ''
  pagination.currentPage = 1
  queryAction()
};
</script>
<template>
  <div class="p-4">
    <div class="mb-4">

      <PlusSearch
        v-model="search"
        :columns="formColumns"
        :show-number="2"
        label-width="80"
        label-position="right"
        resetText="重置"
        search-text="搜索"
        @search="queryAction"
        @reset="handleReset"
      />
    </div>
    <pure-table
      border
      row-key="id"
      :loading="loading"
      showOverflowTooltip
      alignWhole="center"
      :pagination="pagination"
      :data="records"
      :columns="columns"
      :loading-config="loadingConfig"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    ></pure-table>
  </div>
</template>
