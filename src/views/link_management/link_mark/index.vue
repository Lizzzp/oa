<script setup lang="ts">
import PureTable from '@pureadmin/table';
import moment from "moment";
import { ref } from 'vue';
import { useColumns } from '@/views/link_management/link_mark/table';
import 'plus-pro-components/es/components/search/style/css';
import { ElMessage } from 'element-plus'
import {
  type PlusColumn,
  PlusDialog,
  PlusForm,
  PlusSearch
} from 'plus-pro-components';
import {
  LinkMarkType,
  updateLinkMark
} from '@/views/link_management/link_mark/action';
defineOptions({
  name: 'LinksLink'
});
const batchShow = ref(false);
const batchIds = ref('');
const handleBatchDialog = () => {
  batchShow.value = true;
};
const markShow = ref(false);
const markForm = ref<Partial<LinkMarkType>>({
  promotion_intensity: '',
  sales_rank: '',
  keyword: ''
});
const handleMarkConfirm = () => {
  console.log(markForm.value);
};


const handleSubmit = (values: typeof markForm.value) => {
  const keys = multipleSelection.value.map(i => i.链接ID);
  updateLinkMark(keys, values).then(res => {
    if (res.message === 'success') {
      markShow.value = false;
      markForm.value = {
        promotion_intensity: '',
        sales_rank: '',
        keyword: ''
      };
      ElMessage.success('更新成功！');
      queryAction();
    } else {
      ElMessage.error('更新失败！');
    }
  });
};

const {
  loading,
  columns,
  records,
  pagination,
  loadingConfig,
  onSizeChange,
  onCurrentChange,
  multipleSelection,
  search,
  queryAction
} = useColumns();
const markColumns: PlusColumn[] = [
  {
    label: '关键词',
    prop: 'keyword',
    valueType: 'input'
  },
  {
    label: '销售等级',
    prop: 'sales_rank',
    valueType: 'select',
    options: [
      {
        label: '常规款',
        value: '常规款',
        color: 'red'
      },
      {
        label: '爆款',
        value: '爆款',
        color: 'red'
      },
      {
        label: '热销款',
        value: '热销款',
        color: 'blue'
      },
      {
        label: '滞销款',
        value: '滞销款',
        color: 'yellow'
      }
    ]
  },
  {
    label: '推广力度',
    prop: 'promotion_intensity',
    valueType: 'select',
    options: [
      {
        label: '主推',
        value: '主推',
        color: 'red'
      },
      {
        label: '试推',
        value: '试推',
        color: 'blue'
      },
      {
        label: '测款',
        value: '测款',
        color: 'yellow'
      },
      {
        label: '维护',
        value: '维护',
        color: 'red'
      },
      {
        label: '平推',
        value: '平推',
        color: 'red'
      }
    ]
  }
];
const formColumns: PlusColumn[] = [
  {
    label: '链接ID',
    prop: 'link_ids',
    valueType: 'input',
    fieldProps: {
      placeholder: '链接ID'
    }
  },
  {
    label: '时间范围',
    prop: 'date',
    valueType: 'date-picker',
    fieldProps: {
      type: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '请选择开始时间',
      endPlaceholder: '请选择结束时间',
      dateFormat: 'YYYY-MM-DD'
    }
  },
  {
    label: '店铺',
    prop: 'shop',
    valueType: 'input',
    fieldProps: {
      placeholder: '',
    }
  },
  {
    label: '负责人',
    prop: 'head',
    valueType: 'input',
    fieldProps: {
      placeholder: ''
    }
  },
  {
    label: '销售等级',
    prop: 'sales_rank',
    valueType: 'select',
    options: [
      {
        label: '常规款',
        value: '常规款',
        color: 'red'
      },
      {
        label: '爆款',
        value: '爆款',
        color: 'red'
      },
      {
        label: '热销款',
        value: '热销款',
        color: 'blue'
      },
      {
        label: '滞销款',
        value: '滞销款',
        color: 'yellow'
      }
    ]
  },
  {
    label: '推广力度',
    prop: 'promotion_intensity',
    valueType: 'select',
    options: [
      {
        label: '主推',
        value: '主推',
        color: 'red'
      },
      {
        label: '试推',
        value: '试推',
        color: 'blue'
      },
      {
        label: '测款',
        value: '测款',
        color: 'yellow'
      },
      {
        label: '维护',
        value: '维护',
        color: 'red'
      },
      {
        label: '平推',
        value: '平推',
        color: 'red'
      }
    ]
  },
  {
    label: '最小转化率',
    prop: 'conversion_rate_l',
    valueType: 'input-number',
    fieldProps: { precision: 2, step: 0.1},
  },
  {
    label: '最大转化率',
    prop: 'conversion_rate_h',
    valueType: 'input-number',
    fieldProps: { precision: 2, step: 0.1},
  },
  {
    label: '最小销量',
    prop: 'sales_numbers',
    valueType: 'input-number',
    fieldProps: {  step: 1,  min: 0 },
  },
  {
    label: '最小利润率',
    prop: 'profit_rate_l',
    valueType: 'input-number',
    fieldProps: { precision: 2, step: 0.1},
  },
  {
    label: '最大利润率',
    prop: 'profit_rate_h',
    valueType: 'input-number',
    fieldProps: { precision: 2, step: 0.1},
  },
  {
    label: '最小推广费占比',
    prop: 'p_r_l',
    valueType: 'input-number',
    fieldProps: { precision: 2, step: 0.1},
  },
  {
    label: '最大推广费占比',
    prop: 'p_r_h',
    valueType: 'input-number',
    fieldProps: { precision: 2, step: 0.1},
  },
];
const handleSelectionChange = val => {
  multipleSelection.value = val;
};
const handleReset = () => {
  pagination.currentPage = 1;
  search.value =  {
    shop: '',
    conversion_rate_l: 0,
    conversion_rate_h: 1,
    sales_numbers: 0,
    link_ids: [],
    date: [moment().subtract(7, 'days').format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")],
    promotion_intensity: '',
    sales_rank: '',
    sales_volume: 0,
    profit_rate_l: 0,
    profit_rate_h: 1,
    p_r_l: 0,
    p_r_h: 1,
  }

  queryAction();
};
</script>
<template>
  <div class="p-4">
    <div class="mb-6 space-y-4">
      <div>
        <el-button type="primary" @click="handleBatchDialog"
          >批量导入链接ID</el-button
        >
        <el-button
          type="danger"
          :disabled="!multipleSelection.length"
          @click="() => (markShow = true)"
          >标记链接</el-button
        >
      </div>
      <PlusSearch
        v-model="search"
        :columns="formColumns"
        :show-number="3"
        label-width="120"
        label-position="right"
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
      @selection-change="handleSelectionChange"
      @page-size-change="onSizeChange"
      @page-current-change="onCurrentChange"
    ></pure-table>
    <PlusDialog
      v-model="batchShow"
      header="查询"
      cancel-text="取消"
      confirm-text="确定"
      @confirm="
        () => {
          search.link_ids = batchIds.split('\n');
          batchIds = '';
          batchShow = false;
        }
      "
      @cancel="
        () => {
          batchIds = '';
          batchShow = false;
        }
      "
    >
      <el-input
        v-model="batchIds"
        type="textarea"
        autosize
        placeholder="一行一个，回车隔开"
      ></el-input>
    </PlusDialog>
    <PlusDialog
      v-model="markShow"
      title="标记"
      cancel-text="取消"
      confirm-text="确定"
      :has-footer="false"
      @confirm="handleMarkConfirm"
    >
      <PlusForm
        v-model="markForm"
        label-width="120"
        :columns="markColumns"
        @submit="handleSubmit"
      />
    </PlusDialog>
  </div>
</template>
