import { ref, onMounted, reactive } from 'vue';
import type { PaginationProps, LoadingConfig } from '@pureadmin/table';
import { http } from '@/utils/http';

export function useColumns() {
  const loading = ref(true);
  const select = ref('no');
  const columns: TableColumnList = [
    {
      label: '链接ID',
      prop: 'id',
      columnKey: 'id',
      align: 'center',
      width: '200',
      fixed: true
    },
    {
      label: '平台',
      prop: 'platform',
      align: 'center',
      width: '120',
      columnKey: 'platform'
    },
    {
      label: '公司',
      prop: 'company',
      align: 'center',
      width: '120',
      columnKey: 'company'
    },
    {
      label: '店铺',
      prop: 'shop',
      width: '160',
      align: 'center',
      columnKey: 'shop'
    },
    {
      label: '链接品类',
      prop: 'category',
      align: 'center',
      width: 'auto',
      columnKey: 'category',
      cellRenderer: ({ row }) => (
        <el-popover placement="top-start" width="auto" trigger="hover">
          {{
            default: () => (
              <>
                <el-button>{row.category}</el-button>
              </>
            ),
            reference: () => <el-tag>{row.category.split('/')[0]}</el-tag>
          }}
        </el-popover>
      )
    },
    {
      label: '标题',
      prop: 'title',
      align: 'center',
      cellRenderer: ({ row }) => (
        <el-popover placement="top-start" width="auto" trigger="hover">
          {{
            default: () => (
              <>
                <el-button>{row.title}</el-button>
              </>
            ),
            reference: () => <el-tag>{row.title.slice(0, 10)}</el-tag>
          }}
        </el-popover>
      )
    },
    {
      label: '链接URL',
      prop: 'url',
      align: 'center',
      minWidth: '320',
      cellRenderer: ({ row }) => (
        <el-link href={row.url} target="_blank">
          {row.url}
        </el-link>
      )
    },
    {
      label: '主图',
      prop: 'primary_image_url',
      width: '100',
      align: 'center',
      columnKey: 'primary_image_url',
      cellRenderer: ({ row }) => (
        <el-image
          loading="lazy"
          src={row.primary_image_url}
          fit="cover"
          style={{ width: '64px', height: '64px' }}
        />
      )
    },
    {
      label: '负责人',
      prop: 'head',
      align: 'center',
      columnKey: 'head'
    },
    {
      label: '链接状态',
      prop: 'status',
      columnKey: 'status'
    }
  ];
  const records = ref([]);
  const search = ref({
    id: '',
    status: ''
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

    if (search.value.id) {
      filter._and.push({
        id: {
          _eq: search.value.id
        }
      });
    }
    if (search.value.status) {
      filter._and.push({
        status: {
          _eq: search.value.status
        }
      });
    }

    const { data } = await http.request('get', '/api/items/link', {
      params: {
        limit: pagination.pageSize,
        page: pagination.currentPage - 1,
        sort: '-date_updated',
        filter
      }
    });
    const rowCount = (
      await http.request('get', '/api/items/link', {
        params: {
          'aggregate[countDistinct]': 'id',
          filter
        }
      })
    ).data[0].countDistinct.id;
    loadingConfig.text = '';
    loading.value = false;
    pagination.total = rowCount;
    records.value = data;
  }

  onMounted(async () => {
    await queryAction();
  });

  return {
    loading,
    columns,
    records,
    select,
    pagination,
    search,
    queryAction,
    loadingConfig,
    onSizeChange,
    onCurrentChange
  };
}
