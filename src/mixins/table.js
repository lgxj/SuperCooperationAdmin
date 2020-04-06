import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      page: 1,
      pageSize: 10,
      sort_key: '',
      sort_order: '',
      total: 0,
      tableLoading: true,
      list: [],
      search: {},
      searchFormRef: 'search-form',
      listQuery: {
        page: 1,
        limit: 20,
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        sort: 'id'
      },
      editIndex: ''
    }
  },
  methods: {
    init() {
      this.loadData()
    },
    loadData() {
      // ...
    },
    // 加载数据完成
    loadedData(res) {
      this.list = res.data.list
      this.total = res.data.total
      this.tableLoading = false
    },
    // 翻页及调整页容量
    pagination(page) {
      this.page = page
      this.tableLoading = true
      this.loadData()
    },
    // 搜索
    handleSearch() {
      this.tableLoading = true
      this.page = 1
      this.loadData()
    },
    handleRefresh() {
      this.tableLoading = true
      this.page = 1
      this.loadData()
    }
  }
}
