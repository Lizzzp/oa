import { ref, onMounted, reactive } from 'vue';
import type { PaginationProps, LoadingConfig } from '@pureadmin/table';
import { queryLinkMark, queryLinkMarkTotal } from './action';

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
      prop: 'link_id.id',
      width: '200',
      fixed: true
    },

    {
      label: '主图',
      prop: 'link_id.primary_image_url',
      width: '100',
      cellRenderer: ({ row }) => (
        <el-image
          loading="lazy"
          src={row.link_id.primary_image_url}
          fit="cover"
          style={{ width: '64px', height: '64px' }}
        />
      )
    },
    {
      label: '店铺',
      prop: 'link_id.shop',
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
      prop: 'head.first_name',
      width: 'auto'
    }
  ];
  const records = ref([]);
  const search = ref({
    link_ids: '',
    shop: '',
    head: '',
    promotion_intensity: '',
    sales_rank: ''
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
    await queryAction();
  }

  async function onCurrentChange() {
    await queryAction();
  }

  async function queryAction() {
    loadingConfig.text = `正在加载第${pagination.currentPage}页...`;
    loading.value = true;
    const filter = {
      _and: []
    };

    if (search.value.link_ids) {
      filter._and.push({
        link_id: {
          _in: search.value.link_ids.split(',')
        }
      });
    }
    if (search.value.shop) {
      filter._and.push({
        link_id: {
          shop: {
            _eq: search.value.shop
          }
        }
      });
    }
    if (search.value.promotion_intensity) {
      filter._and.push({
        promotion_intensity: {
          _eq: search.value.promotion_intensity
        }
      });
    }
    if (search.value.sales_rank) {
      filter._and.push({
        sales_rank: {
          _eq: search.value.sales_rank
        }
      });
    }
    if (search.value.head) {
      filter._and.push({
        head: {
          first_name: {
            _eq: search.value.head
          }
        }
      });
    }
    const data = await queryLinkMark({
      filter,
      page: pagination.currentPage,
      limit: pagination.pageSize,
      sort: '-date_updated'
    });

    const rowCount = await queryLinkMarkTotal({ filter });

    if (data instanceof Array) {
      records.value = data;
    }
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
