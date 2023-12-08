import useSWRV from 'swrv'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { trpc } from '../trpc'
import { SearchOutput } from '@sovok/shared'
import { debouncedWatch } from '@vueuse/shared'

const DEBOUNCE_MS = 1700

export const useSearch = () => {
  const router = useRouter()
  const route = useRoute()

  const existingQuery = (route.query.q as string) ?? ''

  const isFirstSearch = ref(true)

  const searchTerm = ref(existingQuery)
  const debouncedSearchTerm = ref(existingQuery)

  if (route.query.q) {
    searchTerm.value = route.query.q as string
    debouncedSearchTerm.value = route.query.q as string
  }

  const fetchImmediately = () => {
    debouncedSearchTerm.value = searchTerm.value

    router.replace({
      ...route,
      query: {
        ...route.query,
        q: searchTerm.value,
      },
    })
  }

  debouncedWatch(searchTerm, fetchImmediately, { debounce: DEBOUNCE_MS })

  const { data, isValidating } = useSWRV<SearchOutput>(
    () => `search-${debouncedSearchTerm.value}`,
    async () => {
      if (debouncedSearchTerm.value.length < 3) {
        isFirstSearch.value = true
        return []
      }

      isFirstSearch.value = false

      const result = await trpc.music.search.query({
        query: debouncedSearchTerm.value,
      })

      return result
    },
    { shouldRetryOnError: false, revalidateOnFocus: false },
  )

  return {
    searchTerm,
    data,
    fetchImmediately,
    isValidating,
    isFirstSearch,
  }
}
