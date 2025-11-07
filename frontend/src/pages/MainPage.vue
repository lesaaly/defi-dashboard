<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from 'src/api/api'

interface Transaction {
  hash: string
  from_address: string
  to_address: string
  value: string
  amount?: string
  transaction_fee: string
}

const nftsCount = ref(0)
const txCount = ref(0)
const transactions = ref<Transaction[]>([])

const columns = [
  { name: 'hash', label: 'Tx Hash', field: 'hash', align: 'left' as const },
  { name: 'from', label: 'From', field: 'from_address', align: 'left' as const },
  { name: 'to', label: 'To', field: 'to_address', align: 'left' as const },
  { name: 'value', label: 'Value (ETH)', field: 'value', align: 'right' as const },
  { name: 'fee', label: 'Fee (ETH)', field: 'transaction_fee', align: 'right' as const },
]

onMounted(async () => {
  try {
    const address = '0xf977814e90da44bfa03b6295a0616a897441acec' // временно
    // const { data: balanceData } = await api.get(`/wallets/${address}/balance`)
    const { data: nftData } = await api.get(`/wallets/${address}/nfts`)
    const { data: txData } = await api.get(`/wallets/${address}/transactions`)

    if (Array.isArray(nftData)) {
      nftsCount.value = nftData.length
    }
    if (Array.isArray(txData)) {
      txCount.value = txData.length
      transactions.value = txData.slice(0, 3)
    } else {
      console.error('Транзакции не являются массивом:', txData)
      transactions.value = []
    }
    console.log('Транзакции:', txData)
  } catch (err) {
    console.error('Ошибка при загрузке данных:', err)
    transactions.value = []
  }
})
</script>

<template>
  <q-page class="q-pa-lg main_page">
    <div class=""></div>
    <div class="">
      <div class="text-title mb-m">Latest Transactions</div>
      <q-table
        :rows="transactions"
        :columns="columns"
        row-key="hash"
        flat
        bordered
        hide-pagination
        class="main_page_table"
      />
    </div>
    <div class="main_page_item_3"></div>
  </q-page>
</template>

<style lang="scss" scoped>
.main_page {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;

  &_item_3 {
    grid-column: 2;
    grid-row: 1 / 3;
  }

  &_box {
    background: $secondary;
  } 

}

.q-table__card {
  background-color: $secondary;
  border-radius: 30px;
}
</style>
