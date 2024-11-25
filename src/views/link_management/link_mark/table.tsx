import { ref, onMounted, reactive } from 'vue';
import type { PaginationProps, LoadingConfig } from '@pureadmin/table';
import { queryDataType, queryLinkMark} from './action';

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
      prop: '负责人',
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
    },
  ];
  const totalData = ref([])
  const records = ref([]);
  const search = ref({
    shop: '',
    conversion_rate_l: null,
    conversion_rate_h: null,
    sales_numbers: null,
    linkids: [],
    begin_date: '',
    end_date: '',
    promotion_intensity: '',
    sales_rank: '',
    sales_volume: null,
    profit_rate_l: null,
    profit_rate_h: null,
    p_r_l: null,
    p_r_h: null,
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
    // svg: "",
    // background: rgba()
  });

  async function onSizeChange() {
    pagination.currentPage = 1;
    if (totalData instanceof Array) {
      records.value = totalData.slice(pagination.currentPage, (pagination.currentPage + 1) * pagination.pageSize);
    }
  }

  async function onCurrentChange() {
    if (totalData instanceof Array) {
      records.value = totalData.slice(pagination.currentPage, (pagination.currentPage + 1) * pagination.pageSize);
    }
  }

  async function queryAction() {
    loadingConfig.text = `正在加载第${pagination.currentPage}页...`;
    loading.value = true;
    const filter: queryDataType = {};

    if (search.value.shop) {
      filter.shop = search.value.shop
    }
    if (search.value.conversion_rate_h) {
      filter.conversion_rate_h = search.value.conversion_rate_h
    }
    if (search.value.conversion_rate_l) {
      filter.conversion_rate_h = search.value.conversion_rate_l
    }
    if (search.value.sales_numbers) {
      filter.sales_numbers = search.value.sales_numbers
    }
    if (search.value.linkids.length) {
      filter.linkids = search.value.linkids
    }
    if (search.value.begin_date) {
      filter.begin_date = search.value.begin_date
    }
    if (search.value.end_date) {
      filter.end_date = search.value.end_date
    }
    if (search.value.promotion_intensity) {
      filter.promotion_intensity = search.value.promotion_intensity
    }
    if (search.value.sales_rank) {
      filter.sales_rank = search.value.sales_rank
    }
    if (search.value.sales_volume) {
      filter.sales_volume = search.value.sales_volume
    }
    if (search.value.profit_rate_l) {
      filter.profit_rate_l = search.value.profit_rate_l
    }
    if (search.value.profit_rate_h) {
      filter.profit_rate_h = search.value.profit_rate_h
    }
    if (search.value.p_r_h) {
      filter.p_r_h = search.value.p_r_h
    }
    if (search.value.p_r_l) {
      filter.p_r_l = search.value.p_r_l
    }
    filter.begin_date = "2024-11-23",
    filter.end_date= "2024-11-25"

    const data = await queryLinkMark(filter);

    const rowCount = (data as any[]).length;

    if (data instanceof Array) {
      records.value = data.slice(pagination.currentPage, (pagination.currentPage + 1) * pagination.pageSize);
    }
    totalData.value = (data as any[]);
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
