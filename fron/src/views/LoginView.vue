<template>
  <div>
    <h1>Login Page</h1>
    <form @submit.prevent="login">
      <div>
        <label>Username :</label>
        <input type="text" v-model="username" />
      </div>
      <div>
        <label>Password :</label>
        <input type="password" v-model="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          username: this.username,
          password: this.password
        })
        // console.log(response.data, 'res')
        if (response.status === 200) {
          localStorage.setItem('access_token', response.data.access_token)
          this.$router.push('/product')
        }
      } catch (error) {
        // console.log(err)
        if (error.response.status === 400) {
          alert('กรอก Username และ Password')
        } else {
          alert('ไม่พบ User')
        }
      }
    }
  }
}
</script>
