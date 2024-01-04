<template>
  <div class="justify-center mt-10 border-t-2 border-gray-200 border-solid">
    <p class="font-normal my-3 text-xs">
      Here's 3rd level router with country details, which being retrieved on
      router's component mount or route update
    </p>
    <transition mode="out-in">
      <FontAwesomeIcon
        v-if="loading"
        :spin-pulse="true"
        size="xl"
        :icon="faSpinner"
        class="text-sky-400 mt-7"
      />
      <section v-else-if="!loading && country" class="mt-7 font-medium">
        <p>{{ country.code }} | {{ country.name }} | {{ country.native }}</p>
        <p>{{ country.capital }}</p>
        <p>
          {{ languages }}
        </p>
      </section>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { Country } from '@/types/country'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import request, { gql } from 'graphql-request'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'

const loading = ref(false)
const country = ref<Country>()
const route = useRoute()

const languages = computed(
  () => country.value?.languages.map((v) => v.name).join(', '),
)

const load = async () => {
  loading.value = true

  const document = gql`
    {
      country(code: "${route.params.code}") {
        code
        name
        native
        capital
        emoji
        currency
        languages {
          code
          name
        }
      }
    }
  `
  try {
    const result = await request<{ country: Country }>(
      'https://countries.trevorblades.com/',
      document,
    )
    country.value = result.country
  } catch (e) {
    let message
    if (e instanceof Error) {
      message = e.message
    } else {
      message = (e as { errors: Array<{ message: string }> }).errors
        .map((v) => v.message)
        .join('\r')
    }
    toast(message, { type: 'error' })
  }
  loading.value = false
}
onMounted(load)
watch(route, load)
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
