import { ref } from "vue";
/**
 * Composable
 * Element Plus
 * 1. 对Element Plus的分页进行抽离
 * 2. action: 表格数据刷新
 */

export const usePager = (callback: Function) => {
  const pageSizes = ref([10, 20, 50]); // 分页组件中切换每页显示数据量的下拉框数据
  const currentPage = ref(1); // 当前页
  const pageSize = ref(10); // 每页的数据量
  const total = ref(0); // 总共多少数据
  const pagerCount = 7;
  const layout = "total, sizes, prev, pager, next, jumper";
  const background = false;

  const handleSizeChange = (size: number) => {
    currentPage.value = 1;
    pageSize.value = size;
    callback();
  };
  const handCurrentChange = (page: number) => {
    currentPage.value = page;
    callback();
  };

  return {
    pageSizes,
    currentPage,
    pageSize,
    total,
    pagerCount,
    layout,
    background,
    handleSizeChange,
    handCurrentChange
  };
};
