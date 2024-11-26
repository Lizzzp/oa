import { ref, onMounted, reactive } from 'vue';
import type { PaginationProps, LoadingConfig } from '@pureadmin/table';
import { queryDataType, queryLinkMark } from './action';
import moment from 'moment';
import { formatDate } from '@/views/utils/tools';

export function useColumns() {
  const loading = ref(true);

  const multipleSelection = ref([]);
  const columns: TableColumnList = [
    {
      type: 'selection',
      align: 'left'
    },
    {
      label: '链接ID',
      prop: '链接ID',
      width: '200',
      fixed: true
    },
    {
      label: '上架时间',
      prop: '创建时间',
      width: '200',
      cellRenderer: ({ row }) => formatDate(row.创建时间)
    },
    {
      label: '主图',
      prop: '主图',
      width: '100',
      cellRenderer: ({ row }) => (
        <el-image
          loading="lazy"
          src={row.主图}
          fit="cover"
          style={{ width: '64px', height: '64px' }}
        />
      )
    },
    {
      label: '店铺名称',
      prop: '店铺名称',
      width: 'auto'
    },
    {
      label: '关键词',
      prop: 'keyword',
      width: 'auto'
    },
    {
      label: '促销等级',
      prop: 'promotion_intensity',
      width: 'auto'
    },
    {
      label: '销售力度',
      prop: 'sales_rank',
      width: 'auto'
    },
    {
      label: '负责人',
      prop: 'head',
      width: 'auto'
    },
    {
      label: '销售件数',
      prop: '销售件数',
      width: 'auto'
    },
    {
      label: '销售额',
      prop: '销售额',
      width: 'auto'
    },
    {
      label: '销售利润',
      prop: '销售利润',
      width: 'auto'
    },
    {
      label: '利润率',
      prop: '利润率',
      width: 'auto'
    },
    {
      label: '推广费占比',
      prop: '推广费占比',
      width: 'auto'
    },
    {
      label: '访客数',
      prop: '访客数',
      width: 'auto'
    },
    {
      label: '转化率',
      prop: '转化率',
      width: 'auto'
    }
  ];
  const totalData = ref([]);
  const records = ref([]);
  const search = ref({
    shop: '',
    conversion_rate_l: 0,
    conversion_rate_h: 1,
    sales_numbers: 0,
    link_ids: [],
    date: [
      moment().subtract(7, 'days').format('YYYY-MM-DD'),
      moment().format('YYYY-MM-DD')
    ],
    promotion_intensity: '',
    sales_rank: '',
    sales_volume: 0,
    profit_rate_l: 0,
    profit_rate_h: 1,
    p_r_l: 0,
    p_r_h: 1,
    head: ''
  });
  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 5,
    currentPage: 1,
    pageSizes: [5, 25, 50, 100],
    total: 0,
    align: 'right',
    background: true
  });
  /** 加载动画配置 */
  const loadingConfig = reactive<LoadingConfig>({
    text: '正在加载第一页...',
    viewBox: '-10, -10, 50, 50',
    spinner: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
  });

  async function onSizeChange() {
    pagination.currentPage = 1;
    records.value = totalData.value.slice(
      (pagination.currentPage - 1) * pagination.pageSize,
      pagination.currentPage * pagination.pageSize
    );
  }

  async function onCurrentChange() {
    records.value = totalData.value.slice(
      (pagination.currentPage - 1) * pagination.pageSize,
      pagination.currentPage * pagination.pageSize
    );
  }

  async function queryAction() {
    loadingConfig.text = `正在加载第${pagination.currentPage}页...`;
    loading.value = true;
    const filter: queryDataType = {};
    console.log(search.value);
    if (search.value.shop) {
      filter.shop = search.value.shop;
    }
    filter.conversion_rate_h = search.value.conversion_rate_h;
    filter.conversion_rate_l = search.value.conversion_rate_l;
    filter.sales_numbers = search.value.sales_numbers;
    if (search.value.link_ids) {
      if (
        search.value.link_ids instanceof Array &&
        search.value.link_ids.length
      ) {
        filter.linkids = search.value.link_ids;
      } else if (typeof search.value.link_ids === 'string') {
        filter.linkids = [search.value.link_ids];
      }
    }
    if (search.value.date) {
      filter.begin_date = search.value.date[0];
      filter.end_date = search.value.date[1];
    }
    if (search.value.promotion_intensity) {
      filter.promotion_intensity = search.value.promotion_intensity;
    }
    if (search.value.sales_rank) {
      filter.sales_rank = search.value.sales_rank;
    }
    filter.sales_volume = search.value.sales_volume;
    filter.profit_rate_l = search.value.profit_rate_l;
    filter.profit_rate_h = search.value.profit_rate_h;
    filter.p_r_h = search.value.p_r_h;
    filter.p_r_l = search.value.p_r_l;
    if (search.value.head) {
      filter.head = search.value.head;
    }

    const data = await queryLinkMark(filter);

    const rowCount = (data as any[]).length;

    if (data instanceof Array) {
      records.value = data.slice(
        (pagination.currentPage - 1) * pagination.pageSize,
        pagination.currentPage * pagination.pageSize
      );
    }
    totalData.value = data as any[];
    if (typeof rowCount === 'number') {
      pagination.total = rowCount;
    }
    loadingConfig.text = '';
    loading.value = false;
  }

  onMounted(async () => {
    await queryAction();
  });

  return {
    loading,
    columns,
    records,
    multipleSelection,
    pagination,
    search,
    queryAction,
    loadingConfig,
    onSizeChange,
    onCurrentChange
  };
}
