<template>
  <div class="justify-center max-w-lg mt-10">
    <h1 class="font-extrabold tracking-tigh text-3xl leading-10">
      Here's GraphQL API demo
    </h1>
    <p class="font-normal my-3 text-xs">
      It's based on
      <a
        class="text-sky-500 cursor-pointer"
        href="https://github.com/trevorblades/countries"
        target="_blank"
        >countries</a
      >
      GraphQL API, which do not support pagination, but allows filtering by ISO
      and name
    </p>
    <section>
      <table class="w-full border-2 border-solid border-gray-200">
        <thead class="text-left border-solid border-b-2 border-gray-200 w-full">
          <tr>
            <th class="w-1/6">
              <input
                v-model="form.code"
                type="text"
                placeholder="ISO2"
                class="w-11/12 rounded-sm bg-gray-200 px-1"
                v-on:keypress="(e) => filterAlpha(e, 2)"
                v-on:keyup.enter="load"
              />
            </th>
            <th class="w-5/12">
              <input
                v-model="form.name"
                type="text"
                placeholder="Name"
                class="w-11/12 rounded-sm bg-gray-200 px-1"
                v-on:keypress="filterAlpha"
                v-on:keyup.enter="load"
              />
            </th>
            <th class="w-5/12 px-1">Capital</th>
          </tr>
        </thead>
        <tbody
          class="text-left overflow-x-hidden overflow-y-scroll block h-screen"
        >
          <transition-group>
            <router-link
              v-for="country in countries"
              :key="country.code"
              :to="`/result/${country.code}`"
              class="cursor-pointer hover:bg-gray-200 hover:shadow hover:shadow-slate-500 block w-full transition-all"
              exact-active-class="cursor-pointer hover:bg-gray-200 shadow shadow-slate-500 block w-full transition-all"
            >
              <tr
                class="cursor-pointer hover:bg-gray-200 hover:shadow hover:shadow-slate-500 block w-full transition-all"
                v-on:click="go(country.code!)"
              >
                <td class="w-1/6 px-1">{{ country.code }}</td>
                <td class="w-5/12 px-1">{{ country.name }}</td>
                <td class="w-5/12 px-1">{{ country.capital }}</td>
              </tr>
            </router-link>
          </transition-group>
        </tbody>
      </table>
      <div class="flex-row justify-start gap-3 flex mt-3">
        <button
          :disabled="loading"
          class="shadow-zinc-700 shadow hover:bg-slate-400 transition-all p-2 grow disabled:hover:bg-transparent disabled:opacity-50"
          :class="{ disabled: !dirty }"
          v-on:click="load"
        >
          <FontAwesomeIcon
            :spin-pulse="loading"
            size="xl"
            :icon="loading ? faSpinner : faArrowsRotate"
            pull="left"
          />
          Refresh
        </button>
        <button
          :disabled="!dirty"
          class="shadow-zinc-700 shadow hover:bg-slate-400 transition-all p-2 grow disabled:hover:bg-transparent disabled:opacity-50"
          :class="{ disabled: !dirty }"
          v-on:click="reset"
        >
          <FontAwesomeIcon
            size="xl"
            :icon="faClose"
            transform="grow-3"
            pull="left"
          />
          Clear filters
        </button>
      </div>
    </section>
    <section>
      <router-view />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import request, { gql } from 'graphql-request'
import { Country } from '@/types/country'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'
import {
  faArrowsRotate,
  faClose,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()

const formDebounce = ref<number>(0)
const loading = ref(false)
const countries = ref<Country[]>([])
const form = ref({ code: '', name: '' })

const dirty = computed(() => form.value.code !== '' || form.value.name !== '')

const go = (code: string) =>
  router.push({ name: 'Result Details', params: { code } })

const reset = () => {
  form.value.code = ''
  form.value.name = ''
}

const load = async () => {
  if (loading.value === true) {
    return
  }

  loading.value = true

  const filtersArray = Object.entries(form.value).reduce(
    (acc: string[], [key, value]) => {
      if (value.length) {
        acc.push(`${key}: { regex: "${value}" }`)
      }
      return acc
    },
    [],
  )

  let filters = ''

  if (filtersArray.length) {
    filters = `(filter: {${filtersArray.join(', ')}})`
  }

  const document = gql`
    {
      countries ${filters} {
        code
        name
        capital
      }
    }
  `

  try {
    const result = await request<{ countries: Country[] }>(
      'https://countries.trevorblades.com/',
      document,
    )
    countries.value = result.countries
    toast('List refreshed', { type: 'success', autoClose: 1500 })
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

const filterAlpha = (e: KeyboardEvent, limit = Infinity) => {
  if (
    !/^[A-Za-z]+$/.test(e.key) ||
    (e.target as HTMLInputElement).value.length >= limit
  ) {
    e.preventDefault()
  }
}

watch(form.value, () => {
  clearTimeout(formDebounce.value)
  formDebounce.value = setTimeout(load, 1500)
})
onMounted(load)
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

thead tr {
  width: calc(100% - 1rem);
}
tbody {
  display: block;
  height: 50vh;
}
tr {
  display: block;
}
td,
th {
  display: inline-block;
}
</style>
