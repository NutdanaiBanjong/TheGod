<template>
  <div class="about">
    <h1>This is an Product page</h1>
    <div v-for="item in product" :key="item.id">
      <h1>ชื่อสินค้า {{ item.name }}</h1>
    </div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data() {
    return {
      product: []
    }
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3000/product')
      // console.log(response.data.products)
      this.product = response.data.products
    } catch (error) {
      console.log(error)
    }
  },
  mounted() {
    const checkToken = localStorage.getItem('access_token')
    // console.log(checkToken)
    if (checkToken === null) {
      this.$router.push('/')
    }
  }
}
</script>
